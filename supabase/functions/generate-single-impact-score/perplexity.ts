import { corsHeaders } from '../_shared/cors.ts';
import { ApplicationData } from './types.ts';

export async function calculateImpactScore(
  application: ApplicationData, 
  retryCount = 0
): Promise<{ score: number; details: any }> {
  console.log(`[Impact Score ${application.application_id}] Starting calculation (attempt ${retryCount + 1})`);
  
  const apiKey = Deno.env.get('PERPLEXITY_API_KEY');
  if (!apiKey) {
    throw new Error('Missing Perplexity API key');
  }

  try {
    // Enhanced prompt to generate more specific analysis
    const prompt = `
      Analyze this specific planning application and provide a detailed impact assessment.
      Consider the exact details, scale, and context of this development.
      
      Application details to analyze:
      Description: ${application.description || 'N/A'}
      Type: ${application.development_type || application.application_type || 'N/A'}
      Status: ${application.status || 'N/A'}
      Location: ${application.site_name || ''} ${application.street_name || ''} ${application.locality || ''} ${application.postcode || ''}
      Additional details: ${JSON.stringify(application.application_details || {})}
      
      Provide a detailed analysis in JSON format with:
      1. Specific impact scores (1-5) for each category based on this exact development
      2. Detailed explanations referencing specific aspects of this development
      3. Key concerns unique to this application
      4. Tailored recommendations addressing the specific challenges
      
      Return a valid JSON object with no markdown formatting:
      {
        "category_scores": {
          "environmental": {
            "score": number,
            "details": "Specific analysis referencing the development details"
          },
          "social": {
            "score": number,
            "details": "Specific analysis referencing the development details"
          },
          "infrastructure": {
            "score": number,
            "details": "Specific analysis referencing the development details"
          }
        },
        "key_concerns": [
          "Specific concern 1 referencing development details",
          "Specific concern 2 referencing development details",
          "Specific concern 3 referencing development details"
        ],
        "recommendations": [
          "Specific recommendation 1 addressing development details",
          "Specific recommendation 2 addressing development details",
          "Specific recommendation 3 addressing development details"
        ]
      }
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
            content: 'You are an expert urban planner and environmental impact assessor. Provide detailed, specific analysis referencing the exact details of each planning application. Avoid generic responses.'
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
      const scores = JSON.parse(cleanContent);
      console.log(`[Impact Score ${application.application_id}] Parsed scores:`, scores);
      
      // Calculate weighted average for final score
      const weights = {
        'environmental': 0.35,
        'social': 0.40,
        'infrastructure': 0.25
      };
      
      let totalScore = 0;
      let totalWeights = 0;

      Object.entries(scores.category_scores).forEach(([category, data]: [string, any]) => {
        const weight = weights[category as keyof typeof weights] || 0.33;
        totalScore += data.score * weight * 20; // Convert 1-5 scale to 0-100
        totalWeights += weight;
      });

      const normalizedScore = Math.round(totalScore / totalWeights);

      return {
        score: normalizedScore,
        details: scores
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