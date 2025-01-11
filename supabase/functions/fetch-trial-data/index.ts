import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

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
  raw_data: any;
  source_url: string | null;
  url?: string;
  ward?: string;
  consultation_end_date?: string;
  decision_details?: any;
  application_type?: string;
  applicant_name?: string;
  agent_details?: any;
  constraints?: any;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🔍 Fetching trial planning application data...')

    // Simulated planning applications data
    const applications: PlanningApplication[] = [
      {
        application_reference: 'APP/2024/001',
        description: 'Construction of a new three-storey residential building comprising 6 apartments',
        status: 'Under Review',
        submission_date: '2024-01-09',
        decision_date: null,
        location: {
          type: 'Point',
          coordinates: [-0.118092, 51.509865]
        },
        address: '123 Example Street, London',
        url: 'https://example.com/planning/APP2024001',
        ward: 'City Centre',
        consultation_end_date: '2024-01-30',
        application_type: 'Full Planning Permission',
        applicant_name: 'John Smith',
        agent_details: {
          name: 'Planning Consultants Ltd',
          address: '456 Business Ave, London'
        },
        constraints: {
          conservation_area: true,
          listed_building: false
        },
        raw_data: {},
        source_url: null
      },
      // ... Add more sample applications with the new fields
    ];

    // Generate more sample applications with varying locations around London
    const additionalApplications = Array.from({ length: 17 }, (_, i) => ({
      ...applications[0],
      application_reference: `APP/2024/${String(i + 2).padStart(3, '0')}`,
      location: {
        type: 'Point',
        coordinates: [
          -0.127758 + (Math.random() - 0.5) * 3, // Longitude variation
          51.507351 + (Math.random() - 0.5) * 3  // Latitude variation
        ]
      },
      status: ['Under Review', 'Approved', 'Declined'][Math.floor(Math.random() * 3)],
      consultation_end_date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      ward: ['City Centre', 'North', 'South', 'East', 'West'][Math.floor(Math.random() * 5)]
    }));

    const allApplications = [...applications, ...additionalApplications];

    // Insert into Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log(`📥 Inserting ${allApplications.length} applications...`)

    for (const app of allApplications) {
      const { error } = await supabaseClient
        .from('trial_application_data')
        .upsert({
          application_reference: app.application_reference,
          description: app.description,
          status: app.status,
          decision_date: app.decision_date,
          submission_date: app.submission_date,
          location: app.location,
          address: app.address,
          raw_data: app.raw_data,
          source_url: app.source_url,
          url: app.url,
          ward: app.ward,
          consultation_end_date: app.consultation_end_date,
          decision_details: app.decision_details,
          application_type: app.application_type,
          applicant_name: app.applicant_name,
          agent_details: app.agent_details,
          constraints: app.constraints
        }, {
          onConflict: 'application_reference'
        })

      if (error) {
        console.error('Error inserting application:', error)
        throw error
      }
    }

    console.log('✅ Successfully inserted trial data')

    return new Response(
      JSON.stringify({ success: true, count: allApplications.length }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})