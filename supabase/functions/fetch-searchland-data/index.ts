import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

interface SearchlandRequestBody {
  coordinates: {
    lat: number
    lng: number
  }
  radius: number
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get API key from environment
    const apiKey = Deno.env.get('SEARCHLAND_API_KEY')
    if (!apiKey) {
      throw new Error('Missing SEARCHLAND_API_KEY')
    }

    // Parse request body
    const { coordinates, radius } = await req.json() as SearchlandRequestBody

    console.log('Fetching Searchland data:', { coordinates, radius })

    // Call Searchland API
    const response = await fetch('https://api.searchland.co.uk/v1/planning_applications/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        coordinates: {
          lat: coordinates.lat,
          lng: coordinates.lng
        },
        radius: radius || 1000, // Default 1km radius
        limit: 100,
        offset: 0,
        sort: {
          field: "submission_date",
          direction: "desc"
        }
      })
    })

    if (!response.ok) {
      console.error('Searchland API error:', await response.text())
      throw new Error(`Searchland API error: ${response.status}`)
    }

    const data = await response.json()
    console.log('Searchland API response:', { 
      count: data?.results?.length,
      firstResult: data?.results?.[0]
    })

    return new Response(
      JSON.stringify(data),
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
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})