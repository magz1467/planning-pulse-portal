import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Database } from '../database.types'
import { calculateImpactScore } from './perplexity.ts'
import { ApplicationData, ImpactScoreResponse } from './types.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders,
      status: 204
    });
  }

  try {
    const { applicationId } = await req.json();

    if (!applicationId) {
      throw new Error('Application ID is required');
    }

    console.log(`[Impact Score] Processing application ${applicationId}`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`[Impact Score] Fetching application details for ID: ${applicationId}`);
    
    const { data: application, error: fetchError } = await supabase
      .from('applications')
      .select('*')
      .eq('application_id', applicationId)
      .single();

    if (fetchError) {
      console.error('[Impact Score] Error fetching application:', fetchError);
      throw new Error(`Failed to fetch application: ${fetchError.message}`);
    }

    if (!application) {
      throw new Error('Application not found');
    }

    console.log('[Impact Score] Calculating impact score...');
    const result = await calculateImpactScore(application as ApplicationData);

    if (!result || !result.score) {
      throw new Error('Failed to calculate impact score');
    }

    const { score, details } = result;

    console.log(`[Impact Score] Updating application ${applicationId} with score:`, score);
    
    const { error: updateError } = await supabase
      .from('applications')
      .update({
        impact_score: score,
        impact_score_details: details
      })
      .eq('application_id', applicationId);

    if (updateError) {
      console.error('[Impact Score] Error updating application:', updateError);
      throw new Error(`Failed to update application: ${updateError.message}`);
    }

    const response: ImpactScoreResponse = {
      success: true,
      score,
      details
    };

    return new Response(
      JSON.stringify(response),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200
      }
    );

  } catch (error) {
    console.error('[Impact Score] Error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'An unknown error occurred'
      }),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 500
      }
    );
  }
})