import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { description } = await req.json()
    
    if (!description) {
      console.error('No description provided')
      return new Response(
        JSON.stringify({ header: '' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Processing description:', description)

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('PERPLEXITY_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are a planning application expert. Create a concise 6-12 word header that captures the essence of the planning application description. Focus on the key changes or developments proposed.'
          },
          {
            role: 'user',
            content: `Create a concise header for this planning application: ${description}`
          }
        ],
        temperature: 0.2,
        max_tokens: 100
      }),
    })

    if (!response.ok) {
      console.error('API response not ok:', response.status, response.statusText)
      throw new Error(`API response not ok: ${response.status}`)
    }

    const data = await response.json()
    console.log('API response:', data)

    if (!data || !data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid API response structure:', data)
      throw new Error('Invalid API response structure')
    }

    const header = data.choices[0].message.content.trim()
    console.log('Generated header:', header)

    return new Response(
      JSON.stringify({ header }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in generate-listing-header:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})