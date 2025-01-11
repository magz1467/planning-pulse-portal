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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Basic auth credentials
    const credentials = btoa(`${PARTNER_USERNAME}:${PARTNER_PASSWORD}`)

    console.log('🔍 Fetching WFS data from emapsite API...')

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
      console.error('WFS API Error:', response.status, await response.text())
      throw new Error(`Failed to fetch data: ${response.statusText}`)
    }

    const data = await response.json()
    console.log(`📦 Fetched ${data.features.length} applications from WFS`)
    console.log('Sample feature:', JSON.stringify(data.features[0], null, 2))

    // Transform and insert data
    const applications = data.features.map((feature: any) => {
      const app = {
        application_reference: feature.properties.reference || null,
        description: feature.properties.description || null,
        status: feature.properties.status || null,
        decision_date: feature.properties.decision_date || null,
        submission_date: feature.properties.submission_date || null,
        location: feature.geometry,
        raw_data: feature.properties,
        source_url: feature.properties.url || null,
        address: feature.properties.address || null
      }
      console.log('🔄 Transformed application:', JSON.stringify(app, null, 2))
      return app
    })

    // Insert data into Supabase
    const { error } = await supabaseClient
      .from('trial_application_data')
      .insert(applications)

    if (error) {
      console.error('Supabase insert error:', error)
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