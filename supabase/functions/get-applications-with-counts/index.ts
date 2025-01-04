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

    // Use abortSignal for timeout
    const abortController = new AbortController()
    const timeout = setTimeout(() => abortController.abort(), 15000) // 15 second timeout

    try {
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

      if (applicationsError) {
        console.error('Error fetching applications:', applicationsError)
        throw applicationsError
      }

      // Separate count query
      const { data: totalCount, error: countError } = await supabaseClient
        .rpc('get_applications_count_within_radius', {
          center_lat,
          center_lng,
          radius_meters
        })

      if (countError) {
        console.error('Error getting count:', countError)
        // Continue with applications but without total count
        console.log('Count query failed, continuing without total count')
        const count = applications?.length || 0
        
        const response = {
          applications: applications || [],
          total: count,
          page: page_number,
          pageSize: limitedPageSize,
          hasMore: false // Cannot determine if there are more without total count
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
    } finally {
      clearTimeout(timeout)
    }

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