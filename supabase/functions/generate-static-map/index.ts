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
        // Generate new static map image
        const [lng, lat] = app.coordinates
        const width = 800
        const height = 600
        const zoom = 17
        const pitch = 60 // Add pitch for 3D effect
        const bearing = 45 // Add bearing for angled view
        
        // Generate multiple views with different angles and zooms
        const views = [
          { pitch: 60, bearing: 45, zoom: 17 },
          { pitch: 45, bearing: 0, zoom: 16 },
          { pitch: 30, bearing: 90, zoom: 18 },
          { pitch: 0, bearing: 0, zoom: 17 },
        ]

        const staticMapUrls = views.map(view => 
          `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${lng},${lat},${view.zoom},${view.bearing},${view.pitch}/${width}x${height}@2x?access_token=${mapboxToken}&logo=false`
        )

        // Update the applications table with the visualization URLs
        const { error: updateError } = await supabase
          .from('applications')
          .update({ 
            image_link: { 
              visualizations: staticMapUrls 
            }
          })
          .eq('application_id', app.application_id)

        if (updateError) {
          console.error(`Error updating application ${app.application_id}:`, updateError)
          throw updateError
        }

        console.log(`Updated visualizations for application ${app.application_id}`)
        return {
          application_id: app.application_id,
          visualizations: staticMapUrls
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