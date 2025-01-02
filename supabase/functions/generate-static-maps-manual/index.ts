import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const BATCH_SIZE = 10;
const MAX_RETRIES = 3;
const DELAY_BETWEEN_RETRIES = 1000; // 1 second

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function processApplication(
  supabase: any,
  app: any,
  mapboxToken: string,
  retryCount = 0
): Promise<{ status: 'success' | 'error', reason?: string }> {
  try {
    console.log(`Processing application ${app.application_id}`);
    
    if (!app.centroid) {
      console.log(`Skipping application ${app.application_id} - no coordinates`);
      return { status: 'error', reason: 'no_coordinates' };
    }

    const coordinates = app.centroid;
    if (!coordinates.lon || !coordinates.lat) {
      console.log(`Invalid coordinates for application ${app.application_id}`);
      return { status: 'error', reason: 'invalid_coordinates' };
    }

    console.log(`Coordinates for application ${app.application_id}:`, coordinates);

    if (!mapboxToken) {
      console.error('MAPBOX_PUBLIC_TOKEN is not set');
      return { status: 'error', reason: 'no_mapbox_token' };
    }

    // Generate static map URL using the Mapbox Static Images API format
    const width = 800;
    const height = 600;
    const zoom = 17;
    
    // Construct the static map URL using the correct format
    const staticMapUrl = `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${coordinates.lon},${coordinates.lat},${zoom},0/${width}x${height}@2x?access_token=${mapboxToken}&logo=false`;

    console.log(`Generated URL for application ${app.application_id}: ${staticMapUrl}`);

    // Test the URL before updating
    const mapResponse = await fetch(staticMapUrl);
    if (!mapResponse.ok) {
      console.error(`Failed to fetch map image for application ${app.application_id}:`, await mapResponse.text());
      return { status: 'error', reason: 'map_fetch_failed' };
    }

    // Update the application with the new image URL
    const { error: updateError } = await supabase
      .from('applications')
      .update({ 
        image_map_url: staticMapUrl,
        last_updated: new Date().toISOString()
      })
      .eq('application_id', app.application_id);

    if (updateError) {
      console.error(`Error updating application ${app.application_id}:`, updateError);
      throw updateError;
    }

    console.log(`Successfully processed application ${app.application_id}`);
    return { status: 'success' };

  } catch (error) {
    console.error(`Error processing application ${app.application_id}:`, error);
    
    // Retry logic
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying application ${app.application_id} (attempt ${retryCount + 1})`);
      await sleep(DELAY_BETWEEN_RETRIES);
      return processApplication(supabase, app, mapboxToken, retryCount + 1);
    }
    
    return { 
      status: 'error', 
      reason: 'processing_failed', 
      error 
    };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting manual map generation process');
    
    const { batch_size = 100 } = await req.json();
    const limit = Math.min(Math.max(1, batch_size), 500); // Cap at 500, minimum 1
    
    console.log(`Requested batch size: ${batch_size}, adjusted limit: ${limit}`);
    
    const mapboxToken = Deno.env.get('MAPBOX_PUBLIC_TOKEN');
    if (!mapboxToken) {
      throw new Error('MAPBOX_PUBLIC_TOKEN not found');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase credentials not found');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get applications without images, using the new index
    const { data: applications, error: fetchError } = await supabase
      .from('applications')
      .select('application_id, centroid')
      .is('image_map_url', null)
      .order('application_id')
      .limit(limit);

    if (fetchError) {
      console.error('Error fetching applications:', fetchError);
      throw fetchError;
    }

    console.log(`Processing ${applications?.length || 0} applications`);

    // Process in smaller batches to avoid rate limits
    const chunks = [];
    for (let i = 0; i < (applications?.length || 0); i += BATCH_SIZE) {
      chunks.push(applications.slice(i, i + BATCH_SIZE));
    }

    let successCount = 0;
    let errorCount = 0;
    let currentChunk = 1;

    for (const chunk of chunks) {
      console.log(`Processing chunk ${currentChunk} of ${chunks.length}`);
      
      const results = await Promise.all(
        chunk.map(app => processApplication(supabase, app, mapboxToken))
      );

      successCount += results.filter(r => r.status === 'success').length;
      errorCount += results.filter(r => r.status === 'error').length;

      // Add a small delay between chunks to respect rate limits
      if (chunks.length > 1 && currentChunk < chunks.length) {
        await sleep(1000);
      }
      
      currentChunk++;
    }

    return new Response(
      JSON.stringify({
        message: `Processed ${applications?.length || 0} applications`,
        success: successCount,
        errors: errorCount,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 200,
      },
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 400,
      },
    );
  }
});