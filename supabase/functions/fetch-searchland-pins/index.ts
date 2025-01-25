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
    const { bbox, z, x, y } = await req.json()
    
    if (!bbox && (!z || !x || !y)) {
      throw new Error('Missing required parameters: either bbox or tile coordinates (z,x,y) must be provided')
    }

    console.log(`Fetching pins with params:`, { bbox, z, x, y })

    const searchlandApiKey = Deno.env.get('SEARCHLAND_API_KEY')
    if (!searchlandApiKey) {
      throw new Error('SEARCHLAND_API_KEY is not set')
    }

    // Construct the appropriate URL based on provided parameters
    const baseUrl = 'https://api.searchland.co.uk/v1/planning/applications'
    const url = bbox 
      ? `${baseUrl}?bbox=${bbox}`
      : `${baseUrl}/tiles/${z}/${x}/${y}`

    console.log('Requesting Searchland API:', url)

    // Fetch data from Searchland
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${searchlandApiKey}`,
      },
    })

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