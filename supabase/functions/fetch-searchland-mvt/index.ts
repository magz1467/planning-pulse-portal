import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/x-protobuf',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // For initial function URL request
    if (req.method === 'POST') {
      const functionUrl = `${req.url}/functions/v1/fetch-searchland-mvt`
      return new Response(
        JSON.stringify({ functionUrl }),
        { 
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      )
    }

    // Extract z, x, y from URL path
    const url = new URL(req.url);
    const parts = url.pathname.split('/');
    const z = parseInt(parts[parts.length - 3]);
    const x = parseInt(parts[parts.length - 2]);
    const y = parseInt(parts[parts.length - 1]);
    
    // Validate coordinates
    if (isNaN(z) || isNaN(x) || isNaN(y)) {
      console.error('Invalid coordinates:', { z, x, y });
      throw new Error('Invalid coordinates provided');
    }

    // Log valid coordinates for debugging
    console.log('Processing tile request:', { z, x, y });

    // Get the MVT data from Mapbox
    const mapboxToken = Deno.env.get('MAPBOX_PUBLIC_TOKEN');
    if (!mapboxToken) {
      throw new Error('Mapbox token not configured');
    }

    const response = await fetch(
      `https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/${z}/${x}/${y}.mvt?access_token=${mapboxToken}`
    );

    if (!response.ok) {
      throw new Error(`Mapbox API error: ${response.status}`);
    }

    const mvtData = await response.arrayBuffer();
    
    return new Response(mvtData, {
      headers: {
        ...corsHeaders,
        'Cache-Control': 'public, max-age=3600'
      }
    });

  } catch (error) {
    console.error('Error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 400,
      }
    );
  }
})