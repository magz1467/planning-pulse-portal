import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { corsHeaders } from '../_shared/cors.ts'

interface ApplicationData {
  application_id: number;
  description: string;
  development_type: string;
  application_type: string;
  application_details: any;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { applicationId } = await req.json()
    
    if (!applicationId) {
      console.error('Missing applicationId in request')
      throw new Error('Application ID is required')
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const perplexityKey = Deno.env.get('PERPLEXITY_API_KEY')!
    
    if (!perplexityKey) {
      console.error('Missing Perplexity API key in environment')
      throw new Error('Missing Perplexity API key')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log(`Fetching application details for ID: ${applicationId}`)
    
    // Get application details
    const { data: application, error: fetchError } = await supabase
      .from('applications')
      .select('*')
      .eq('application_id', applicationId)
      .single()

    if (fetchError || !application) {
      console.error('Error fetching application:', fetchError)
      throw new Error('Application not found')
    }

    console.log('Generating prompt for application')
    
    // Generate the prompt
    const prompt = `
      Analyze this planning application and provide impact scores for each category. 
      Rate each subcategory from 1-5 (1=minimal impact, 5=severe impact).
      Return a valid JSON object with no markdown formatting.
      Format: {"Environmental": {"air_quality": 3, "noise": 2}, "Social": {"community": 4}}
      
      Application details:
      Description: ${application.description || 'N/A'}
      Type: ${application.development_type || application.application_type || 'N/A'}
      Additional details: ${JSON.stringify(application.application_details || {})}
    `

    console.log('Calling Perplexity API')
    
    // Call Perplexity API
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
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Perplexity API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      })
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    console.log('Received API response:', data)
    
    if (!data.choices?.[0]?.message?.content) {
      console.error('Invalid API response format:', data)
      throw new Error('Invalid API response format')
    }

    const scores = JSON.parse(data.choices[0].message.content)
    console.log('Parsed impact scores:', scores)

    // Calculate normalized score
    let totalScore = 0
    let totalWeights = 0

    for (const [category, subcategories] of Object.entries(scores)) {
      for (const [subcategory, score] of Object.entries(subcategories as Record<string, number>)) {
        const weight = 1
        totalScore += (score as number) * weight
        totalWeights += weight
      }
    }

    const normalizedScore = Math.round((totalScore / totalWeights) * 20)
    console.log('Calculated normalized score:', normalizedScore)

    // Update application with score
    const { error: updateError } = await supabase
      .from('applications')
      .update({ 
        impact_score: normalizedScore,
        impact_score_details: scores
      })
      .eq('application_id', applicationId)

    if (updateError) {
      console.error('Failed to update application:', updateError)
      throw new Error('Failed to update application')
    }

    console.log('Successfully updated application with impact score')

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
        } 
      }
    )

  } catch (error) {
    console.error('Error in generate-single-impact-score:', error)
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
        status: 400
      }
    )
  }
})