import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { center_lng, center_lat, radius_meters, page_size = 100, page_number = 0 } = await req.json()

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // First get total count
    const { count: total } = await supabase.rpc(
      'get_applications_count_within_radius',
      { 
        center_lng,
        center_lat, 
        radius_meters
      }
    ).single()

    if (!total) {
      return new Response(
        JSON.stringify({ 
          applications: [],
          total: 0,
          statusCounts: {
            'Under Review': 0,
            'Approved': 0,
            'Declined': 0,
            'Other': 0
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Then fetch paginated applications
    const { data: applications, error } = await supabase.rpc(
      'get_applications_within_radius',
      {
        center_lng,
        center_lat,
        radius_meters,
        page_size,
        page_number
      }
    )

    if (error) {
      console.error('Error fetching applications:', error)
      throw error
    }

    // Process applications to include proper image URLs
    const processedApplications = applications.map(app => {
      let imageUrl = '/placeholder.svg'
      
      if (app.application_details && typeof app.application_details === 'object') {
        const details = app.application_details as any
        if (details.images && Array.isArray(details.images) && details.images.length > 0) {
          const imgPath = details.images[0]
          if (imgPath.startsWith('http')) {
            imageUrl = imgPath
          } else {
            imageUrl = `${Deno.env.get('SUPABASE_URL')}/storage/v1/object/public/images/${imgPath}`
          }
        }
      }

      // If there's a map image URL, use it
      if (app.image_map_url) {
        imageUrl = app.image_map_url
      }

      return {
        ...app,
        image: imageUrl
      }
    })

    // Calculate status counts for current page
    const statusCounts = processedApplications.reduce((acc, app) => {
      const status = app.status?.toLowerCase() || 'other'
      if (status.includes('under review') || status.includes('pending')) {
        acc['Under Review']++
      } else if (status.includes('approved') || status.includes('granted')) {
        acc['Approved']++
      } else if (status.includes('declined') || status.includes('refused')) {
        acc['Declined']++
      } else {
        acc['Other']++
      }
      return acc
    }, {
      'Under Review': 0,
      'Approved': 0,
      'Declined': 0,
      'Other': 0
    })

    return new Response(
      JSON.stringify({
        applications: processedApplications,
        total,
        statusCounts
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})