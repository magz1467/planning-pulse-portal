import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

interface SearchlandPin {
  id: string;
  location: {
    coordinates: [number, number];
  };
  status: string;
  application_reference: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { bbox } = await req.json()
    console.log('Fetching Searchland pins for bbox:', bbox)

    if (!bbox) {
      throw new Error('bbox parameter is required')
    }

    const SEARCHLAND_API_KEY = Deno.env.get('SEARCHLAND_API_KEY')
    if (!SEARCHLAND_API_KEY) {
      throw new Error('SEARCHLAND_API_KEY is not configured')
    }

    const response = await fetch(
      'https://api.searchland.co.uk/v1/planning_applications/search',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SEARCHLAND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bbox: bbox,
          // Only request fields needed for map pins
          fields: [
            "id",
            "location",
            "status",
            "application_reference"
          ]
        })
      }
    )

    if (!response.ok) {
      const error = await response.text()
      console.error('Searchland API error:', error)
      throw new Error(`Searchland API error: ${response.status} ${error}`)
    }

    const data = await response.json()
    console.log(`Retrieved ${data.applications?.length || 0} pins from Searchland`)

    // Transform to simplified pin format
    const pins = data.applications?.map((app: SearchlandPin) => ({
      id: app.id,
      coordinates: app.location.coordinates,
      status: app.status,
      reference: app.application_reference
    })) || []

    return new Response(
      JSON.stringify({ pins }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in fetch-searchland-pins:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 500
      }
    )
  }
})