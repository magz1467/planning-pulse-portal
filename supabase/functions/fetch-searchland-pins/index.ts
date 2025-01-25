import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { bbox } = await req.json()
    
    if (!bbox) {
      throw new Error('Missing bbox parameter')
    }

    console.log(`Fetching pins with bbox: ${bbox}`)

    const searchlandApiKey = Deno.env.get('SEARCHLAND_API_KEY')
    if (!searchlandApiKey) {
      throw new Error('SEARCHLAND_API_KEY is not set')
    }

    // Fetch data from Searchland
    const response = await fetch(
      `https://api.searchland.co.uk/v1/planning/applications?bbox=${bbox}`,
      {
        headers: {
          'Authorization': `Bearer ${searchlandApiKey}`,
        },
      }
    )

    if (!response.ok) {
      console.error('Searchland API error:', await response.text())
      throw new Error(`Searchland API error: ${response.status}`)
    }

    const data = await response.json()

    return new Response(
      JSON.stringify({ pins: data.features }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
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
        status: 500
      }
    )
  }
})