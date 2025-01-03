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

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Fetching applications with params:', { center_lng, center_lat, radius_meters, page_size, page_number });

    // Get applications
    const { data: applications, error: applicationsError } = await supabaseClient.rpc(
      'get_applications_within_radius',
      {
        center_lng,
        center_lat,
        radius_meters,
        page_size,
        page_number
      }
    )

    if (applicationsError) {
      console.error('Error fetching applications:', applicationsError)
      throw applicationsError
    }

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

    console.log('Found applications:', applications.length);

    // Calculate status counts
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

    console.log('Total count:', totalCount);
    console.log('Status counts:', statusCounts);

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
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})