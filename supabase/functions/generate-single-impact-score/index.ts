import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

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

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Fetching application details for ID: ${applicationId}`);
    
    // Get application details
    const { data: application, error: fetchError } = await supabase
      .from('applications')
      .select('*')
      .eq('application_id', applicationId)
      .single();

    if (fetchError || !application) {
      console.error('Error fetching application:', fetchError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Application not found' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404
        }
      );
    }

    console.log('Generating prompt for application');
    
    // Generate the prompt with more specific details to ensure unique scores
    const prompt = `
      Analyze this planning application and provide impact scores for each category. 
      Rate each subcategory from 1-5 (1=minimal impact, 5=severe impact).
      Consider the specific details of this application carefully.
      Return only a valid JSON object with numerical scores, no explanations or markdown formatting.
      Format example: {"Environmental":{"air_quality":3,"noise":2},"Social":{"community":4}}
      
      Application details:
      ID: ${application.application_id}
      Description: ${application.description || 'N/A'}
      Type: ${application.development_type || application.application_type || 'N/A'}
      Status: ${application.status || 'N/A'}
      Location: ${application.address || 'N/A'}
      Additional details: ${JSON.stringify(application.application_details || {})}
    `;

    console.log('Calling Perplexity API with unique application context');
    
    // Call Perplexity API with temperature set to ensure more varied responses
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are an expert in analyzing planning applications and their potential impacts. Analyze each application uniquely based on its specific details. Return only a valid JSON object with numerical scores.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7, // Increased temperature for more variation
        max_tokens: 1000
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Perplexity API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `AI Service error: ${response.status}` 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 502
        }
      );
    }

    const data = await response.json();
    console.log('Received API response:', data);
    
    if (!data.choices?.[0]?.message?.content) {
      console.error('Invalid API response format:', data);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid AI response format' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 502
        }
      );
    }

    let scores;
    try {
      // Remove any markdown formatting that might be present
      const content = data.choices[0].message.content
        .replace(/```json\n|\n```/g, '')
        .replace(/```/g, '')
        .trim();
      console.log('Cleaned content:', content);
      scores = JSON.parse(content);
      console.log('Parsed impact scores:', scores);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid score format returned' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 502
        }
      );
    }

    // Calculate normalized score with weighted categories
    let totalScore = 0;
    let totalWeights = 0;

    // Define category weights
    const categoryWeights = {
      'Environmental': 1.2,
      'Social': 1.0,
      'Infrastructure': 0.8
    };

    for (const [category, subcategories] of Object.entries(scores)) {
      const categoryWeight = categoryWeights[category] || 1.0;
      for (const [subcategory, score] of Object.entries(subcategories as Record<string, number>)) {
        const weight = categoryWeight;
        totalScore += (score as number) * weight;
        totalWeights += weight;
      }
    }

    const normalizedScore = Math.round((totalScore / totalWeights) * 20);
    console.log('Calculated normalized score:', normalizedScore);

    // Update application with score
    const { error: updateError } = await supabase
      .from('applications')
      .update({ 
        impact_score: normalizedScore,
        impact_score_details: scores
      })
      .eq('application_id', applicationId);

    if (updateError) {
      console.error('Failed to update application:', updateError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to save score' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      );
    }

    console.log('Successfully updated application with impact score');

    return new Response(
      JSON.stringify({ 
        success: true, 
        score: normalizedScore,
        details: scores
      }),
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