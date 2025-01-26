import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SearchParams {
  lat: number
  lng: number
  radius: number
  page?: number
  limit?: number
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const searchParams: SearchParams = await req.json()
    console.log('Search params:', searchParams)

    const searchlandApiKey = Deno.env.get('SEARCHLAND_API_KEY')
    if (!searchlandApiKey) {
      throw new Error('SEARCHLAND_API_KEY not found')
    }

    const response = await fetch('https://api.searchland.co.uk/v1/planning_applications/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${searchlandApiKey}`,
      },
      body: JSON.stringify({
        lat: searchParams.lat,
        lng: searchParams.lng,
        radius: searchParams.radius || 1000,
        page: searchParams.page || 1,
        limit: searchParams.limit || 100,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Searchland API error:', error)
      throw new Error(`Searchland API error: ${error}`)
    }

    const data = await response.json()
    console.log('Searchland API response:', {
      total: data.total,
      count: data.data?.length,
    })

    return new Response(JSON.stringify(data), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    })

  } catch (error) {
    console.error('Error:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    })
  }
})