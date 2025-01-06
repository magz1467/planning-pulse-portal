import { corsHeaders } from '../_shared/cors.ts';
import { Database } from './database.ts';
import { calculateImpactScore } from './perplexity.ts';
import { ProcessingResult } from './types.ts';

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Methods': 'POST',
      }
    });
  }

  try {
    console.log('[Impact Score] Starting batch processing');
    const { limit = 50 } = await req.json();
    console.log('[Impact Score] Batch size:', limit);
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const db = new Database(supabaseUrl, supabaseKey);

    // Create batch status record
    const batchStatus = await db.createBatchStatus(limit);

    // Get applications without impact scores
    const applications = await db.getApplicationsWithoutScores(limit);

    if (!applications?.length) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          processed: 0,
          errors: 0,
          message: 'No applications found needing impact scores'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[Impact Score] Processing ${applications.length} applications`);
    let processed = 0;
    let errors = 0;
    let errorDetails: Array<{id: number, error: string}> = [];

    for (const application of applications) {
      try {
        const { score, details } = await calculateImpactScore(application);
        await db.updateApplicationScore(application.application_id, score, details);
        processed++;
        
        // Update batch status periodically
        if (processed % 5 === 0) {
          await db.updateBatchStatus(batchStatus.id, 'processing', processed);
        }

      } catch (error) {
        console.error(`[Impact Score] Error processing application ${application.application_id}:`, {
          message: error.message,
          stack: error.stack
        });
        errors++;
        errorDetails.push({
          id: application.application_id,
          error: error.message
        });
      }
    }

    // Update final batch status
    await db.updateBatchStatus(
      batchStatus.id,
      'completed',
      processed,
      errors > 0 ? JSON.stringify(errorDetails) : null
    );

    // Get statistics
    const { count } = await db.getApplicationsWithScores();
    const recentScores = await db.getRecentScores();

    console.log('[Impact Score] Batch processing completed:', {
      processed,
      errors,
      batchId: batchStatus.id,
      errorDetails,
      totalWithScores: count,
      recentScores
    });

    const result: ProcessingResult = {
      success: true,
      processed,
      errors,
      errorDetails,
      message: `Successfully processed ${processed} applications${errors > 0 ? ` (${errors} failed)` : ''}`
    };

    return new Response(
      JSON.stringify(result),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('[Impact Score] Fatal error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        stack: error.stack 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
});