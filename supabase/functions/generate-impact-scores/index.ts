import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { corsHeaders } from '../_shared/cors.ts';

interface ApplicationData {
  application_id: number;
  description: string;
  development_type: string;
  application_type: string;
  application_details: any;
}

interface ImpactCriteria {
  category: string;
  subcategory: string;
  weight: number;
}

async function calculateImpactScore(application: ApplicationData): Promise<{ score: number; details: any }> {
  console.log(`[Impact Score] Calculating score for application ${application.application_id}`);
  
  const apiKey = Deno.env.get('PERPLEXITY_API_KEY');
  if (!apiKey) {
    throw new Error('Missing Perplexity API key');
  }

  const prompt = `
    Analyze this planning application and provide impact scores for each category. 
    Rate each subcategory from 1-5 (1=minimal impact, 5=severe impact).
    Respond in JSON format only.
    
    Application details:
    Description: ${application.description || 'N/A'}
    Type: ${application.development_type || application.application_type || 'N/A'}
    Additional details: ${JSON.stringify(application.application_details || {})}
  `;

  console.log(`[Impact Score] Sending request to Perplexity API for application ${application.application_id}`);
  
  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are an expert in analyzing planning applications and their potential impacts. Provide numerical scores only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 1000
      }),
    });

    const data = await response.json();
    console.log(`[Impact Score] Received response from Perplexity API for application ${application.application_id}:`, data);
    
    const scores = JSON.parse(data.choices[0].message.content);
    
    // Calculate weighted score
    let totalScore = 0;
    const details: Record<string, any> = {};

    for (const [category, subcategories] of Object.entries(scores)) {
      details[category] = subcategories;
      for (const [subcategory, score] of Object.entries(subcategories as Record<string, number>)) {
        const weight = criteria.find(c => 
          c.category === category && c.subcategory === subcategory
        )?.weight || 0;
        totalScore += (score as number / 5) * weight;
      }
    }

    console.log(`[Impact Score] Calculated final score for application ${application.application_id}:`, {
      totalScore,
      details
    });

    return {
      score: Math.round(totalScore),
      details: scores
    };
  } catch (error) {
    console.error(`[Impact Score] Error calculating score for application ${application.application_id}:`, error);
    throw error;
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { limit = 50 } = await req.json();
    console.log('[Impact Score] Starting batch processing with limit:', limit);
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Create batch status record
    const { data: batchStatus } = await supabase
      .from('impact_score_batch_status')
      .insert([{ batch_size: limit }])
      .select()
      .single();

    console.log('[Impact Score] Created batch status record:', batchStatus);

    // Get applications without impact scores
    const { data: applications, error: fetchError } = await supabase
      .from('applications')
      .select('*')
      .is('impact_score', null)
      .limit(limit);

    if (fetchError) {
      console.error('[Impact Score] Error fetching applications:', fetchError);
      throw fetchError;
    }

    console.log(`[Impact Score] Processing ${applications?.length} applications`);
    let processed = 0;
    let errors = 0;

    for (const application of applications || []) {
      try {
        console.log(`[Impact Score] Processing application ${application.application_id} (${processed + 1}/${applications?.length})`);
        
        const { score, details } = await calculateImpactScore(application);
        
        const { error: updateError } = await supabase
          .from('applications')
          .update({ 
            impact_score: score,
            impact_score_details: details
          })
          .eq('application_id', application.application_id);

        if (updateError) {
          console.error(`[Impact Score] Error updating application ${application.application_id}:`, updateError);
          throw updateError;
        }
        
        processed++;
        
        // Update batch status
        await supabase
          .from('impact_score_batch_status')
          .update({ completed_count: processed })
          .eq('id', batchStatus.id);

      } catch (error) {
        console.error(`[Impact Score] Error processing application ${application.application_id}:`, error);
        errors++;
      }
    }

    // Update final batch status
    await supabase
      .from('impact_score_batch_status')
      .update({ 
        status: 'completed',
        completed_count: processed,
        error_message: errors > 0 ? `Failed to process ${errors} applications` : null
      })
      .eq('id', batchStatus.id);

    console.log('[Impact Score] Batch processing completed:', {
      processed,
      errors,
      batchId: batchStatus.id
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed,
        errors,
        message: `Successfully processed ${processed} applications${errors > 0 ? ` (${errors} failed)` : ''}`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Impact Score] Fatal error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});