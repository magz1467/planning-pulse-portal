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
            content: `You are a creative writer who makes planning applications sound exciting and relatable.
            Your task is to create catchy, engaging titles that capture attention while being informative.
            
            Rules:
            - MUST be exactly 6 words or less
            - Use active, exciting verbs
            - Focus on the positive impact
            - Make it sound aspirational
            - Avoid technical terms completely
            - Start with action words when possible
            - If it's residential, make it sound homey
            - If it's commercial, emphasize community benefit
            
            Templates to follow:
            Residential: "[Action] [Type] for [Location]"
            Commercial: "New [Business] Coming to [Location]"
            Extension: "[Direction] Extension Creates [Benefit]"
            
            Examples:
            "Cozy Family Extension in Richmond"
            "Modern Shop Transforms Local Corner"
            "Rear Extension Adds Dream Kitchen"
            "New Café Brightens High Street"`
          },
          {
            role: 'user',
            content: `Create a short, engaging 6-word title for this planning application: ${description}`
          }
        ],
        temperature: 0.7,
        max_tokens: 100
      }),
    })

    if (!response.ok) {
      console.error('API response not ok:', response.status, await response.text())
      throw new Error(`API response not ok: ${response.status}`)
    }

    const data = await response.json()
    const title = data.choices[0].message.content.trim()
    console.log('Generated title:', title)

    // Validate the title meets our requirements
    const words = title.split(' ')
    if (words.length > 6) {
      console.error('Title too long, truncating to 6 words')
      const truncatedTitle = words.slice(0, 6).join(' ')
      return new Response(
        JSON.stringify({ header: truncatedTitle }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ header: title }),
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