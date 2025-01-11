import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { corsHeaders } from '../_shared/cors.ts'

const LANDHAWK_USERNAME = 'makemyhousegreen_trial'
const LANDHAWK_PASSWORD = 'RC3U09O8XKXYP5ML'
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders 
    })
  }

  try {
    console.log('Starting to fetch Landhawk data...')
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

    // Fetch data from Landhawk WFS API
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
    console.log('Making request to Landhawk WFS API with URL:', fullUrl)
    
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${btoa(`${LANDHAWK_USERNAME}:${LANDHAWK_PASSWORD}`)}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Landhawk API error response:', errorText)
      throw new Error(`Landhawk API error: ${response.status} ${response.statusText}\nDetails: ${errorText}`)
    }

    const data = await response.json()
    console.log(`Received ${data.features?.length || 0} applications from Landhawk`)

    if (!data.features || !Array.isArray(data.features)) {
      throw new Error('Invalid response format from Landhawk API: missing features array')
    }

    return new Response(
      JSON.stringify(data), // Return the full GeoJSON response
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 // Return 200 even for errors, but include error message in response
      }
    )
  }
})