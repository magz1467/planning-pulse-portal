import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Application {
  application_id: number;
  description: string;
  status: string;
}

const createSupabaseClient = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    }
  );
}

const fetchApplications = async (supabase: any, limit: number): Promise<Application[]> => {
  console.log(`Fetching up to ${limit} applications without AI titles...`);
  
  // First fetch applications under consideration
  const { data: priorityApps, error: priorityError } = await supabase
    .from('applications')
    .select('application_id, description, status')
    .is('ai_title', null)
    .not('description', 'is', null)
    .eq('status', 'application under consideration')
    .limit(limit);

  if (priorityError) {
    console.error('Error fetching priority applications:', priorityError);
    throw new Error(`Error fetching priority applications: ${priorityError.message}`);
  }

  console.log(`Found ${priorityApps?.length || 0} priority applications under consideration`);

  const remainingLimit = limit - (priorityApps?.length || 0);
  
  // If we still have room in our limit, fetch other applications
  if (remainingLimit > 0) {
    console.log(`Fetching ${remainingLimit} additional non-priority applications...`);
    const { data: otherApps, error: otherError } = await supabase
      .from('applications')
      .select('application_id, description, status')
      .is('ai_title', null)
      .not('description', 'is', null)
      .neq('status', 'application under consideration')
      .limit(remainingLimit);

    if (otherError) {
      console.error('Error fetching other applications:', otherError);
      throw new Error(`Error fetching other applications: ${otherError.message}`);
    }

    console.log(`Found ${otherApps?.length || 0} additional non-priority applications`);
    return [...(priorityApps || []), ...(otherApps || [])];
  }

  return priorityApps || [];
}

const generateAITitle = async (description: string): Promise<string> => {
  console.log('Generating AI title for description:', description.substring(0, 100) + '...');
  
  try {
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
    });

    if (!response.ok) {
      console.error(`API response not ok: ${response.status}`, await response.text());
      throw new Error(`API response not ok: ${response.status}`);
    }

    const data = await response.json();
    const title = data.choices[0].message.content.trim();
    console.log('Generated title:', title);
    return title;
  } catch (error) {
    console.error('Error generating AI title:', error);
    throw error;
  }
}

const updateApplicationTitle = async (supabase: any, applicationId: number, title: string): Promise<void> => {
  console.log(`Updating application ${applicationId} with title: ${title}`);
  
  const { error } = await supabase
    .from('applications')
    .update({ ai_title: title })
    .eq('application_id', applicationId);

  if (error) {
    console.error(`Error updating application ${applicationId}:`, error);
    throw new Error(`Error updating application ${applicationId}: ${error.message}`);
  }

  console.log(`Successfully updated application ${applicationId}`);
}

const processApplication = async (supabase: any, app: Application): Promise<boolean> => {
  try {
    if (!app.description) {
      console.log(`Skipping application ${app.application_id} - No description available`);
      return false;
    }

    console.log(`Processing application ${app.application_id} with status: ${app.status}`);
    const title = await generateAITitle(app.description);
    await updateApplicationTitle(supabase, app.application_id, title);
    return true;
  } catch (error) {
    console.error(`Error processing application ${app.application_id}:`, error);
    return false;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createSupabaseClient();
    const { limit = 50 } = await req.json();
    
    console.log(`Starting batch processing with limit: ${limit}`);
    
    const applications = await fetchApplications(supabase, limit);
    
    if (applications.length === 0) {
      console.log('No applications found that need AI titles');
      return new Response(
        JSON.stringify({ 
          message: 'No applications found that need AI titles',
          success: true,
          processed: 0 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${applications.length} total applications to process`);
    const results = await Promise.all(
      applications.map(app => processApplication(supabase, app))
    );

    const successCount = results.filter(result => result).length;
    const errorCount = results.filter(result => !result).length;

    console.log(`Processing complete. Successes: ${successCount}, Errors: ${errorCount}`);

    return new Response(
      JSON.stringify({ 
        message: `Processed ${applications.length} applications. Success: ${successCount}, Errors: ${errorCount}`,
        success: true,
        processed: successCount
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-titles-manual:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});