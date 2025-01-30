import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting documentation analysis...');
    
    let body;
    try {
      body = await req.json();
    } catch (e) {
      console.error('Error parsing request body:', e);
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const { limit = 10 } = body;
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get records that need processing
    const { data: records, error: fetchError } = await supabase
      .from('property_data_api')
      .select('id, url')
      .is('url_documents', null)
      .limit(limit);

    if (fetchError) {
      console.error('Error fetching records:', fetchError);
      throw fetchError;
    }

    if (!records?.length) {
      return new Response(
        JSON.stringify({ 
          message: 'No records to process',
          processed: 0
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Processing ${records.length} records...`);

    // Process records in parallel
    const results = await Promise.all(records.map(async (record) => {
      try {
        if (!record?.url) {
          throw new Error('Missing URL in record');
        }

        const transformedUrl = transformUrl(record.url);
        if (!transformedUrl) {
          throw new Error('URL transformation failed');
        }

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
        console.error('Error processing record:', error);
        return {
          success: false,
          error: error.message,
          record_id: record?.id
        };
      }
    }));

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
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
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

function transformUrl(originalUrl: string): string | null {
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
}