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
    const apiKey = Deno.env.get('GOOGLE_MAPS_API_KEY')
    
    if (!apiKey) {
      console.error('Google Maps API key not found in environment variables')
      return new Response(
        JSON.stringify({ 
          error: 'API key not configured',
          message: 'Please configure the Google Maps API key in Supabase secrets'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      )
    }

    // Log key details for debugging (without exposing the full key)
    console.log('API Key validation:')
    console.log('- Key length:', apiKey.length)
    console.log('- First 4 chars:', apiKey.substring(0, 4))
    console.log('- Last 4 chars:', apiKey.substring(apiKey.length - 4))

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