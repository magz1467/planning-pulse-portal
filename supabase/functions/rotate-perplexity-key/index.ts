import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
    const apiKeys = [
      Deno.env.get('PERPLEXITY_API_KEY_1'),
      Deno.env.get('PERPLEXITY_API_KEY_2'),
      Deno.env.get('PERPLEXITY_API_KEY_3'),
    ].filter(Boolean);

    if (apiKeys.length === 0) {
      throw new Error('No API keys configured');
    }

    // Randomly select one of the available API keys
    const selectedKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];

    // Update the current API key
    await Deno.env.set('PERPLEXITY_API_KEY', selectedKey);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'API key rotated successfully'
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('Error in rotate-perplexity-key:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})