import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'
import { DevelopmentUpdate } from './types.ts'
import { processBatch } from './batch-processor.ts'
import { fetchPageOfApplications } from './api-client.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting planning data sync process');
    
    let nextPage = 'https://www.planning.data.gov.uk/api/v1/applications';
    let pageCount = 0;
    let updatesCount = 0;
    let insertsCount = 0;
    const batchSize = 100;
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
          const { inserts, updates } = await processBatch(updateBatch);
          insertsCount += inserts;
          updatesCount += updates;
          updateBatch = []; // Clear batch after processing
        }
      }

      // Process any remaining items in the batch
      if (updateBatch.length > 0) {
        const { inserts, updates } = await processBatch(updateBatch);
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