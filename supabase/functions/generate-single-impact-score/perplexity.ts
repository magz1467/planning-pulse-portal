import { corsHeaders } from '../_shared/cors.ts';
import { ApplicationData } from './types.ts';

export async function calculateImpactScore(
  application: ApplicationData, 
  retryCount = 0
): Promise<{ score: number; details: any; impacted_services: any }> {
  console.log(`[Impact Score ${application.application_id}] Starting calculation (attempt ${retryCount + 1})`);
  
  const apiKey = Deno.env.get('PERPLEXITY_API_KEY');
  if (!apiKey) {
    throw new Error('Missing Perplexity API key');
  }

  try {
    const prompt = `
      Analyze this planning application and provide:
      1. Impact scores for each category (rate 1-5, 1=minimal impact, 5=severe impact)
      2. Assessment of impact on local services based on the application details
      
      Return a valid JSON object with no markdown formatting.
      Format: {
        "impact_scores": {
          "Environmental": {
            "air_quality": <score>,
            "noise": <score>,
            "biodiversity": <score>
          }, 
          "Social": {
            "community": <score>,
            "accessibility": <score>
          }
        },
        "impacted_services": {
          "Schools": {"impact": "<positive/negative/neutral>", "details": "<specific details based on application>"},
          "Health": {"impact": "<positive/negative/neutral>", "details": "<specific details based on application>"},
          "Transport": {"impact": "<positive/negative/neutral>", "details": "<specific details based on application>"},
          "Utilities": {"impact": "<positive/negative/neutral>", "details": "<specific details based on application>"},
          "Community": {"impact": "<positive/negative/neutral>", "details": "<specific details based on application>"}
        }
      }
      
      Application details:
      Description: ${application.description || 'N/A'}
      Type: ${application.development_type || application.application_type || 'N/A'}
      Additional details: ${JSON.stringify(application.application_details || {})}
      Status: ${application.status || 'N/A'}
      Location: ${application.site_name || ''} ${application.street_name || ''} ${application.locality || ''} ${application.postcode || ''}
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
            content: 'You are an expert in analyzing planning applications and their potential impacts. Return only a valid JSON object with numerical scores and impact assessments based on the actual application details provided. Be specific in your analysis and avoid generic responses.'
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

    const cleanContent = data.choices[0].message.content
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .trim();

    try {
      const result = JSON.parse(cleanContent);
      console.log(`[Impact Score ${application.application_id}] Parsed result:`, result);
      
      let totalScore = 0;
      let totalWeights = 0;
      
      // Calculate impact score from impact_scores
      for (const [category, subcategories] of Object.entries(result.impact_scores)) {
        for (const [subcategory, score] of Object.entries(subcategories as Record<string, number>)) {
          const weight = 1;
          totalScore += (score as number) * weight;
          totalWeights += weight;
        }
      }

      const normalizedScore = Math.round((totalScore / totalWeights) * 20);

      return {
        score: normalizedScore,
        details: result.impact_scores,
        impacted_services: result.impacted_services
      };
    } catch (parseError) {
      console.error(`[Impact Score ${application.application_id}] JSON Parse Error:`, {
        content: cleanContent,
        error: parseError.message
      });

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