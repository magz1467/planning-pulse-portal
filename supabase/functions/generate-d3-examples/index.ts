import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Application {
  application_id: number;
  centroid: { lat: number; lon: number };
  description: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { applications } = await req.json()
    console.log('Received request to generate visualizations for applications:', applications)

    if (!applications || !Array.isArray(applications)) {
      throw new Error('Invalid or missing applications array')
    }

    const mapillaryToken = Deno.env.get('MAPILLARY_API_KEY')
    if (!mapillaryToken) {
      throw new Error('MAPILLARY_API_KEY not found')
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials not found')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    const results = []

    for (const app of applications.slice(0, 10)) {
      console.log('Processing application:', app.application_id)
      
      try {
        // Get nearest images from Mapillary
        const { lon, lat } = app.centroid
        const radius = 50 // meters
        const limit = 5 // number of images to fetch

        const mapillaryResponse = await fetch(
          `https://graph.mapillary.com/images?access_token=${mapillaryToken}&fields=id,thumb_2048_url&limit=${limit}&radius=${radius}&closeto=${lon},${lat}`,
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

        console.log(`Successfully generated visualizations for application ${app.application_id}`)
        results.push({
          application_id: app.application_id,
          visualizations: imageUrls
        })

      } catch (error) {
        console.error('Error processing application:', error)
        results.push({
          application_id: app.application_id,
          error: error.message
        })
      }
    }

    console.log('Successfully generated all visualizations')

    return new Response(
      JSON.stringify({ 
        success: true,
        visualizations: results 
      }),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('Error generating visualizations:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 400
      }
    )
  }
})