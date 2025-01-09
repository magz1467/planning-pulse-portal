import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const PARTNER_USERNAME = 'makemyhousegreen_trial'
const PARTNER_PASSWORD = 'RC3U09O8XKXYP5ML'
const WFS_URL = 'https://api.emapsite.com/dataservice/api/WFS'

interface PlanningApplication {
  application_reference: string;
  description: string;
  status: string;
  decision_date?: string;
  submission_date?: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  address: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Basic auth credentials
    const credentials = btoa(`${PARTNER_USERNAME}:${PARTNER_PASSWORD}`)

    // Fetch data from WFS
    const response = await fetch(
      `${WFS_URL}?service=WFS&version=2.0.0&request=GetFeature&typeName=LandHawk:PlanningApplication&outputFormat=application/json&count=25`,
      {
        headers: {
          'Authorization': `Basic ${credentials}`
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`)
    }

    const data = await response.json()
    console.log(`Fetched ${data.features.length} applications from WFS`)

    // Transform and insert data
    const applications = data.features.map((feature: any) => ({
      application_reference: feature.properties.reference || null,
      description: feature.properties.description || null,
      status: feature.properties.status || null,
      decision_date: feature.properties.decision_date || null,
      submission_date: feature.properties.submission_date || null,
      location: feature.geometry,
      raw_data: feature.properties,
      source_url: feature.properties.url || null,
      address: feature.properties.address || null
    }))

    // Insert data into Supabase
    const { error } = await supabaseClient
      .from('trial_application_data')
      .insert(applications)

    if (error) {
      throw error
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully imported ${applications.length} applications` 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error:', error.message)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})