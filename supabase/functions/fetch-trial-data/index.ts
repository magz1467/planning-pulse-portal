import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { corsHeaders } from '../_shared/cors.ts'

const LANDHAWK_USERNAME = Deno.env.get('LANDHAWK_USERNAME') ?? ''
const LANDHAWK_PASSWORD = Deno.env.get('LANDHAWK_PASSWORD') ?? ''
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
    
    if (!LANDHAWK_USERNAME || !LANDHAWK_PASSWORD) {
      throw new Error('Landhawk credentials not configured')
    }

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
      
      // Return a more structured error response
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch Landhawk data',
          details: errorText,
          status: response.status,
          success: false,
          features: [] // Return empty features array for graceful degradation
        }), 
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 // Return 200 to allow client to handle the error
        }
      )
    }

    const data = await response.json()
    console.log(`Received ${data.features?.length || 0} applications from Landhawk`)

    if (!data.features || !Array.isArray(data.features)) {
      throw new Error('Invalid response format from Landhawk API: missing features array')
    }

    return new Response(
      JSON.stringify({
        ...data,
        success: true
      }), 
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
        success: false,
        features: [] // Return empty features array for graceful degradation
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 // Return 200 to allow client to handle the error
      }
    )
  }
})