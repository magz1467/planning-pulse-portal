import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { corsHeaders } from '../_shared/cors.ts'

const LANDHAWK_API_KEY = Deno.env.get('LANDHAWK_API_KEY')
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
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

    // Fetch 500 applications from Landhawk API
    const response = await fetch('https://api.landhawk.uk/v1/applications', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${LANDHAWK_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        limit: 500,
      })
    });

    if (!response.ok) {
      throw new Error(`Landhawk API error: ${response.statusText}`)
    }

    const data = await response.json()

    // Insert the data into our trial_application_data table
    const { error } = await supabase
      .from('trial_application_data')
      .insert(data.map((app: LandhawkResponse) => ({
        application_reference: app.application_reference,
        description: app.description,
        status: app.status,
        decision_date: app.decision_date,
        submission_date: app.submission_date,
        location: app.location,
        address: app.address,
        ward: app.ward,
        consultation_end_date: app.consultation_end_date,
        application_type: app.application_type,
        applicant_name: app.applicant_name,
        agent_details: app.agent_details,
        constraints: app.constraints,
        raw_data: app // Store the complete response
      })))

    if (error) {
      throw error
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})