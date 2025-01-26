import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/x-protobuf',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const [z, x, y] = pathParts.slice(-3).map(Number);

    console.log(`Fetching MVT tile at z=${z} x=${x} y=${y}`);

    // For now just return an empty tile to verify the function is being called
    return new Response(new Uint8Array(), {
      headers: {
        ...corsHeaders,
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    console.error('Error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders
    });
  }
});