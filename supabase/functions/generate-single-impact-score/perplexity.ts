import { ApplicationData } from './types.ts';

export async function generateImpactAnalysis(
  application: ApplicationData,
  perplexityKey: string
): Promise<Record<string, any>> {
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

  console.log('Calling Perplexity API with context:', {
    applicationId: application.application_id,
    type: application.development_type || application.application_type
  });

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
      temperature: 0.7,
      max_tokens: 1000
    }),
  });

  if (!response.ok) {
    throw new Error(`Perplexity API error: ${response.status}`);
  }

  const data = await response.json();
  if (!data.choices?.[0]?.message?.content) {
    throw new Error('Invalid API response format');
  }

  // Remove any markdown formatting that might be present
  const content = data.choices[0].message.content
    .replace(/```json\n|\n```/g, '')
    .replace(/```/g, '')
    .trim();

  return JSON.parse(content);
}