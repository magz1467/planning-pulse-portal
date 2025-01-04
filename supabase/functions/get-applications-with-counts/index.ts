import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  // Handle CORS preflight requests
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
    const limitedPageSize = Math.min(page_size, 25)
    const offset = page_number * limitedPageSize

    try {
      // Get applications within radius with timeout
      const applicationsPromise = supabaseClient.rpc('get_applications_within_radius', {
        center_lat,
        center_lng,
        radius_meters,
        page_size: limitedPageSize,
        page_number: offset
      })

      // Set timeout for the query
      const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Query timeout')), 8000)
      )

      const { data: applications, error: applicationsError } = await Promise.race([
        applicationsPromise,
        timeout
      ])

      if (applicationsError) {
        console.error('Error fetching applications:', applicationsError)
        throw applicationsError
      }

      // Get total count with timeout
      const countPromise = supabaseClient.rpc('get_applications_count_within_radius', {
        center_lat,
        center_lng,
        radius_meters
      })

      const { data: totalCount, error: countError } = await Promise.race([
        countPromise,
        timeout
      ])

      console.log(`Found ${applications?.length} applications out of ${totalCount} total`)

      return new Response(
        JSON.stringify({
          applications: applications || [],
          total: totalCount || 0,
          page: page_number,
          pageSize: limitedPageSize,
          hasMore: (page_number + 1) * limitedPageSize < (totalCount || 0)
        }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
          status: 200,
        },
      )

    } catch (error) {
      console.error('Database query error:', error.message)
      return new Response(
        JSON.stringify({ 
          error: 'Database query timeout or error',
          details: error.message
        }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json'
          },
          status: 503,
        },
      )
    }

  } catch (error) {
    console.error('General error:', error.message)
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