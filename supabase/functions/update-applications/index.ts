import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'
import { Application } from './types.ts'
import { processBatch } from './batch-processor.ts'
import { fetchPageOfApplications } from './api-client.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting planning data sync process');

    let nextPage = 'https://www.planning.data.gov.uk/entity.json?limit=10';
    let pageCount = 0;
    let updatesCount = 0;
    let insertsCount = 0;
    const batchSize = 1;
    let updateBatch: Application[] = [];


    while (nextPage) {
      pageCount++;
      console.log(`Processing page ${pageCount}: ${nextPage}`);

      const data = await fetchPageOfApplications(nextPage);

      if (!data.entities || !Array.isArray(data.entities)) {
        console.error('Invalid data format received:', data);
        break;
      }

      // Prepare batch of entity. to check/update
      for (const entity of data.entities) {
        const application: Application = {
          external_id: entity.reference,
          title: entity.proposal || 'No title provided',
          address: entity.site?.address || null,
          status: entity.status || null,
          description: entity.proposal || null,
          applicant: entity.applicant?.name || null,
          submission_date: entity.created_at ? new Date(entity.created_at) : null,
          decision_due: entity.decision?.decision_date ? new Date(entity.decision.decision_date) : null,
          type: entity.type || null,
          ward: entity.site?.ward || null,
          officer: entity.officer?.name || null,
          consultation_end: entity.consultation?.end_date ? new Date(entity.consultation.end_date) : null,
          lat: entity.site?.location?.latitude || null,
          lng: entity.site?.location?.longitude || null,
          location: entity.site?.location?.latitude && entity.site?.location?.longitude ?
            `SRID=4326;POINT(${entity.site.location.longitude} ${entity.site.location.latitude})` : null,
          raw_data: entity,
        };

        updateBatch.push(application);

        console.log(`UpdateBatch sise ${updateBatch.length}`)

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
      console.log(nextPage)

      // Log progress
      console.log(`Completed page ${pageCount}. Total inserts: ${insertsCount}, updates: ${updatesCount}`);

      throw new Error("done a round")
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
        headers: { ...corsHeaders, 'Content-Type': 'entity.json' },
        status: 200
      }
    );
  } catch (error) {
    console.error('Error in update-entity. function:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to sync planning data',
        details: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'entity.json' },
        status: 500
      }
    );
  }
})
