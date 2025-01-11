import { corsHeaders } from '../_shared/cors.ts'

const LANDHAWK_USERNAME = 'makemyhousegreen_trial'
const LANDHAWK_PASSWORD = 'RC3U09O8XKXYP5ML'

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders 
    })
  }

  try {
    console.log('Testing Landhawk API access...')
    
    const wfsUrl = 'https://api.emapsite.com/dataservice/api/WFS'
    const params = new URLSearchParams({
      service: 'WFS',
      version: '2.0.0',
      request: 'GetFeature',
      typeName: 'LandHawk:PlanningApplication',
      outputFormat: 'application/json',
      srsName: 'EPSG:4326'
    })

    const fullUrl = `${wfsUrl}?${params}`
    console.log('Making test request to Landhawk WFS API with URL:', fullUrl)
    
    const authString = btoa(`${LANDHAWK_USERNAME}:${LANDHAWK_PASSWORD}`)
    console.log('Using auth string:', authString)

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Landhawk API error response:', errorText)
      throw new Error(errorText)
    }

    const data = await response.json()
    console.log(`API test successful. Received ${data.features?.length || 0} features`)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'API access test successful',
        featureCount: data.features?.length || 0
      }), 
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('API test failed:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false,
        message: 'API access test failed'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})