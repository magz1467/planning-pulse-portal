import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

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
    const { center_lng, center_lat, radius_meters, page_size = 100, page_number = 0 } = await req.json()

    if (!center_lng || !center_lat || !radius_meters) {
      throw new Error('Missing required parameters')
    }

    console.log('Query parameters:', { center_lng, center_lat, radius_meters, page_size, page_number });

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        db: {
          schema: 'public'
        },
        global: {
          headers: { 'x-my-custom-header': 'planning-application-service' },
        },
        auth: {
          persistSession: false
        }
      }
    )

    console.log('Fetching applications...');
    
    // Get applications with pagination using optimized function
    const { data: applications, error: applicationsError } = await supabaseClient.rpc(
      'get_applications_within_radius',
      {
        center_lng,
        center_lat,
        radius_meters,
        page_size: Math.min(page_size, 500),
        page_number
      }
    )

    if (applicationsError) {
      console.error('Error fetching applications:', applicationsError)
      throw applicationsError
    }

    if (!applications) {
      console.log('No applications found')
      return new Response(
        JSON.stringify({
          applications: [],
          total: 0,
          statusCounts: {}
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // Get total count
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

    // Calculate status counts
    const statusCounts = applications.reduce((acc: Record<string, number>, app: any) => {
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

    console.log('Status counts:', statusCounts);

    const response: ApplicationResponse = {
      applications,
      total: totalCount || 0,
      statusCounts
    }

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error:', error)
    
    return new Response(
      JSON.stringify({
        error: error.message || 'An unexpected error occurred',
        details: error.details || null,
        hint: 'Try reducing the radius or refreshing the page'
      }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, // Changed from error status to 200 to prevent client-side rejection
      }
    )
  }
})

interface ApplicationResponse {
  applications: any[];
  total: number;
  statusCounts: Record<string, number>;
}