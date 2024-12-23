import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client with service role key
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch planning data from the API
    const response = await fetch('https://www.planning.data.gov.uk/api/v1/applications', {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Planning API responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Fetched planning data:', data);

    // Process each application and upsert to database
    for (const application of data.applications || []) {
      const development = {
        external_id: application.reference,
        title: application.proposal || 'No title provided',
        address: application.site?.address || 'No address provided',
        status: application.status || 'Unknown',
        description: application.proposal || '',
        applicant: application.applicant?.name || 'Unknown',
        submission_date: application.created_at ? new Date(application.created_at) : null,
        decision_due: application.decision?.decision_date ? new Date(application.decision.decision_date) : null,
        type: application.type || 'Unknown',
        ward: application.site?.ward || '',
        officer: application.officer?.name || '',
        consultation_end: application.consultation?.end_date ? new Date(application.consultation.end_date) : null,
        lat: application.site?.location?.latitude || null,
        lng: application.site?.location?.longitude || null,
        raw_data: application
      };

      const { data: upsertResult, error: upsertError } = await supabase
        .from('developments')
        .upsert(development, {
          onConflict: 'external_id',
          returning: true
        });

      if (upsertError) {
        console.error('Error upserting development:', upsertError);
        throw upsertError;
      }

      console.log('Successfully upserted development:', upsertResult);
    }

    return new Response(
      JSON.stringify({
        message: 'Planning data updated successfully',
        processed: data.applications?.length || 0
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error in update-developments function:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to update planning data',
        details: error.message
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
})