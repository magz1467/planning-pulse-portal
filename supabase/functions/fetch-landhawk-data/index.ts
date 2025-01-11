import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log("Landhawk data fetch function started")

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const LANDHAWK_API_KEY = Deno.env.get('LANDHAWK_API_KEY')
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!LANDHAWK_API_KEY) {
      throw new Error('LANDHAWK_API_KEY is required')
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required')
    }

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Call Landhawk API here
    console.log("Fetching data from Landhawk API...")
    
    const wfsUrl = 'https://api.emapsite.com/dataservice/api/WFS'
    const params = new URLSearchParams({
      service: 'WFS',
      version: '2.0.0',
      request: 'GetFeature',
      typeName: 'LandHawk:PlanningApplication',
      outputFormat: 'application/json',
      srsName: 'EPSG:4326',
      count: '100'
    })

    const fullUrl = `${wfsUrl}?${params}`
    console.log('Fetching data from Landhawk WFS API:', fullUrl)
    
    // Create base64 encoded credentials
    const credentials = `${LANDHAWK_API_KEY}:${LANDHAWK_API_KEY}`;
    const base64Credentials = btoa(credentials);

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${base64Credentials}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Landhawk API error:', errorText)
      throw new Error(`Failed to fetch data: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log(`Received ${data.features?.length || 0} features from API`)

    let successCount = 0
    let errorCount = 0

    // Process each feature and insert into trial_application_data
    if (data.features && Array.isArray(data.features)) {
      for (const feature of data.features) {
        try {
          const { properties, geometry } = feature
          
          if (!properties) {
            console.warn('Skipping feature without properties')
            continue
          }

          const applicationData = {
            application_reference: properties.reference || null,
            description: properties.proposal || null,
            status: properties.status || null,
            decision_date: properties.decision?.decision_date || null,
            submission_date: properties.created_at || null,
            location: geometry, // This is already in GeoJSON format
            raw_data: properties,
            source_url: properties.url || null,
            address: properties.site?.address || null,
            url: properties.url || null,
            ward: properties.site?.ward || null,
            consultation_end_date: properties.consultation?.end_date || null,
            decision_details: properties.decision || null,
            application_type: properties.type || null,
            applicant_name: properties.applicant?.name || null,
            agent_details: properties.agent || null,
            constraints: properties.constraints || null
          }

          const { error } = await supabase
            .from('trial_application_data')
            .insert([applicationData])

          if (error) {
            console.error('Error inserting record:', error)
            errorCount++
          } else {
            successCount++
          }
        } catch (error) {
          console.error('Error processing feature:', error)
          errorCount++
        }
      }
    } else {
      console.error('Invalid data format received:', data)
      throw new Error('Invalid data format received from Landhawk API')
    }

    console.log(`Data insertion complete. Successfully inserted: ${successCount}, Errors: ${errorCount}`)

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully fetched and stored data from Landhawk API. Inserted: ${successCount}, Errors: ${errorCount}`,
        stats: {
          totalFeatures: data.features?.length || 0,
          successfulInserts: successCount,
          errors: errorCount
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        message: 'Failed to fetch and store data from Landhawk API'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})