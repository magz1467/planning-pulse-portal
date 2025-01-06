import { PerplexityResponse } from './types';

const PERPLEXITY_API_KEY = Deno.env.get('PERPLEXITY_API_KEY');

if (!PERPLEXITY_API_KEY) {
  throw new Error('Missing PERPLEXITY_API_KEY environment variable');
}

export async function generateImpactScore(description: string): Promise<PerplexityResponse> {
  console.log('Generating impact score for description:', description);

  const prompt = `You are an expert urban planner and environmental impact assessor. 
  Analyze the following planning application description and provide a numerical impact score from 1-100, 
  where 1 represents minimal impact and 100 represents maximum impact on the local area.
  
  Consider factors such as:
  - Environmental impact (trees, wildlife, green space)
  - Visual impact on streetscape
  - Traffic and parking implications  
  - Noise and disruption during construction
  - Impact on local infrastructure and services
  - Scale relative to surrounding buildings
  - Heritage and conservation considerations
  
  Provide your assessment in JSON format with:
  - overall_score: number between 1-100
  - category_scores: object with scores for each impact category
  - key_concerns: array of main impact points
  - recommendations: array of mitigation suggestions
  
  Planning application: "${description}"`;

  try {
    console.log('Sending request to Perplexity API');
    
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'pplx-7b-chat',
        messages: [{
          role: 'system',
          content: 'You are an expert urban planner and environmental impact assessor.'
        }, {
          role: 'user',
          content: prompt
        }],
        temperature: 0.4,
        max_tokens: 1000,
        top_p: 0.9,
        presence_penalty: 0.6
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Perplexity API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Received response from Perplexity API:', data);

    try {
      // Extract the JSON from the response text
      const jsonMatch = data.choices[0].message.content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      const parsedResponse = JSON.parse(jsonMatch[0]);
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