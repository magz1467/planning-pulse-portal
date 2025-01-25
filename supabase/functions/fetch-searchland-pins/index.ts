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
      throw new Error('Missing tile coordinates in URL path')
    }

    console.log(`Fetching tiles for z=${z} x=${x} y=${y}`)

    // Fetch MVT data from Searchland
    const searchlandUrl = `https://api.searchland.co.uk/v1/planning/applications/tiles/${z}/${x}/${y}`
    const response = await fetch(searchlandUrl, {
      headers: {
        'Authorization': `Bearer ${searchlandApiKey}`,
      },
    })

    if (!response.ok) {
      console.error('Searchland API error:', await response.text())
      throw new Error(`Searchland API error: ${response.status}`)
    }

    // Get the MVT buffer
    const mvtBuffer = await response.arrayBuffer()

    // Return MVT with proper headers
    return new Response(mvtBuffer, { 
      headers: { 
        ...corsHeaders,
        'Content-Type': 'application/x-protobuf',
        'Content-Encoding': 'gzip'
      } 
    })
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