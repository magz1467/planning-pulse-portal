import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

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
    // Create Supabase client with service role key to bypass RLS
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      }
    )

    // Get the requested limit from the request body
    const { limit = 50 } = await req.json();
    
    console.log(`Starting batch processing with limit: ${limit}`);
    
    // Get applications without AI titles
    const { data: applications, error: fetchError } = await supabase
      .from('applications')
      .select('*')  // Select all fields to preserve data
      .is('ai_title', null)
      .not('description', 'is', null)
      .limit(limit)

    if (fetchError) {
      throw new Error(`Error fetching applications: ${fetchError.message}`)
    }

    console.log(`Found ${applications?.length || 0} applications without AI titles`);

    // Process each application
    let successCount = 0;
    let errorCount = 0;
    
    if (!applications || applications.length === 0) {
      return new Response(
        JSON.stringify({ 
          message: 'No applications found that need AI titles',
          success: true,
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

    for (const app of applications) {
      try {
        console.log(`Processing application ${app.application_id} - Description length: ${app.description?.length || 0} chars`);
        
        if (!app.description) {
          console.log(`Skipping application ${app.application_id} - No description available`);
          errorCount++;
          continue;
        }

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
                content: `Create a concise header for this planning application: ${app.description}`
              }
            ],
            temperature: 0.2,
            max_tokens: 100
          }),
        })

        if (!response.ok) {
          throw new Error(`API response not ok: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        const title = data.choices[0].message.content.trim()
        console.log(`Generated title for ${app.application_id}: ${title}`);

        // Update only the ai_title field while preserving all other data
        const { error: updateError } = await supabase
          .from('applications')
          .update({ ai_title: title })
          .eq('application_id', app.application_id)

        if (updateError) {
          console.error(`Error updating application ${app.application_id}:`, updateError)
          throw new Error(`Error updating application ${app.application_id}: ${updateError.message}`)
        }

        console.log(`Successfully updated application ${app.application_id}`);
        successCount++;
      } catch (error) {
        console.error(`Error processing application ${app.application_id}:`, error)
        errorCount++;
      }
    }

    return new Response(
      JSON.stringify({ 
        message: `Processed ${applications.length} applications. Success: ${successCount}, Errors: ${errorCount}`,
        success: true,
        processed: successCount
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error in generate-titles-manual:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
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