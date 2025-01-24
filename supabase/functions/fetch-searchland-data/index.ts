import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SearchlandResponse {
  features: Array<{
    type: string;
    properties: {
      application_reference: string;
      description: string;
      status: string;
      decision_date?: string;
      submission_date?: string;
      address?: string;
      ward?: string;
      consultation_end_date?: string;
      application_type?: string;
      applicant_name?: string;
    };
    geometry?: {
      type: string;
      coordinates: [number, number];
    };
  }>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { bbox } = await req.json()
    const apiKey = Deno.env.get('SEARCHLAND_API_KEY')

    if (!apiKey) {
      console.error('Searchland API key not found in environment variables')
      throw new Error('Searchland API key not found')
    }

    console.log('Fetching Searchland data with bbox:', bbox)
    console.log('API Key exists:', !!apiKey)

    // Updated API endpoint to use the correct path
    const response = await fetch(
      `https://api.searchland.co.uk/v2/planning/applications/search?bbox=${bbox}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    )

    console.log('Searchland API response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Searchland API error response:', errorText)
      throw new Error(`Searchland API error: ${response.status} - ${errorText}`)
    }

    const data: SearchlandResponse = await response.json()
    console.log(`Received ${data.features?.length || 0} applications from Searchland`)

    // Store in Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials not found')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Store each application
    for (const feature of data.features) {
      const { error } = await supabase
        .from('searchland_applications')
        .upsert({
          application_reference: feature.properties.application_reference,
          description: feature.properties.description,
          status: feature.properties.status,
          decision_date: feature.properties.decision_date,
          submission_date: feature.properties.submission_date,
          address: feature.properties.address,
          ward: feature.properties.ward,
          consultation_end_date: feature.properties.consultation_end_date,
          application_type: feature.properties.application_type,
          applicant_name: feature.properties.applicant_name,
          location: feature.geometry ? 
            `POINT(${feature.geometry.coordinates[0]} ${feature.geometry.coordinates[1]})` : 
            null,
          raw_data: feature
        }, {
          onConflict: 'application_reference'
        })

      if (error) {
        console.error('Error storing application:', error)
      }
    }

    return new Response(
      JSON.stringify({ applications: data.features }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )

  } catch (error) {
    console.error('Error in fetch-searchland-data:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        context: 'Failed to fetch or process Searchland data'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json'}
      }
    )
  }
})