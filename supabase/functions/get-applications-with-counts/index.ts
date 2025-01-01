import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const { center_lng, center_lat, radius_meters, page_size = 100, page_number = 0 } = await req.json()

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get applications within radius
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
      throw applicationsError
    }

    // Get status counts
    const { data: statusCounts, error: statusError } = await supabaseClient.rpc(
      'get_applications_count_within_radius',
      {
        center_lng,
        center_lat,
        radius_meters
      }
    )

    if (statusError) {
      throw statusError
    }

    // Format status counts
    const formattedStatusCounts = {
      'Under Review': 0,
      'Approved': 0, 
      'Declined': 0,
      'Other': 0
    }

    if (statusCounts) {
      formattedStatusCounts['Under Review'] = statusCounts.under_review || 0
      formattedStatusCounts['Approved'] = statusCounts.approved || 0
      formattedStatusCounts['Declined'] = statusCounts.declined || 0
      formattedStatusCounts['Other'] = statusCounts.other || 0
    }

    return new Response(
      JSON.stringify({
        applications,
        statusCounts: formattedStatusCounts
      }),
      { 
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Expose-Headers': 'Content-Length, X-JSON',
          'Access-Control-Allow-Headers': 'apikey,X-Client-Info,Content-Type,Authorization'
        }
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Expose-Headers': 'Content-Length, X-JSON',
          'Access-Control-Allow-Headers': 'apikey,X-Client-Info,Content-Type,Authorization'
        }
      }
    )
  }
})