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
  
  const { data: applications, error } = await supabase
    .from('applications')
    .select('application_id, description')
    .is('ai_title', null)
    .not('description', 'is', null)
    .limit(limit);

  if (error) {
    console.error('Error fetching applications:', error);
    throw new Error(`Error fetching applications: ${error.message}`);
  }

  console.log(`Found ${applications?.length || 0} applications to process`);
  return applications || [];
}

const generateAITitle = async (description: string): Promise<string> => {
  console.log('Generating AI title for description:', description.substring(0, 100) + '...');
  
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
    throw new Error(`API response not ok: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const title = data.choices[0].message.content.trim();
  console.log('Generated title:', title);
  return title;
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
      return new Response(
        JSON.stringify({ 
          message: 'No applications found that need AI titles',
          success: true,
          processed: 0 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const results = await Promise.all(
      applications.map(app => processApplication(supabase, app))
    );

    const successCount = results.filter(result => result).length;
    const errorCount = results.filter(result => !result).length;

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