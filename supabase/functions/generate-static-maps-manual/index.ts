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

    // Get all applications with coordinates
    const { data: applications, error: fetchError } = await supabase
      .from('applications')
      .select('application_id, coordinates')
      .not('coordinates', 'is', null)
      .limit(100) // Process in batches

    if (fetchError) {
      throw fetchError
    }

    console.log(`Processing ${applications.length} applications`)

    const results = await Promise.all(
      applications.map(async (app) => {
        try {
          if (!app.coordinates) {
            console.log(`Skipping application ${app.application_id} - no coordinates`)
            return null
          }

          const [lat, lng] = app.coordinates
          
          // Generate static map URL with 3D effect
          const width = 800
          const height = 600
          const zoom = 17
          const pitch = 60
          const bearing = 45

          const staticMapUrl = `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/${lng},${lat},${zoom},${bearing},${pitch}/${width}x${height}@2x?access_token=${mapboxToken}&logo=false`

          // Store or update the URL in Supabase
          const { error: upsertError } = await supabase
            .from('application_map_images')
            .upsert({
              application_id: app.application_id,
              image_url: staticMapUrl
            }, {
              onConflict: 'application_id'
            })

          if (upsertError) {
            throw upsertError
          }

          console.log(`Successfully processed application ${app.application_id}`)
          return {
            application_id: app.application_id,
            image_url: staticMapUrl,
            status: 'success'
          }

        } catch (error) {
          console.error(`Error processing application ${app.application_id}:`, error)
          return {
            application_id: app.application_id,
            error: error.message,
            status: 'error'
          }
        }
      })
    )

    const successCount = results.filter(r => r?.status === 'success').length
    const errorCount = results.filter(r => r?.status === 'error').length

    return new Response(
      JSON.stringify({
        message: `Processed ${results.length} applications`,
        success: successCount,
        errors: errorCount,
        results: results
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