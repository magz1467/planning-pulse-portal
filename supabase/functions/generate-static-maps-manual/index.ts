import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { batch_size = 100 } = await req.json();
    const limit = Math.min(Math.max(1, batch_size), 500); // Cap at 500, minimum 1
    
    const mapboxToken = Deno.env.get('MAPBOX_PUBLIC_TOKEN')
    if (!mapboxToken) {
      throw new Error('MAPBOX_PUBLIC_TOKEN not found')
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase credentials not found')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get all applications with coordinates but no image
    const { data: applications, error: fetchError } = await supabase
      .from('applications')
      .select('application_id, geom')
      .is('image_map_url', null)  
      .not('geom', 'is', null)
      .limit(limit)

    if (fetchError) {
      throw fetchError
    }

    console.log(`Processing ${applications.length} applications`)

    // Process in smaller chunks to avoid rate limits
    const chunkSize = 10;
    const chunks = [];
    for (let i = 0; i < applications.length; i += chunkSize) {
      chunks.push(applications.slice(i, i + chunkSize));
    }

    let successCount = 0;
    let errorCount = 0;

    for (const chunk of chunks) {
      const results = await Promise.all(
        chunk.map(async (app) => {
          try {
            if (!app.geom) {
              console.log(`Skipping application ${app.application_id} - no coordinates`)
              return { status: 'error' }
            }

            const coordinates = app.geom.coordinates
            if (!coordinates || coordinates.length < 2) {
              console.log(`Invalid coordinates for application ${app.application_id}`)
              return { status: 'error' }
            }

            const [lng, lat] = coordinates
            
            // Generate static map URL with 3D effect
            const width = 800
            const height = 600
            const zoom = 17
            const pitch = 60
            const bearing = 45

            const staticMapUrl = `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/${lng},${lat},${zoom},${bearing},${pitch}/${width}x${height}@2x?access_token=${mapboxToken}&logo=false`

            // Update the application with the new image URL
            const { error: updateError } = await supabase
              .from('applications')
              .update({ image_map_url: staticMapUrl })
              .eq('application_id', app.application_id)

            if (updateError) {
              throw updateError
            }

            console.log(`Successfully processed application ${app.application_id}`)
            return { status: 'success' }

          } catch (error) {
            console.error(`Error processing application ${app.application_id}:`, error)
            return { status: 'error' }
          }
        })
      )

      successCount += results.filter(r => r.status === 'success').length
      errorCount += results.filter(r => r.status === 'error').length

      // Add a small delay between chunks to respect rate limits
      if (chunks.length > 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return new Response(
      JSON.stringify({
        message: `Processed ${applications.length} applications`,
        success: successCount,
        errors: errorCount,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 400,
      },
    )
  }
})