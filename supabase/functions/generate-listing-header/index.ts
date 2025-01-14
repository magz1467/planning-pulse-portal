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
            
            STRICT RULES - ALL MUST BE FOLLOWED:
            - MUST be exactly 6 words or less
            - MUST use one of the templates below
            - MUST use active, exciting verbs (e.g. "transforms", "creates", "brings")
            - MUST focus on positive community impact
            - MUST avoid technical terms completely
            - MUST start with action words
            - MUST be in Title Case (not ALL CAPS)
            - If residential, MUST sound homey and welcoming
            - If commercial, MUST emphasize community benefit
            
            STRICT TEMPLATES TO USE:
            Residential MUST use: "[Action] [Type] [Brings/Creates] [Benefit] in [Location]"
            Commercial MUST use: "New [Business] [Brings/Creates] [Benefit] to [Location]"
            Extension MUST use: "[Direction] Extension [Creates/Adds] [Benefit]"
            
            EXAMPLES OF GOOD TITLES:
            "Modern Homes Create Community in Richmond"
            "New Café Brings Life to High Street"
            "Rear Extension Adds Dream Kitchen Space"
            "Cozy Cottages Transform Local Neighborhood"
            "Family Homes Build Community in Chelsea"
            
            For solar panels and sustainable projects use:
            "Green Energy Brings Sustainability to [Location]"
            "Solar Power Creates Clean Future Here"`
          },
          {
            role: 'user',
            content: `Create a short, engaging title (max 6 words) following the strict templates above for this planning application: ${description}. This is about solar panels, so focus on sustainability and green energy benefits.`
          }
        ],
        temperature: 0.3, // Reduced temperature for more consistent outputs
        max_tokens: 100
      }),
    })

    if (!response.ok) {
      console.error('API response not ok:', response.status, await response.text())
      throw new Error(`API response not ok: ${response.status}`)
    }

    const data = await response.json()
    let title = data.choices[0].message.content.trim()
    console.log('Generated title:', title)

    // Transform text case if needed
    const isAllCaps = (str: string) => str === str.toUpperCase() && str !== str.toLowerCase();
    
    if (isAllCaps(title)) {
      // Split into words and transform each
      title = title.split(' ').map(word => {
        // Skip short words that might be acronyms (like UK, US, etc)
        if (word.length <= 3) return word;
        
        // Transform the word to title case
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }).join(' ');
    }

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