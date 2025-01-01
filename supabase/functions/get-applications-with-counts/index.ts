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

    // Build the base SQL query for applications
    let applicationsQuery = `
      SELECT * FROM applications 
      WHERE geom IS NOT NULL 
      AND ST_DWithin(
        geom::geography,
        ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
        $3
      )
    `

    // Add sorting based on sort_type
    if (sort_type) {
      switch (sort_type) {
        case 'newest':
          applicationsQuery += ` ORDER BY valid_date DESC NULLS LAST`
          break
        case 'closingSoon':
          applicationsQuery += `
            AND last_date_consultation_comments >= CURRENT_DATE
            ORDER BY last_date_consultation_comments ASC NULLS LAST
          `
          break
      }
    }

    // Add pagination
    applicationsQuery += ` LIMIT $4 OFFSET $5`

    // Execute the applications query
    const { data: applications, error: applicationsError } = await supabaseClient.rpc(
      'get_applications_in_radius',
      {
        center_longitude: center_lng,
        center_latitude: center_lat,
        search_radius: radius_meters,
        limit_val: page_size,
        offset_val: page_number * page_size,
        sort_type: sort_type || null
      }
    )

    if (applicationsError) {
      throw applicationsError
    }

    // Get status counts using a separate query
    const { data: statusCounts, error: statusError } = await supabaseClient.rpc(
      'get_status_counts',
      {
        center_longitude: center_lng,
        center_latitude: center_lat,
        search_radius: radius_meters
      }
    )

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