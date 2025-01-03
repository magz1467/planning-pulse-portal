import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ApplicationResponse {
  applications: any[];
  total: number;
  statusCounts: Record<string, number>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { center_lng, center_lat, radius_meters = 1000, page_size = 100, page_number = 0 } = await req.json()

    if (!center_lng || !center_lat) {
      throw new Error('Missing required parameters: center_lng and center_lat')
    }

    console.log('Processing request with parameters:', { center_lng, center_lat, radius_meters, page_size, page_number });

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get applications within radius
    const { data: applications, error } = await supabaseClient.rpc(
      'get_applications_within_radius',
      {
        center_lng,
        center_lat,
        radius_meters,
        page_size,
        page_number
      }
    )

    if (error) {
      console.error('Error fetching applications:', error)
      throw error
    }

    // Get total count first
    const { data: totalCount, error: countError } = await supabaseClient.rpc(
      'get_applications_count_within_radius',
      {
        center_lng,
        center_lat,
        radius_meters
      }
    )

    if (countError) {
      console.error('Error fetching count:', countError)
      throw countError
    }

    // Process applications to ensure image_map_url is set
    const processedApplications = await Promise.all(applications.map(async (app: any) => {
      if (!app.image_map_url && app.centroid) {
        try {
          const coordinates = typeof app.centroid === 'string' ? JSON.parse(app.centroid) : app.centroid;
          
          if (coordinates && coordinates.coordinates) {
            const [lon, lat] = coordinates.coordinates;
            const mapboxToken = Deno.env.get('MAPBOX_PUBLIC_TOKEN');
            const width = 800;
            const height = 600;
            const zoom = 18;
            const pitch = 60;
            const bearing = 45;
            
            const imageUrl = `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${lon},${lat},${zoom},${bearing},${pitch}/${width}x${height}@2x?access_token=${mapboxToken}&logo=false`;
            
            const { error: updateError } = await supabaseClient
              .from('applications')
              .update({ image_map_url: imageUrl })
              .eq('application_id', app.application_id);
              
            if (updateError) {
              console.error(`Error updating image URL for application ${app.application_id}:`, updateError);
            } else {
              app.image_map_url = imageUrl;
            }
          }
        } catch (err) {
          console.error(`Error processing application ${app.application_id}:`, err);
        }
      }
      return app;
    }));

    // Calculate status counts
    const statusCounts = processedApplications.reduce((acc: Record<string, number>, app: any) => {
      const status = app.status?.trim().toLowerCase() || '';
      
      if (status === 'under review') {
        acc['Under Review'] = (acc['Under Review'] || 0) + 1;
      } else if (status === 'approved' || status === 'granted') {
        acc['Approved'] = (acc['Approved'] || 0) + 1;
      } else if (status === 'declined' || status === 'refused') {
        acc['Declined'] = (acc['Declined'] || 0) + 1;
      } else {
        acc['Other'] = (acc['Other'] || 0) + 1;
      }
      
      return acc;
    }, {});

    console.log('Successfully processed request:', {
      totalApplications: processedApplications.length,
      statusCounts
    });

    const response: ApplicationResponse = {
      applications: processedApplications,
      total: totalCount || 0,
      statusCounts
    }

    return new Response(
      JSON.stringify(response),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error in edge function:', error)
    
    return new Response(
      JSON.stringify({
        error: error.message || 'An unexpected error occurred',
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200, // Return 200 even for errors to prevent CORS issues
      }
    )
  }
})