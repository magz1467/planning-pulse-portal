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
  
  if (applicationId) {
    await supabase
      .from('property_data_api')
      .update({
        error_message: error.toString()
      })
      .eq('id', applicationId);
  }
}

async function processRecord(record: any) {
  try {
    console.log('Processing record:', record);

    if (!record?.url) {
      throw new Error('Missing URL in record');
    }

    const transformedUrl = transformUrl(record.url);
    if (!transformedUrl) {
      throw new Error('URL transformation failed');
    }

    console.log('Transformed URL:', transformedUrl);

    // Update database
    const { error: updateError } = await supabase
      .from('property_data_api')
      .update({ url_documents: transformedUrl })
      .eq('id', record.id);

    if (updateError) {
      throw updateError;
    }

    // Verify URL accessibility
    const testResponse = await fetch(transformedUrl);
    if (!testResponse.ok) {
      throw new Error(`URL verification failed: ${testResponse.status}`);
    }

    return {
      success: true,
      original_url: record.url,
      transformed_url: transformedUrl
    };
  } catch (error) {
    await logError(record?.id || null, record?.url || null, null, error);
    return {
      success: false,
      error: error.message,
      record_id: record?.id
    };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting documentation analysis...');
    
    const { limit = 10 } = await req.json();
    
    // Get latest records
    const { data, error } = await supabase
      .from('property_data_api')
      .select('id, url')
      .is('url_documents', null)  // Only get records that haven't been processed
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching URLs:', error);
      throw error;
    }

    if (!data?.length) {
      return new Response(
        JSON.stringify({ 
          message: 'No records to process',
          processed: 0
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing ${data.length} records...`);

    // Process all records in parallel
    const results = await Promise.all(data.map(processRecord));

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    console.log('Processing complete:', { successful, failed });

    return new Response(
      JSON.stringify({ 
        message: `Successfully processed ${successful} records, ${failed} failed`,
        processed: successful,
        failed,
        results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in documentation analysis:', error);
    
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