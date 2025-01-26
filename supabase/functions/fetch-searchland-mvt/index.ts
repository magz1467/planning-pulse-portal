import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Pbf from 'https://esm.sh/pbf@3.2.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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
    const searchlandUrl = `https://api.searchland.co.uk/v1/maps/mvt/planning_applications/${z}/${x}/${y}?geometry_type=point&simplify=true&force_point=true`

    console.log('Requesting from Searchland:', searchlandUrl)

    // Forward request to Searchland with detailed error handling
    const response = await fetch(searchlandUrl, {
      headers: {
        'Authorization': `Bearer ${Deno.env.get('SEARCHLAND_API_KEY')}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Searchland API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      })
      throw new Error(`Searchland API error: ${response.status} - ${errorText}`)
    }

    // Get the MVT binary data
    const mvtBuffer = await response.arrayBuffer()
    
    // Log successful response with details
    console.log(`Successfully processed tile z=${z}/x=${x}/y=${y}:`, {
      size: mvtBuffer.byteLength,
      contentType: response.headers.get('content-type'),
      status: response.status
    })

    return new Response(mvtBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/x-protobuf',
      },
    })
  } catch (error) {
    console.error('Error processing MVT request:', {
      error: error.message,
      stack: error.stack
    })
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Error processing vector tile request'
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  }
})