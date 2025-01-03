import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

console.log("Loading get-applications-with-counts function...")

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { center_lng, center_lat, radius_meters = 1000, page_size = 100, page_number = 0 } = await req.json()

    console.log('Received parameters:', { center_lng, center_lat, radius_meters, page_size, page_number })

    if (!center_lng || !center_lat) {
      throw new Error('Missing required parameters: center_lng and center_lat')
    }

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
        page_size: Math.min(page_size, 500),
        page_number
      }
    )

    if (applicationsError) {
      console.error('Error fetching applications:', applicationsError)
      throw applicationsError
    }

    // Calculate status counts
    const statusCounts = {
      'Under Review': 0,
      'Approved': 0,
      'Declined': 0,
      'Other': 0
    }

    applications?.forEach(app => {
      const status = app.status?.toLowerCase() || ''
      if (status.includes('under consideration')) {
        statusCounts['Under Review']++
      } else if (status.includes('approved')) {
        statusCounts['Approved']++
      } else if (status.includes('declined')) {
        statusCounts['Declined']++
      } else {
        statusCounts['Other']++
      }
    })

    // Get total count
    const { count: total, error: countError } = await supabaseClient.rpc(
      'get_applications_count_within_radius',
      {
        center_lng,
        center_lat,
        radius_meters
      }
    ).select('count', { count: 'exact' }).single()

    if (countError) {
      console.error('Error getting total count:', countError)
      throw countError
    }

    console.log('Returning response with:', {
      applicationCount: applications?.length || 0,
      total,
      statusCounts
    })

    return new Response(
      JSON.stringify({
        applications: applications || [],
        total,
        statusCounts
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in get-applications-with-counts:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 400
    })
  }
})