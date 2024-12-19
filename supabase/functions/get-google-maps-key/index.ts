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

    // Log key details for debugging (without exposing the full key)
    console.log('Retrieved API key details:')
    console.log('- Key length:', apiKey.length)
    console.log('- First 4 chars:', apiKey.substring(0, 4))
    console.log('- Expected prefix:', 'AIza')
    console.log('- Has correct prefix:', apiKey.startsWith('AIza'))

    // Return detailed error if key format is incorrect
    if (!apiKey.startsWith('AIza')) {
      console.error('Invalid Google Maps API key format - key must start with AIza')
      return new Response(
        JSON.stringify({ 
          error: 'Invalid API key format',
          message: 'The Google Maps API key must start with AIza. Please check your Supabase secret configuration.',
          details: {
            keyLength: apiKey.length,
            startsWithAIza: apiKey.startsWith('AIza'),
            firstFourChars: apiKey.substring(0, 4)
          }
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      )
    }

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