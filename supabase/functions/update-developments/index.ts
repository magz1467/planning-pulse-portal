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

interface DevelopmentUpdate {
  external_id: string;
  title: string;
  address: string | null;
  status: string | null;
  description: string | null;
  applicant: string | null;
  submission_date: Date | null;
  decision_due: Date | null;
  type: string | null;
  ward: string | null;
  officer: string | null;
  consultation_end: Date | null;
  lat: number | null;
  lng: number | null;
  location: string | null;
  raw_data: any;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting planning data sync process');
    
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    let nextPage = 'https://www.planning.data.gov.uk/api/v1/applications';
    let pageCount = 0;
    let updatesCount = 0;
    let insertsCount = 0;
    const batchSize = 100; // Process in batches of 100
    let updateBatch: DevelopmentUpdate[] = [];

    while (nextPage) {
      pageCount++;
      console.log(`Processing page ${pageCount}: ${nextPage}`);
      
      const data = await fetchPageOfApplications(nextPage);
      
      if (!data.applications || !Array.isArray(data.applications)) {
        console.error('Invalid data format received:', data);
        break;
      }

      // Prepare batch of applications to check/update
      for (const application of data.applications) {
        const development: DevelopmentUpdate = {
          external_id: application.reference,
          title: application.proposal || 'No title provided',
          address: application.site?.address || null,
          status: application.status || null,
          description: application.proposal || null,
          applicant: application.applicant?.name || null,
          submission_date: application.created_at ? new Date(application.created_at) : null,
          decision_due: application.decision?.decision_date ? new Date(application.decision.decision_date) : null,
          type: application.type || null,
          ward: application.site?.ward || null,
          officer: application.officer?.name || null,
          consultation_end: application.consultation?.end_date ? new Date(application.consultation.end_date) : null,
          lat: application.site?.location?.latitude || null,
          lng: application.site?.location?.longitude || null,
          location: application.site?.location?.latitude && application.site?.location?.longitude ? 
            `SRID=4326;POINT(${application.site.location.longitude} ${application.site.location.latitude})` : null,
          raw_data: application
        };

        updateBatch.push(development);

        // Process batch when it reaches the batch size
        if (updateBatch.length >= batchSize) {
          const { inserts, updates } = await processBatch(updateBatch, supabase);
          insertsCount += inserts;
          updatesCount += updates;
          updateBatch = []; // Clear batch after processing
        }
      }

      // Process any remaining items in the batch
      if (updateBatch.length > 0) {
        const { inserts, updates } = await processBatch(updateBatch, supabase);
        insertsCount += inserts;
        updatesCount += updates;
        updateBatch = [];
      }

      // Check for next page in the HAL links
      nextPage = data._links?.next?.href || null;
      
      // Log progress
      console.log(`Completed page ${pageCount}. Total inserts: ${insertsCount}, updates: ${updatesCount}`);
      
      // Add a small delay to avoid rate limiting
      if (nextPage) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log('Planning data sync completed');
    
    return new Response(
      JSON.stringify({
        message: 'Planning data sync completed successfully',
        pagesProcessed: pageCount,
        totalInserts: insertsCount,
        totalUpdates: updatesCount
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
        error: 'Failed to sync planning data',
        details: error.message
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
})

async function processBatch(batch: DevelopmentUpdate[], supabase: any) {
  let inserts = 0;
  let updates = 0;

  try {
    // First check which records exist
    const externalIds = batch.map(dev => dev.external_id);
    const { data: existingRecords } = await supabase
      .from('developments')
      .select('external_id, status, decision_due, consultation_end')
      .in('external_id', externalIds);

    const existingMap = new Map(existingRecords?.map(record => [record.external_id, record]));

    // Split batch into inserts and updates
    const toInsert = [];
    const toUpdate = [];

    for (const development of batch) {
      const existing = existingMap.get(development.external_id);
      
      if (!existing) {
        toInsert.push(development);
      } else if (
        existing.status !== development.status ||
        existing.decision_due !== development.decision_due?.toISOString() ||
        existing.consultation_end !== development.consultation_end?.toISOString()
      ) {
        toUpdate.push(development);
      }
    }

    // Process inserts
    if (toInsert.length > 0) {
      const { error: insertError } = await supabase
        .from('developments')
        .insert(toInsert);

      if (insertError) {
        console.error('Error inserting developments:', insertError);
      } else {
        inserts = toInsert.length;
      }
    }

    // Process updates
    if (toUpdate.length > 0) {
      const { error: updateError } = await supabase
        .from('developments')
        .upsert(toUpdate, {
          onConflict: 'external_id',
          ignoreDuplicates: false
        });

      if (updateError) {
        console.error('Error updating developments:', updateError);
      } else {
        updates = toUpdate.length;
      }
    }

  } catch (error) {
    console.error('Error processing batch:', error);
  }

  return { inserts, updates };
}