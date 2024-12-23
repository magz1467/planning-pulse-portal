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

async function processApplications(applications: any[], supabase: any) {
  let processedCount = 0;
  
  for (const application of applications) {
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

    const { error: upsertError } = await supabase
      .from('developments')
      .upsert(development, {
        onConflict: 'external_id',
        returning: true
      });

    if (upsertError) {
      console.error('Error upserting development:', upsertError);
      continue; // Continue with next application instead of throwing
    }

    processedCount++;
    if (processedCount % 100 === 0) {
      console.log(`Processed ${processedCount} applications`);
    }
  }

  return processedCount;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting planning data update process');
    
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    let nextPage = 'https://www.planning.data.gov.uk/api/v1/applications';
    let totalProcessed = 0;
    let pageCount = 0;

    while (nextPage) {
      pageCount++;
      console.log(`Fetching page ${pageCount}: ${nextPage}`);
      
      const data = await fetchPageOfApplications(nextPage);
      
      if (!data.applications || !Array.isArray(data.applications)) {
        console.error('Invalid data format received:', data);
        break;
      }

      const processedCount = await processApplications(data.applications, supabase);
      totalProcessed += processedCount;

      // Check for next page in the HAL links
      nextPage = data._links?.next?.href || null;
      
      // Log progress
      console.log(`Completed page ${pageCount}. Processed ${processedCount} applications on this page.`);
      console.log(`Total processed so far: ${totalProcessed}`);
      
      // Optional: Add a small delay to avoid rate limiting
      if (nextPage) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log('Planning data update process completed');
    
    return new Response(
      JSON.stringify({
        message: 'Planning data update completed successfully',
        totalProcessed,
        pagesProcessed: pageCount
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