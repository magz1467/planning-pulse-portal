import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { corsHeaders } from '../_shared/cors.ts'

const LANDHAWK_USERNAME = 'makemyhousegreen_trial'
const LANDHAWK_PASSWORD = 'RC3U09O8XKXYP5ML'
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

interface LandhawkResponse {
  application_reference: string | null;
  description: string | null;
  status: string | null;
  decision_date: string | null;
  submission_date: string | null;
  location: {
    type: string;
    coordinates: [number, number];
  } | null;
  address: string | null;
  ward: string | null;
  consultation_end_date: string | null;
  application_type: string | null;
  applicant_name: string | null;
  agent_details: any | null;
  constraints: any | null;
  raw_data: any;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders 
    })
  }

  try {
    console.log('Starting to fetch Landhawk data...')
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

    // Get the limit from the request body if provided
    let limit = 100; // Default limit
    if (req.method === 'POST') {
      try {
        const body = await req.json();
        if (body && typeof body.limit === 'number') {
          limit = body.limit;
        }
      } catch (e) {
        console.log('No request body or invalid JSON, using default limit:', limit);
      }
    }
    
    console.log(`Fetching ${limit} records from Landhawk WFS API`)

    // Fetch data from Landhawk WFS API
    const wfsUrl = 'https://api.emapsite.com/dataservice/api/WFS'
    const params = new URLSearchParams({
      service: 'WFS',
      version: '2.0.0',
      request: 'GetFeature',
      typeName: 'LandHawk:PlanningApplication',
      outputFormat: 'application/json',
      srsName: 'EPSG:4326',
      count: limit.toString()
    })

    console.log('Making request to Landhawk WFS API...')
    const response = await fetch(`${wfsUrl}?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${btoa(`${LANDHAWK_USERNAME}:${LANDHAWK_PASSWORD}`)}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Landhawk API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json()
    console.log(`Received ${data.features?.length || 0} applications from Landhawk`)

    // Transform GeoJSON features to our expected format
    const transformedData = data.features.map((feature: any) => ({
      application_reference: feature.properties.reference || null,
      description: feature.properties.description || null,
      status: feature.properties.status || null,
      decision_date: feature.properties.decision_date || null,
      submission_date: feature.properties.submission_date || null,
      location: feature.geometry || null,
      address: feature.properties.address || null,
      ward: feature.properties.ward || null,
      consultation_end_date: feature.properties.consultation_end_date || null,
      application_type: feature.properties.application_type || null,
      applicant_name: feature.properties.applicant_name || null,
      agent_details: feature.properties.agent_details || null,
      constraints: feature.properties.constraints || null,
      raw_data: feature.properties
    }))

    // Clear existing data if this is not a "fetch more" operation
    if (!req.method === 'POST' || !limit) {
      const { error: deleteError } = await supabase
        .from('trial_application_data')
        .delete()
        .neq('id', 0) // Delete all records

      if (deleteError) {
        throw deleteError
      }
    }

    // Insert the new data
    const { error } = await supabase
      .from('trial_application_data')
      .insert(transformedData)

    if (error) {
      throw error
    }

    console.log('Successfully inserted data into trial_application_data')
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully fetched and stored ${transformedData.length} records` 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 // Return 200 even for errors, but include error message in response
      }
    )
  }
})