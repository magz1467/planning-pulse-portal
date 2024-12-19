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
    // Get the API key from the environment variables
    const apiKey = Deno.env.get('GOOGLE_MAPS_API_KEY')
    
    if (!apiKey) {
      console.error('Google Maps API key not found in environment variables')
      throw new Error('API key not configured')
    }

    // Validate API key format (basic check)
    if (!apiKey.startsWith('AIza')) {
      console.error('Invalid Google Maps API key format')
      throw new Error('Invalid API key format')
    }

    // Log success but not the actual key
    console.log('Successfully retrieved Google Maps API key')
    console.log('API Key length:', apiKey.length)
    console.log('API Key prefix:', apiKey.substring(0, 5) + '...')
    console.log('API Key is valid format:', apiKey.startsWith('AIza'))

    return new Response(
      JSON.stringify({ 
        apiKey,
        status: 'success',
        message: 'API key retrieved successfully'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error in get-google-maps-key:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to retrieve Google Maps API key',
        details: error.message,
        status: 'error'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})