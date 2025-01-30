import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

const transformUrl = (originalUrl: string): string | null => {
  try {
    const url = new URL(originalUrl);
    const transformations = [
      // Path-based transformation
      { pattern: /\/summary(\/|$)/, replacement: '/documents$1' },
      // Query parameter transformation
      { pattern: /([?&])view=summary/, replacement: '$1view=documents' },
      // Hash fragment transformation
      { pattern: /#summary$/, replacement: '#documents' },
      // Common parameter pattern
      { pattern: /=summary(&|$)/, replacement: '=documents$1' }
    ];

    let transformed = originalUrl;
    for (const { pattern, replacement } of transformations) {
      transformed = transformed.replace(pattern, replacement);
    }

    // Fallback for unhandled patterns
    if (transformed === originalUrl) {
      return url.pathname.endsWith('/summary') 
        ? originalUrl.replace(/\/summary$/, '/documents')
        : `${originalUrl}/documents`;
    }

    return transformed;
  } catch {
    return null;
  }
};

async function logError(applicationId: number | null, originalUrl: string | null, transformedUrl: string | null, error: any) {
  console.error('Logging error:', { applicationId, originalUrl, transformedUrl, error });
  
  await supabase
    .from('property_data_api')
    .update({
      error_message: error.toString()
    })
    .eq('id', applicationId);
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting documentation analysis...');
    
    // Get latest record
    const { data, error } = await supabase
      .from('property_data_api')
      .select('id, url')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data?.url) {
      console.error('Error fetching URL:', error);
      throw new Error('Missing URL in record');
    }

    console.log('Found record:', data);

    // Transform URL
    const transformedUrl = transformUrl(data.url);
    if (!transformedUrl) {
      console.error('URL transformation failed for:', data.url);
      throw new Error('URL transformation failed');
    }

    console.log('Transformed URL:', transformedUrl);

    // Update database
    const { error: updateError } = await supabase
      .from('property_data_api')
      .update({ url_documents: transformedUrl })
      .eq('id', data.id);

    if (updateError) {
      console.error('Error updating record:', updateError);
      throw updateError;
    }

    // Verify URL accessibility
    const testResponse = await fetch(transformedUrl);
    if (!testResponse.ok) {
      console.error('URL verification failed:', testResponse.status);
      await logError(data.id, data.url, transformedUrl, testResponse.status);
      throw new Error(`URL verification failed: ${testResponse.status}`);
    }

    console.log('Successfully processed URL');

    return new Response(
      JSON.stringify({ 
        success: true,
        original_url: data.url,
        transformed_url: transformedUrl
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in documentation analysis:', error);
    
    await logError(
      data?.id || null, 
      data?.url || null, 
      transformedUrl || null, 
      error.message
    );
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack 
      }), 
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});