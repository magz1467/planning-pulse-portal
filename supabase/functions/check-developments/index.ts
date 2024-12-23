import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function fetchPageOfApplications(pageUrl: string) {
  const response = await fetch(pageUrl, {
    headers: {
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Planning API responded with status: ${response.status}`);
  }

  return await response.json();
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting planning data check process');
    
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    let nextPage = 'https://www.planning.data.gov.uk/api/v1/applications';
    let needsUpdate = [];
    let pageCount = 0;

    while (nextPage) {
      pageCount++;
      console.log(`Checking page ${pageCount}: ${nextPage}`);
      
      const data = await fetchPageOfApplications(nextPage);
      
      if (!data.applications || !Array.isArray(data.applications)) {
        console.error('Invalid data format received:', data);
        break;
      }

      // For each application in the API response
      for (const application of data.applications) {
        // Check if we have this application in our database
        const { data: existingApp, error } = await supabase
          .from('developments')
          .select('*')
          .eq('external_id', application.reference)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
          console.error('Error checking application:', error);
          continue;
        }

        // If we don't have it or if the data is different, add to needs update list
        if (!existingApp || 
            existingApp.status !== application.status ||
            existingApp.decision_due !== (application.decision?.decision_date ? new Date(application.decision.decision_date).toISOString() : null) ||
            existingApp.consultation_end !== (application.consultation?.end_date ? new Date(application.consultation.end_date).toISOString() : null)) {
          
          needsUpdate.push({
            reference: application.reference,
            status: {
              current: existingApp?.status || null,
              new: application.status || null
            },
            decision_due: {
              current: existingApp?.decision_due || null,
              new: application.decision?.decision_date ? new Date(application.decision.decision_date).toISOString() : null
            },
            consultation_end: {
              current: existingApp?.consultation_end || null,
              new: application.consultation?.end_date ? new Date(application.consultation.end_date).toISOString() : null
            },
            exists: !!existingApp
          });
        }
      }

      // Check for next page in the HAL links
      nextPage = data._links?.next?.href || null;
      
      // Log progress
      console.log(`Completed checking page ${pageCount}. Found ${needsUpdate.length} entries needing updates so far.`);
      
      // Optional: Add a small delay to avoid rate limiting
      if (nextPage) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log('Planning data check completed');
    
    return new Response(
      JSON.stringify({
        message: 'Planning data check completed successfully',
        needsUpdate,
        pagesChecked: pageCount,
        totalNeedingUpdates: needsUpdate.length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error in check-developments function:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to check planning data',
        details: error.message
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
})