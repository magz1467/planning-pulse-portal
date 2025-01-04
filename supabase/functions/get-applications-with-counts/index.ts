import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { center_lat, center_lng, radius_meters, page_size = 100, page_number = 0 } = await req.json()

    console.log('Received request with params:', { center_lat, center_lng, radius_meters, page_size, page_number })

    if (!center_lat || !center_lng || !radius_meters) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    // Limit page size to prevent timeouts
    const limitedPageSize = Math.min(page_size, 50)
    const offset = page_number * limitedPageSize

    // Add timeout and limit to query
    const { data: applications, error: applicationsError } = await supabaseClient
      .rpc('get_applications_within_radius', {
        center_lat,
        center_lng,
        radius_meters,
        page_size: limitedPageSize,
        page_number: offset
      }, {
        count: 'exact'
      })
      .timeout(15000) // 15 second timeout

    if (applicationsError) {
      console.error('Error fetching applications:', applicationsError)
      if (applicationsError.message?.includes('timeout')) {
        return new Response(
          JSON.stringify({ 
            error: 'Query timeout - try reducing radius or page size',
            details: applicationsError.message 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 408 // Request Timeout
          }
        )
      }
      throw applicationsError
    }

    // Separate count query with timeout
    const { data: totalCount, error: countError } = await supabaseClient
      .rpc('get_applications_count_within_radius', {
        center_lat,
        center_lng,
        radius_meters
      })
      .timeout(5000) // 5 second timeout for count query

    if (countError) {
      console.error('Error getting count:', countError)
      if (countError.message?.includes('timeout')) {
        // Continue with applications but without total count
        console.log('Count query timed out, continuing without total count')
        totalCount = applications?.length || 0
      } else {
        throw countError
      }
    }

    console.log(`Found ${applications?.length} applications out of ${totalCount} total`)

    const response = {
      applications: applications || [],
      total: totalCount || 0,
      page: page_number,
      pageSize: limitedPageSize,
      hasMore: (page_number + 1) * limitedPageSize < (totalCount || 0)
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
    console.error('Error:', error.message)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'An unexpected error occurred while processing your request'
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 500,
      },
    )
  }
})