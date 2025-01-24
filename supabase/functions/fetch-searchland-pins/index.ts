import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SEARCHLAND_API_KEY = Deno.env.get('SEARCHLAND_API_KEY')

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { z, x, y } = await req.json()
    
    console.log('📍 Fetching MVT tile:', { z, x, y })

    const response = await fetch(
      `https://api.searchland.co.uk/v1/maps/mvt/planning_applications/${z}/${x}/${y}`,
      {
        headers: {
          'Authorization': `Bearer ${SEARCHLAND_API_KEY}`,
          'Accept': 'application/x-protobuf'
        }
      }
    )

    if (!response.ok) {
      console.error('❌ Searchland API error:', response.status, await response.text())
      throw new Error(`Searchland API error: ${response.status}`)
    }

    const buffer = await response.arrayBuffer()
    
    return new Response(buffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/x-protobuf'
      }
    })

  } catch (error) {
    console.error('Error in fetch-searchland-pins:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }
})