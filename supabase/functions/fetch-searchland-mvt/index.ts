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
    const searchlandApiKey = Deno.env.get('SEARCHLAND_API_KEY')
    if (!searchlandApiKey) {
      console.error('SEARCHLAND_API_KEY is not set')
      throw new Error('SEARCHLAND_API_KEY is not set')
    }

    // Extract z, x, y from URL path
    const url = new URL(req.url)
    const parts = url.pathname.split('/')
    const z = parts[parts.length - 3]
    const x = parts[parts.length - 2]
    const y = parts[parts.length - 1]

    if (!z || !x || !y) {
      console.error('Invalid tile coordinates:', { z, x, y })
      throw new Error('Invalid tile coordinates')
    }

    console.log(`Fetching MVT tile: z=${z}, x=${x}, y=${y}`)

    // Construct Searchland MVT URL
    const searchlandUrl = `https://api.searchland.co.uk/v1/maps/mvt/planning_applications/${z}/${x}/${y}`

    console.log('Requesting from Searchland:', searchlandUrl)

    // Forward request to Searchland
    const response = await fetch(searchlandUrl, {
      headers: {
        'Authorization': `Bearer ${searchlandApiKey}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Searchland API error:', errorText)
      throw new Error(`Searchland API error: ${response.status}`)
    }

    // Get the MVT binary data
    const mvtData = await response.arrayBuffer()

    return new Response(mvtData, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/x-protobuf',
      },
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 500,
      }
    )
  }
})