import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

const MAPCLOUD_BASE_URL = 'https://api.mapcloud.com/v1';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { postcode, applications } = await req.json()
    
    // Call Mapcloud API to get real coordinates
    const response = await fetch(`${MAPCLOUD_BASE_URL}/geocode`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('PARTNER_MAPS_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        postcode,
        addresses: applications.map((app: any) => app.address)
      })
    })

    if (!response.ok) {
      throw new Error(`Mapcloud API error: ${response.statusText}`)
    }

    const data = await response.json()
    
    // Transform the response to match our marker format
    const markers = data.results.map((result: any, index: number) => ({
      lat: result.latitude,
      lng: result.longitude,
      id: applications[index].id
    }))

    return new Response(
      JSON.stringify(markers),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})