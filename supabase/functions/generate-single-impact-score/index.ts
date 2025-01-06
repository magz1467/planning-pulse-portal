import { corsHeaders } from '../_shared/cors.ts';
import { Database } from './database.ts';
import { generateImpactAnalysis } from './perplexity.ts';
import { calculateNormalizedScore } from './score-calculator.ts';
import { ImpactScoreResponse } from './types.ts';

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
    const requestBody = await req.text();
    console.log('Raw request body:', requestBody);
    
    let { applicationId } = JSON.parse(requestBody);
    
    if (!applicationId) {
      console.error('Missing applicationId in request');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Application ID is required' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }

    console.log('Processing applicationId:', applicationId);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const perplexityKey = Deno.env.get('PERPLEXITY_API_KEY')!;
    
    if (!perplexityKey) {
      console.error('Missing Perplexity API key in environment');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Server configuration error' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      );
    }

    const db = new Database(supabaseUrl, supabaseKey);
    
    // Get application details
    const application = await db.getApplication(applicationId);

    // Generate impact scores using Perplexity
    const scores = await generateImpactAnalysis(application, perplexityKey);
    
    // Calculate normalized score
    const normalizedScore = calculateNormalizedScore(scores);

    // Update application with score
    await db.updateImpactScore(applicationId, normalizedScore, scores);

    const response: ImpactScoreResponse = {
      success: true,
      score: normalizedScore,
      details: scores
    };

    return new Response(
      JSON.stringify(response),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
        status: 200
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
          'Content-Type': 'application/json' 
        },
        status: 500
      }
    );
  }
});