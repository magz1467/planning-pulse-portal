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
    const mapillaryToken = Deno.env.get('MAPILLARY_API_KEY')
    
    if (!mapillaryToken) {
      throw new Error('MAPILLARY_API_KEY not found')
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
        try {
          // Get nearest images from Mapillary
          const [lng, lat] = app.coordinates
          const radius = 50 // meters
          const limit = 5 // number of images to fetch

          const mapillaryResponse = await fetch(
            `https://graph.mapillary.com/images?access_token=${mapillaryToken}&fields=id,thumb_2048_url&limit=${limit}&radius=${radius}&closeto=${lng},${lat}`,
            {
              headers: {
                'Content-Type': 'application/json',
              }
            }
          )

          if (!mapillaryResponse.ok) {
            throw new Error(`Mapillary API error: ${mapillaryResponse.statusText}`)
          }

          const mapillaryData = await mapillaryResponse.json()
          const images = mapillaryData.data || []
          const imageUrls = images.map((img: any) => img.thumb_2048_url)

          // Update the applications table with the visualization URLs
          const { error: updateError } = await supabase
            .from('applications')
            .update({ 
              image_link: { 
                visualizations: imageUrls 
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
            visualizations: imageUrls
          }
        } catch (error) {
          console.error(`Error processing application ${app.application_id}:`, error)
          return {
            application_id: app.application_id,
            error: error.message
          }
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