import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { generateStaticMapUrl, validateMapUrl } from './mapbox.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting manual map generation process');
    
    const { batch_size = 100 } = await req.json();
    const limit = Math.min(Math.max(1, batch_size), 500);
    
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

    // Get applications without images
    const { data: applications, error: fetchError } = await supabase
      .from('applications')
      .select('application_id, centroid')
      .is('image_map_url', null)
      .not('centroid', 'is', null)
      .limit(limit);

    if (fetchError) {
      console.error('Error fetching applications:', fetchError);
      throw fetchError;
    }

    if (!applications || applications.length === 0) {
      return new Response(
        JSON.stringify({ 
          message: 'No applications found requiring map images',
          success: 0,
          errors: 0 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    console.log(`Processing ${applications.length} applications`);

    let successCount = 0;
    let errorCount = 0;

    for (const app of applications) {
      try {
        console.log(`Processing application ${app.application_id}`);
        
        if (!app.centroid) {
          console.log(`Skipping application ${app.application_id} - no coordinates`);
          errorCount++;
          continue;
        }

        const coordinates = app.centroid;
        if (!coordinates.lon || !coordinates.lat) {
          console.log(`Invalid coordinates for application ${app.application_id}`);
          errorCount++;
          continue;
        }

        console.log(`Coordinates for application ${app.application_id}:`, coordinates);

        // Generate the static map URL
        const staticMapUrl = await generateStaticMapUrl(coordinates, mapboxToken);
        console.log(`Generated URL for application ${app.application_id}: ${staticMapUrl}`);

        // Validate the URL works
        const isValid = await validateMapUrl(staticMapUrl);
        if (!isValid) {
          console.error(`Failed to fetch map image for application ${app.application_id}`);
          errorCount++;
          continue;
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
          errorCount++;
          continue;
        }

        successCount++;
        console.log(`Successfully processed application ${app.application_id}`);

        // Add a small delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`Error processing application ${app.application_id}:`, error);
        errorCount++;
      }
    }

    return new Response(
      JSON.stringify({
        message: `Processed ${applications.length} applications`,
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