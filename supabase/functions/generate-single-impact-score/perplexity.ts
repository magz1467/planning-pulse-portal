import { ImpactScoreResponse } from "./types.ts";

export async function generateImpactScore(description: string): Promise<ImpactScoreResponse> {
  console.log('Generating impact score for description:', description);

  const prompt = `Analyze the following planning application description and provide an impact assessment in JSON format only. Return a valid JSON object with this exact structure:
  {
    "overall_score": <number between 1-100>,
    "category_scores": {
      "environmental": {
        "score": <number between 1-100>,
        "details": "<brief explanation>"
      },
      "social": {
        "score": <number between 1-100>,
        "details": "<brief explanation>"
      },
      "infrastructure": {
        "score": <number between 1-100>,
        "details": "<brief explanation>"
      }
    },
    "key_concerns": ["<concern 1>", "<concern 2>"],
    "recommendations": ["<recommendation 1>", "<recommendation 2>"]
  }

  Planning application: "${description}"`;

  try {
    console.log('Sending request to Perplexity API');
    
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('PERPLEXITY_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [{
          role: 'system',
          content: 'You are a planning application impact assessor. Respond with a raw JSON object only, no markdown formatting or additional text.'
        }, {
          role: 'user',
          content: prompt
        }],
        temperature: 0.1,
        max_tokens: 1000,
        top_p: 0.9,
        presence_penalty: 0.1
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Perplexity API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Received response from Perplexity API:', data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from Perplexity API');
    }

    try {
      const content = data.choices[0].message.content;
      console.log('Raw content:', content);
      
      // Remove any markdown formatting if present
      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
      console.log('Cleaned content:', cleanContent);
      
      const parsedResponse = JSON.parse(cleanContent);
      console.log('Parsed response:', parsedResponse);
      
      return {
        success: true,
        data: parsedResponse
      };
    } catch (parseError) {
      console.error('Error parsing response:', parseError);
      throw new Error(`Failed to parse API response: ${parseError.message}`);
    }

  } catch (error) {
    console.error('Error calling Perplexity API:', error);
    return {
      success: false,
      error: error.message
    };
  }
}