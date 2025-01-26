import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/x-protobuf',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { z, x, y } = await req.json()
    
    // Validate coordinates
    if (typeof z !== 'number' || typeof x !== 'number' || typeof y !== 'number') {
      console.error('Invalid coordinates:', { z, x, y })
      throw new Error('Invalid coordinates provided')
    }

    // Get the MVT data from Mapbox
    const mapboxToken = Deno.env.get('MAPBOX_PUBLIC_TOKEN')
    if (!mapboxToken) {
      throw new Error('Mapbox token not configured')
    }

    const response = await fetch(
      `https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/${z}/${x}/${y}.mvt?access_token=${mapboxToken}`
    )

    if (!response.ok) {
      throw new Error(`Mapbox API error: ${response.status}`)
    }

    const mvtData = await response.arrayBuffer()
    
    return new Response(mvtData, {
      headers: {
        ...corsHeaders,
        'Cache-Control': 'public, max-age=3600'
      }
    })

  } catch (error) {
    console.error('Error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 400,
      }
    )
  }
})