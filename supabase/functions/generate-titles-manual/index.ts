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
    console.log('Starting generate-titles-manual function');
    
    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Parse request body
    const { limit = 50 } = await req.json()
    console.log(`Processing batch of ${limit} applications`);

    // Get applications without AI titles
    const { data: applications, error: fetchError } = await supabase
      .from('applications')
      .select('application_id, description')
      .is('ai_title', null)
      .not('description', 'is', null)
      .limit(limit)

    if (fetchError) {
      console.error('Error fetching applications:', fetchError);
      throw new Error(`Error fetching applications: ${fetchError.message}`)
    }

    if (!applications?.length) {
      console.log('No applications found that need AI titles');
      return new Response(
        JSON.stringify({ 
          message: 'No applications found that need AI titles',
          success: true,
          processed: 0 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Found ${applications.length} applications to process`);
    let successCount = 0;
    let errorCount = 0;

    // Process each application
    for (const app of applications) {
      try {
        console.log(`Processing application ${app.application_id}`);
        
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
                content: 'You are a planning application expert. Create a very concise 5-8 word header that captures the key changes proposed in the planning application description. Focus only on the main development or change.'
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
          console.error(`API response not ok for application ${app.application_id}:`, response.status, await response.text());
          throw new Error(`API response not ok: ${response.status}`)
        }

        const data = await response.json()
        const title = data.choices[0].message.content.trim()
        console.log(`Generated title for application ${app.application_id}:`, title);

        // Update the application with the AI title
        const { error: updateError } = await supabase
          .from('applications')
          .update({ ai_title: title })
          .eq('application_id', app.application_id)

        if (updateError) {
          console.error(`Error updating application ${app.application_id}:`, updateError);
          throw new Error(`Error updating application ${app.application_id}: ${updateError.message}`)
        }

        console.log(`Successfully updated application ${app.application_id}`);
        successCount++;
      } catch (error) {
        console.error(`Error processing application ${app.application_id}:`, error);
        errorCount++;
      }
    }

    // Query the database to verify results
    const { count } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .not('ai_title', 'is', null)
    
    console.log(`Total applications with AI titles: ${count}`);

    // Query recently processed applications
    const { data: recentTitles } = await supabase
      .from('applications')
      .select('application_id, ai_title')
      .not('ai_title', 'is', null)
      .order('application_id', { ascending: false })
      .limit(5)

    console.log('Recent titles generated:', recentTitles);

    return new Response(
      JSON.stringify({ 
        message: `Processed ${applications.length} applications. Success: ${successCount}, Errors: ${errorCount}`,
        success: true,
        processed: successCount,
        total_with_titles: count
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in generate-titles-manual:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})