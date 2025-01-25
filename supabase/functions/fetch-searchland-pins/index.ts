import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const searchlandApiKey = Deno.env.get('SEARCHLAND_API_KEY')
    if (!searchlandApiKey) {
      console.error('SEARCHLAND_API_KEY environment variable is not set')
      throw new Error('SEARCHLAND_API_KEY is not set')
    }

    // Extract tile coordinates from URL path
    const url = new URL(req.url)
    const parts = url.pathname.split('/')
    const z = parts[parts.length - 3]
    const x = parts[parts.length - 2]
    const y = parts[parts.length - 1]

    if (!z || !x || !y) {
      console.error('Missing tile coordinates in URL:', url.pathname)
      throw new Error('Missing tile coordinates')
    }

    console.log(`Fetching tiles for z=${z} x=${x} y=${y}`)

    // Fetch MVT data from Searchland
    const searchlandUrl = `https://api.searchland.co.uk/v1/planning/applications/tiles/${z}/${x}/${y}`
    console.log('Requesting Searchland API:', searchlandUrl)

    const response = await fetch(searchlandUrl, {
      headers: {
        'Authorization': `Bearer ${searchlandApiKey}`,
        'Accept': 'application/x-protobuf',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Searchland API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      })
      throw new Error(`Searchland API error: ${response.status} - ${errorText}`)
    }

    // Get the MVT buffer
    const mvtBuffer = await response.arrayBuffer()
    console.log('Successfully received MVT buffer of size:', mvtBuffer.byteLength)

    // Return MVT with proper headers
    return new Response(mvtBuffer, { 
      headers: { 
        ...corsHeaders,
        'Content-Type': 'application/x-protobuf',
      } 
    })
  } catch (error) {
    console.error('Error in fetch-searchland-pins:', error)
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