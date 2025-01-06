import { ApplicationData } from './types.ts';

export async function generateImpactAnalysis(
  application: ApplicationData,
  perplexityKey: string
): Promise<Record<string, any>> {
  const prompt = `
    Analyze this planning application's potential impacts in detail. 
    Rate each subcategory from 1-5 (1=minimal impact, 5=severe impact).
    Consider carefully how this specific application differs from typical cases.
    Pay special attention to:
    - Scale and intensity of the development
    - Proximity to sensitive areas
    - Cumulative effects
    - Long-term implications
    - Unique characteristics
    
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

  try {
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
            content: 'You are an expert planning impact assessor. Analyze applications with high attention to detail, looking for subtle differences that could affect impact scores. Be precise and thorough in your scoring, using the full range from 1-5. Ensure scores reflect meaningful differences between applications.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.4, // Lowered for more consistent but still varied responses
        max_tokens: 1000,
        top_p: 0.9,
        presence_penalty: 0.6, // Added to encourage more diverse responses
        frequency_penalty: 0.3 // Added to discourage repetitive scoring patterns
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Perplexity API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Perplexity API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Perplexity API Response:', data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid API response format');
    }

    // Remove any markdown formatting and ensure we have clean JSON
    const content = data.choices[0].message.content
      .replace(/```json\n|\n```/g, '')
      .replace(/```/g, '')
      .trim();

    try {
      const parsedContent = JSON.parse(content);
      console.log('Parsed impact analysis:', parsedContent);
      return parsedContent;
    } catch (parseError) {
      console.error('Failed to parse Perplexity response:', content);
      throw new Error(`Failed to parse impact analysis response: ${parseError.message}`);
    }
  } catch (error) {
    console.error('Error in generateImpactAnalysis:', error);
    throw error;
  }
}