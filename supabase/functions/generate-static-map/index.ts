import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Application {
  application_id: number;
  coordinates: [number, number];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { applications } = await req.json()
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

    const processedApplications = applications.slice(0, 10) // Limit to 10 applications

    const results = await Promise.all(
      processedApplications.map(async (app: Application) => {
        // Check if image already exists
        const { data: existingImage } = await supabase
          .from('application_map_images')
          .select('image_url')
          .eq('application_id', app.application_id)
          .single()

        if (existingImage) {
          console.log(`Using existing image for application ${app.application_id}`)
          return {
            application_id: app.application_id,
            image_url: existingImage.image_url
          }
        }

        // Generate new static map image
        const [lng, lat] = app.coordinates
        const zoom = 17 // Increased zoom level for more detail
        const width = 800 // Increased width for better quality
        const height = 600 // Increased height for better quality
        
        // Using satellite-v9 style with higher brightness and contrast
        const staticMapUrl = `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${lng},${lat},${zoom},0,45/${width}x${height}@2x?access_token=${mapboxToken}&setfilter=["brightness",1.1]&setfilter=["contrast",1.2]`

        // Store the URL in Supabase
        const { error: insertError } = await supabase
          .from('application_map_images')
          .insert({
            application_id: app.application_id,
            image_url: staticMapUrl
          })

        if (insertError) {
          console.error(`Error storing image for application ${app.application_id}:`, insertError)
          throw insertError
        }

        console.log(`Generated new image for application ${app.application_id}`)
        return {
          application_id: app.application_id,
          image_url: staticMapUrl
        }
      })
    )

    return new Response(
      JSON.stringify({ images: results }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
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
          'Content-Type': 'application/json',
        },
        status: 400,
      },
    )
  }
})