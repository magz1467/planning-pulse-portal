import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { postcode, applications } = await req.json()
    console.log('Received request for postcode:', postcode)
    
    if (!postcode || !applications || !Array.isArray(applications)) {
      throw new Error('Invalid request parameters')
    }

    // For development, generate mock coordinates around the base coordinates
    // This is a temporary solution until the Mapcloud API integration is working
    const baseCoords = { lat: 51.5074, lng: -0.1278 } // London coordinates
    
    const markers = applications.map((app, index) => {
      // Generate random offsets within ~1km radius
      const latOffset = (Math.random() - 0.5) * 0.02
      const lngOffset = (Math.random() - 0.5) * 0.02
      
      return {
        lat: baseCoords.lat + latOffset,
        lng: baseCoords.lng + lngOffset,
        id: app.id
      }
    })

    console.log('Generated markers:', markers)

    return new Response(
      JSON.stringify(markers),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error in fetch-map-markers:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})