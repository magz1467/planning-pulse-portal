import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { bbox } = await req.json()
    const apiKey = Deno.env.get('SEARCHLAND_API_KEY')

    if (!apiKey) {
      console.error('Searchland API key not found in environment variables')
      throw new Error('Searchland API key not found')
    }

    if (!bbox) {
      console.error('Missing bbox parameter in request body')
      throw new Error('Missing bbox parameter')
    }

    console.log('Fetching Searchland data with bbox:', bbox)
    console.log('API Key exists:', !!apiKey)
    console.log('API Key length:', apiKey.length)
    console.log('First 4 chars of API key:', apiKey.substring(0, 4))

    const url = 'https://api.searchland.co.uk/v1/planning_applications/search'
    console.log('Request URL:', url)

    const requestBody = {
      bbox: bbox,
      limit: 100
    }
    console.log('Request body:', JSON.stringify(requestBody))

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })

    console.log('Searchland API response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Searchland API error response:', errorText)
      console.error('Response headers:', Object.fromEntries(response.headers.entries()))
      throw new Error(`Searchland API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log(`Received ${data.features?.length || 0} applications from Searchland`)

    return new Response(
      JSON.stringify({ applications: data.features }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )

  } catch (error) {
    console.error('Error in fetch-searchland-data:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        context: 'Failed to fetch or process Searchland data'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json'}
      }
    )
  }
})