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
    let requestData;
    try {
      requestData = await req.json();
    } catch (e) {
      console.error('Error parsing request JSON:', e);
      requestData = {};
    }

    const { bbox } = requestData;
    const apiKey = Deno.env.get('SEARCHLAND_API_KEY')

    if (!apiKey) {
      console.error('Searchland API key not found in environment variables')
      throw new Error('Searchland API key not found')
    }

    console.log('Request data:', requestData);
    console.log('API Key exists:', !!apiKey);
    console.log('API Key length:', apiKey.length);

    if (!bbox) {
      console.error('Missing bbox parameter in request');
      throw new Error('Missing bbox parameter');
    }

    // Validate bbox format (minLng,minLat,maxLng,maxLat)
    const bboxParts = bbox.split(',').map(Number);
    if (bboxParts.length !== 4 || bboxParts.some(isNaN)) {
      console.error('Invalid bbox format:', bbox);
      throw new Error('Invalid bbox format. Expected: minLng,minLat,maxLng,maxLat');
    }

    const url = 'https://api.searchland.co.uk/v1/planning_applications/search';
    
    const requestBody = {
      bbox,
      limit: 100
    }

    console.log('Using bbox:', requestBody.bbox);
    console.log('Request URL:', url);
    console.log('Request body:', JSON.stringify(requestBody));

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })

    console.log('Searchland API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Searchland API error response:', errorText);
      console.error('Response headers:', Object.fromEntries(response.headers.entries()));
      throw new Error(`Searchland API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log(`Received ${data.features?.length || 0} applications from Searchland`);

    return new Response(
      JSON.stringify({ applications: data.features }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )

  } catch (error) {
    console.error('Error in fetch-searchland-data:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        context: 'Failed to fetch or process Searchland data'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json'}
      }
    )
  }
})