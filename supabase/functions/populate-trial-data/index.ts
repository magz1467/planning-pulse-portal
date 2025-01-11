import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const LANDHAWK_USERNAME = 'makemyhousegreen_trial'
const LANDHAWK_PASSWORD = 'RC3U09O8XKXYP5ML'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting population of trial application data...')
    
    const wfsUrl = 'https://api.emapsite.com/dataservice/api/WFS'
    const params = new URLSearchParams({
      service: 'WFS',
      version: '2.0.0',
      request: 'GetFeature',
      typeName: 'LandHawk:PlanningApplication',
      outputFormat: 'application/json',
      srsName: 'EPSG:4326',
      count: '100' // Limit to 100 records for trial data
    })

    const fullUrl = `${wfsUrl}?${params}`
    console.log('Fetching data from Landhawk WFS API:', fullUrl)
    
    const authString = btoa(`${LANDHAWK_USERNAME}:${LANDHAWK_PASSWORD}`)

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Landhawk API error:', errorText)
      throw new Error(`Failed to fetch data: ${errorText}`)
    }

    const data = await response.json()
    console.log(`Received ${data.features?.length || 0} features from API`)

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    let successCount = 0
    let errorCount = 0

    // Process each feature and insert into trial_application_data
    for (const feature of data.features || []) {
      try {
        const { properties, geometry } = feature

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

        const { error } = await supabaseClient
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

    console.log(`Population complete. Successfully inserted: ${successCount}, Errors: ${errorCount}`)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Trial data population complete',
        stats: {
          totalFeatures: data.features?.length || 0,
          successfulInserts: successCount,
          errors: errorCount
        }
      }), 
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        message: 'Failed to populate trial data'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})