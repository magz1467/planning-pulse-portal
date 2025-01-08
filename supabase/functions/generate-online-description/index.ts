import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const PERPLEXITY_API_KEY = Deno.env.get('PERPLEXITY_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

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
    const { batch_size = 10 } = await req.json()
    console.log('Processing batch size:', batch_size)

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

    // Get applications that don't have AI search details yet
    const { data: applications, error: fetchError } = await supabase
      .from('applications')
      .select('application_id, url_planning_app, description')
      .is('ai_search_details', null)
      .limit(batch_size)

    if (fetchError) {
      console.error('Error fetching applications:', fetchError)
      throw new Error('Failed to fetch applications')
    }

    if (!applications || applications.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No applications need processing',
          processed: 0 
        }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json'
          } 
        }
      )
    }

    console.log(`Processing ${applications.length} applications`)
    let success = 0

    for (const app of applications) {
      try {
        if (!app.url_planning_app) {
          console.log(`Skipping application ${app.application_id} - no URL`)
          continue
        }

        // Construct search prompt
        const searchPrompt = `Search for planning application with reference number for this URL: ${app.url_planning_app}
        
        Please provide:
        1. A comprehensive description of the development proposal
        2. Any key planning considerations mentioned
        3. Details about consultations and public feedback if available
        4. Environmental impact considerations
        5. Any conditions or obligations mentioned
        
        Format the response as a detailed narrative, focusing on the full scope and implications of the development.
        If you can't find specific information, indicate what is not available.
        
        Original description for reference: ${app.description}`

        console.log('Sending request to Perplexity API for application:', app.application_id)
        
        const response = await fetch('https://api.perplexity.ai/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.1-sonar-small-128k-online',
            messages: [
              {
                role: 'system',
                content: 'You are a planning application research assistant. Search for and analyze planning applications, providing detailed information in a clear, structured format.'
              },
              {
                role: 'user',
                content: searchPrompt
              }
            ],
            temperature: 0.2,
            max_tokens: 2000,
          }),
        })

        if (!response.ok) {
          throw new Error(`Perplexity API request failed: ${response.statusText}`)
        }

        const data = await response.json()
        const searchResult = data.choices[0].message.content

        // Update the application with the search results
        const { error: updateError } = await supabase
          .from('applications')
          .update({
            ai_search_details: {
              full_description: searchResult,
              generated_at: new Date().toISOString(),
              source_url: app.url_planning_app
            }
          })
          .eq('application_id', app.application_id)

        if (updateError) {
          console.error('Error updating application:', updateError)
          throw new Error('Failed to update application with search results')
        }

        success++
        console.log(`Successfully processed application ${app.application_id}`)

      } catch (error) {
        console.error(`Error processing application ${app.application_id}:`, error)
        // Continue with next application instead of failing the whole batch
        continue
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully processed ${success} applications`,
        processed: success
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})