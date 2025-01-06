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
      
      // Calculate weighted average for each category first
      const categoryScores: Record<string, number> = {};
      const weights = {
        'Environmental': 0.4,  // 40% weight
        'Social': 0.35,       // 35% weight
        'Infrastructure': 0.25 // 25% weight
      };
      
      let totalWeightedScore = 0;
      let totalWeightsApplied = 0;

      // Calculate each category's score and overall weighted score
      for (const [category, subcategories] of Object.entries(scores)) {
        let categoryTotal = 0;
        let count = 0;
        
        for (const score of Object.values(subcategories as Record<string, number>)) {
          categoryTotal += score as number;
          count++;
        }
        
        const categoryScore = Math.round((categoryTotal / count) * 20); // Convert to /100 scale
        categoryScores[category] = categoryScore;
        
        const weight = weights[category as keyof typeof weights] || 0.33;
        totalWeightedScore += categoryScore * weight;
        totalWeightsApplied += weight;
      }

      // Calculate final weighted average
      const normalizedScore = Math.round(totalWeightedScore / totalWeightsApplied);

      // Prepare the details object with the calculated scores
      const details = {
        category_scores: {
          environmental: {
            score: categoryScores['Environmental'] || 0,
            details: "Impact on local environment including air quality, noise, and natural resources"
          },
          social: {
            score: categoryScores['Social'] || 0,
            details: "Impact on local community, amenities, and social fabric"
          },
          infrastructure: {
            score: categoryScores['Infrastructure'] || 0,
            details: "Impact on local infrastructure, transport, and utilities"
          }
        },
        key_concerns: [
          "Environmental sustainability and resource management",
          "Community integration and social cohesion",
          "Infrastructure capacity and accessibility"
        ],
        recommendations: [
          "Consider implementing additional environmental mitigation measures",
          "Engage with local community for feedback and improvements",
          "Assess and plan for infrastructure requirements"
        ]
      };

      return {
        score: normalizedScore,
        details: details
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