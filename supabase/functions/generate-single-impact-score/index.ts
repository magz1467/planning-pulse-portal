import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { generateImpactScore } from "./perplexity.ts";
import { ApplicationData } from "./types.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { applicationId } = await req.json();

    if (!applicationId) {
      throw new Error('Application ID is required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Fetching application:', applicationId);
    const { data: application, error: fetchError } = await supabase
      .from('applications')
      .select('*')
      .eq('application_id', applicationId)
      .single();

    if (fetchError || !application) {
      throw new Error(`Failed to fetch application: ${fetchError?.message || 'Not found'}`);
    }

    console.log('Generating impact score for application:', applicationId);
    const result = await generateImpactScore(application as ApplicationData);

    if (!result.success) {
      throw new Error(result.error || 'Failed to generate impact score');
    }

    const { data: { score, details } } = result;

    console.log('Updating application with score:', score);
    const { error: updateError } = await supabase
      .from('applications')
      .update({
        impact_score: score,
        impact_score_details: details
      })
      .eq('application_id', applicationId);

    if (updateError) {
      throw new Error(`Failed to update application: ${updateError.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        score,
        details
      }),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('Error in generate-single-impact-score:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 500,
      }
    );
  }
});