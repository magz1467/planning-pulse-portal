import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

console.log("Hello from get-applications-with-counts!")

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { center_lng, center_lat, radius_meters, page_size = 100, page_number = 0, sort_type } = await req.json()

    // Create a Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Base query
    let query = supabaseClient
      .from('applications')
      .select('*')

    // Add spatial filter if coordinates are provided
    if (center_lng && center_lat && radius_meters) {
      query = query.filter('geom', 'not.is.null')
        .filter(
          'geom',
          'st_dwithin',
          `SRID=4326;POINT(${center_lng} ${center_lat})`,
          radius_meters
        )
    }

    // Add sorting based on sort_type
    if (sort_type) {
      switch (sort_type) {
        case 'newest':
          query = query.order('valid_date', { ascending: false, nullsLast: true })
          break
        case 'closingSoon':
          query = query
            .filter('last_date_consultation_comments', 'gte', new Date().toISOString())
            .order('last_date_consultation_comments', { ascending: true, nullsLast: true })
          break
      }
    }

    // Add pagination
    query = query.limit(page_size).offset(page_number * page_size)

    // Get applications
    const { data: applications, error: applicationsError } = await query

    if (applicationsError) {
      throw applicationsError
    }

    // Get status counts
    const { data: statusCounts, error: statusError } = await supabaseClient
      .rpc('get_status_counts', {
        center_longitude: center_lng,
        center_latitude: center_lat,
        search_radius: radius_meters
      })

    if (statusError) {
      throw statusError
    }

    // Get total count
    const { count, error: countError } = await supabaseClient
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .filter('geom', 'not.is.null')
      .filter(
        'geom',
        'st_dwithin',
        `SRID=4326;POINT(${center_lng} ${center_lat})`,
        radius_meters
      )

    if (countError) {
      throw countError
    }

    // Return the response
    return new Response(
      JSON.stringify({
        applications,
        statusCounts: statusCounts?.[0] || {
          'Under Review': 0,
          'Approved': 0,
          'Declined': 0,
          'Other': 0
        },
        total: count
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 400
    })
  }
})