import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { corsHeaders } from '../_shared/cors.ts'

interface StatusCount {
  status: string;
  count: number;
}

interface ApplicationsResponse {
  applications: any[];
  statusCounts: {
    'Under Review': number;
    'Approved': number;
    'Declined': number;
    'Other': number;
  };
  total: number;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { center_lng, center_lat, radius_meters = 1000, page_size = 100, page_number = 0 } = await req.json()

    console.log('Query parameters:', { center_lng, center_lat, radius_meters, page_size, page_number });

    // Create Supabase client with increased timeout
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
    ).timeout(30000) // 30 second timeout

    if (applicationsError) {
      console.error('Error fetching applications:', applicationsError)
      throw applicationsError
    }

    console.log(`Retrieved ${applications?.length || 0} applications`);

    if (!applications || applications.length === 0) {
      console.log('No applications found in radius', radius_meters, 'meters from', [center_lat, center_lng])
      return new Response(
        JSON.stringify({
          applications: [],
          statusCounts: {
            'Under Review': 0,
            'Approved': 0,
            'Declined': 0,
            'Other': 0
          },
          total: 0
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Calculate status counts with better error handling
    const statusCounts = applications.reduce((acc: Record<string, number>, app: any) => {
      const status = app.status?.trim().toLowerCase() || ''
      
      if (status.includes('under review') || 
          status.includes('under consideration') ||
          status.includes('pending')) {
        acc['Under Review'] = (acc['Under Review'] || 0) + 1
      } else if (status.includes('approved') || 
                 status.includes('granted')) {
        acc['Approved'] = (acc['Approved'] || 0) + 1
      } else if (status.includes('declined') || 
                 status.includes('refused') || 
                 status.includes('rejected')) {
        acc['Declined'] = (acc['Declined'] || 0) + 1
      } else {
        acc['Other'] = (acc['Other'] || 0) + 1
      }
      return acc
    }, {
      'Under Review': 0,
      'Approved': 0,
      'Declined': 0,
      'Other': 0
    })

    console.log('Status counts:', statusCounts);

    // Get total count with timeout
    const { data: totalCount, error: countError } = await supabaseClient.rpc(
      'get_applications_count_within_radius',
      {
        center_lng,
        center_lat,
        radius_meters
      }
    ).timeout(20000) // 20 second timeout

    if (countError) {
      console.error('Error fetching count:', countError)
      throw countError
    }

    console.log('Total count:', totalCount);

    const response: ApplicationsResponse = {
      applications,
      statusCounts,
      total: totalCount
    }

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error:', error)
    
    // Enhanced error response
    const errorResponse = {
      error: error.message || 'An unexpected error occurred',
      details: error.details || null,
      hint: 'Try reducing the radius or refreshing the page'
    }
    
    return new Response(JSON.stringify(errorResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: error.status || 400,
    })
  }
})