import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

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
    // Extract z, x, y from the URL path
    const url = new URL(req.url)
    const parts = url.pathname.split('/')
    const z = parts[parts.length - 3]
    const x = parts[parts.length - 2]
    const y = parts[parts.length - 1]

    if (!z || !x || !y) {
      throw new Error('Missing tile coordinates')
    }

    console.log(`Fetching tile: z=${z}, x=${x}, y=${y}`)

    const searchlandApiKey = Deno.env.get('SEARCHLAND_API_KEY')
    if (!searchlandApiKey) {
      throw new Error('SEARCHLAND_API_KEY is not set')
    }

    // Fetch MVT from Searchland
    const response = await fetch(
      `https://api.searchland.co.uk/v1/maps/mvt/planning_applications/${z}/${x}/${y}`,
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

    // Get the MVT buffer
    const mvtBuffer = await response.arrayBuffer()

    // Return the MVT with appropriate headers
    return new Response(mvtBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/x-protobuf',
        'Content-Length': mvtBuffer.byteLength.toString(),
      },
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})