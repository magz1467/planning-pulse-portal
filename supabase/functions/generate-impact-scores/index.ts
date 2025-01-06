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

async function calculateImpactScore(application: ApplicationData, retryCount = 0): Promise<{ score: number; details: any }> {
  console.log(`[Impact Score ${application.application_id}] Starting calculation (attempt ${retryCount + 1})`);
  
  const apiKey = Deno.env.get('PERPLEXITY_API_KEY');
  if (!apiKey) {
    throw new Error('Missing Perplexity API key');
  }

  try {
    const prompt = `
      Analyze this planning application and provide impact scores for each category. 
      Rate each subcategory from 1-5 (1=minimal impact, 5=severe impact).
      Return a valid JSON object with no markdown formatting.
      Format: {"Environmental": {"air_quality": 3, "noise": 2}, "Social": {"community": 4}}
      
      Application details:
      Description: ${application.description || 'N/A'}
      Type: ${application.development_type || application.application_type || 'N/A'}
      Additional details: ${JSON.stringify(application.application_details || {})}
    `;

    console.log(`[Impact Score ${application.application_id}] Sending request to Perplexity API`);
    
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
            content: 'You are an expert in analyzing planning applications and their potential impacts. Return only a valid JSON object with numerical scores, no explanations or markdown.'
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

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Impact Score ${application.application_id}] API Error:`, {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });

      // Retry on API errors with exponential backoff
      if (retryCount < 3) {
        const delay = Math.pow(2, retryCount) * 1000;
        console.log(`[Impact Score ${application.application_id}] Retrying after ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return calculateImpactScore(application, retryCount + 1);
      }

      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log(`[Impact Score ${application.application_id}] API Response:`, data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid API response format');
    }

    // Clean the response content
    const cleanContent = data.choices[0].message.content
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .trim();

    try {
      const scores = JSON.parse(cleanContent);
      console.log(`[Impact Score ${application.application_id}] Parsed scores:`, scores);
      
      // Calculate weighted score
      let totalScore = 0;
      let totalWeights = 0;
      const details: Record<string, any> = {};

      for (const [category, subcategories] of Object.entries(scores)) {
        details[category] = subcategories;
        for (const [subcategory, score] of Object.entries(subcategories as Record<string, number>)) {
          const weight = 1;
          totalScore += (score as number) * weight;
          totalWeights += weight;
        }
      }

      const normalizedScore = Math.round((totalScore / totalWeights) * 20);

      return {
        score: normalizedScore,
        details: scores
      };
    } catch (parseError) {
      console.error(`[Impact Score ${application.application_id}] JSON Parse Error:`, {
        content: cleanContent,
        error: parseError.message
      });

      // Retry on parse errors
      if (retryCount < 2) {
        const delay = Math.pow(2, retryCount) * 1000;
        console.log(`[Impact Score ${application.application_id}] Retrying after parse error in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return calculateImpactScore(application, retryCount + 1);
      }

      throw parseError;
    }
  } catch (error) {
    console.error(`[Impact Score ${application.application_id}] Error:`, {
      message: error.message,
      stack: error.stack,
      attempt: retryCount + 1
    });
    throw error;
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[Impact Score] Starting batch processing');
    const { limit = 50 } = await req.json();
    console.log('[Impact Score] Batch size:', limit);
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Create batch status record
    const { data: batchStatus, error: batchError } = await supabase
      .from('impact_score_batch_status')
      .insert([{ batch_size: limit }])
      .select()
      .single();

    if (batchError) {
      console.error('[Impact Score] Error creating batch status:', batchError);
      throw batchError;
    }

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
        
        const { error: updateError } = await supabase
          .from('applications')
          .update({ 
            impact_score: score,
            impact_score_details: details
          })
          .eq('application_id', application.application_id);

        if (updateError) {
          throw updateError;
        }
        
        processed++;
        
        // Update batch status periodically
        if (processed % 5 === 0) {
          await supabase
            .from('impact_score_batch_status')
            .update({ completed_count: processed })
            .eq('id', batchStatus.id);
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
    await supabase
      .from('impact_score_batch_status')
      .update({ 
        status: 'completed',
        completed_count: processed,
        error_message: errors > 0 ? JSON.stringify(errorDetails) : null
      })
      .eq('id', batchStatus.id);

    console.log('[Impact Score] Batch processing completed:', {
      processed,
      errors,
      batchId: batchStatus.id,
      errorDetails
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed,
        errors,
        errorDetails,
        message: `Successfully processed ${processed} applications${errors > 0 ? ` (${errors} failed)` : ''}`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Impact Score] Fatal error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        stack: error.stack 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});