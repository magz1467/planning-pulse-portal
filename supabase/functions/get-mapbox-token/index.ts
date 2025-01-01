import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Retrieving Mapbox token from environment...');
    const token = Deno.env.get('MAPBOX_PUBLIC_TOKEN')
    
    if (!token) {
      console.error('MAPBOX_PUBLIC_TOKEN not found in environment');
      throw new Error('MAPBOX_PUBLIC_TOKEN not found')
    }

    // Validate token format
    if (!token.startsWith('pk.')) {
      console.error('Invalid token format - must start with pk.');
      throw new Error('Invalid token format')
    }

    console.log('Successfully retrieved and validated token format');

    return new Response(
      JSON.stringify({ token }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in get-mapbox-token function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        context: 'Token retrieval failed'
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 400,
      },
    )
  }
})