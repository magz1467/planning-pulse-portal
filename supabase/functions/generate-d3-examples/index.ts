import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Application {
  application_id: number;
  centroid: { lat: number; lon: number };
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

    // Validate applications data
    const validApplications = applications.filter(app => {
      if (!app.application_id || !app.centroid) {
        console.log('Skipping invalid application:', app)
        return false
      }
      return true
    })

    if (validApplications.length === 0) {
      throw new Error('No valid applications to process')
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

    // Process only valid applications
    for (const app of validApplications) {
      console.log('Processing application:', app.application_id)
      
      try {
        // Get nearest image from Mapillary
        const { lon, lat } = app.centroid
        const radius = 50 // meters

        const mapillaryResponse = await fetch(
          `https://graph.mapillary.com/images?access_token=${mapillaryToken}&fields=id,thumb_2048_url&limit=1&radius=${radius}&closeto=${lon},${lat}`,
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
        console.log('Mapillary response:', mapillaryData)
        
        const images = mapillaryData.data || []
        const imageUrl = images[0]?.thumb_2048_url

        if (!imageUrl) {
          console.log(`No image found for application ${app.application_id}`)
          results.push({
            application_id: app.application_id,
            error: 'No image found in this location'
          })
          continue
        }

        // Update the applications table with the visualization URL
        const { error: updateError } = await supabase
          .from('applications')
          .update({ 
            image_link: { 
              mapillary: imageUrl,
              generated_at: new Date().toISOString()
            }
          })
          .eq('application_id', app.application_id)

        if (updateError) {
          console.error(`Error updating application ${app.application_id}:`, updateError)
          throw updateError
        }

        console.log(`Successfully generated visualization for application ${app.application_id}:`, imageUrl)
        results.push({
          application_id: app.application_id,
          visualization: imageUrl
        })

      } catch (error) {
        console.error('Error processing application:', error)
        results.push({
          application_id: app.application_id,
          error: error.message
        })
      }
    }

    console.log('Successfully processed all applications:', results)

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