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

    const offset = page_number * page_size

    const { data: applications, error: applicationsError } = await supabaseClient
      .rpc('get_applications_within_radius', {
        center_lat,
        center_lng,
        radius_meters,
        page_size,
        page_number: offset
      })

    if (applicationsError) {
      console.error('Error fetching applications:', applicationsError)
      throw applicationsError
    }

    const { data: totalCount, error: countError } = await supabaseClient
      .rpc('get_applications_count_within_radius', {
        center_lat,
        center_lng,
        radius_meters
      })

    if (countError) {
      console.error('Error getting count:', countError)
      throw countError
    }

    console.log(`Found ${applications?.length} applications`)

    const response = {
      applications: applications || [],
      total: totalCount || 0,
      page: page_number,
      pageSize: page_size
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
      JSON.stringify({ error: error.message }),
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