import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function extractPdfUrls(url: string): Promise<string[]> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      console.error(`Failed to fetch URL ${url}: ${response.statusText}`);
      return [];
    }

    const html = await response.text();
    
    // Match both relative and absolute PDF URLs
    const pdfRegex = /href=["']((?:https?:\/\/[^"']+\.pdf|[^"']+\.pdf))["']/gi;
    const matches = html.matchAll(pdfRegex);
    const pdfUrls = new Set<string>();

    for (const match of matches) {
      let pdfUrl = match[1];
      
      // Convert relative URLs to absolute
      if (!pdfUrl.startsWith('http')) {
        const baseUrl = new URL(url);
        pdfUrl = new URL(pdfUrl, baseUrl.origin).href;
      }
      
      pdfUrls.add(pdfUrl);
    }

    return Array.from(pdfUrls);
  } catch (error) {
    console.error(`Error extracting PDFs from ${url}:`, error);
    return [];
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get records that have url_documents but no pdf_urls
    const { data: records, error: fetchError } = await supabase
      .from('property_data_api')
      .select('id, url_documents')
      .is('pdf_urls', null)
      .not('url_documents', 'is', null)
      .limit(50)  // Process in batches

    if (fetchError) {
      console.error('Error fetching records:', fetchError)
      throw fetchError
    }

    console.log(`Processing ${records?.length || 0} records`)

    let processed = 0
    let failed = 0

    if (records && records.length > 0) {
      for (const record of records) {
        try {
          if (!record.url_documents) {
            console.log(`Skipping record ${record.id} - no url_documents`)
            continue
          }

          const pdfUrls = await extractPdfUrls(record.url_documents)
          
          const { error: updateError } = await supabase
            .from('property_data_api')
            .update({ pdf_urls: pdfUrls })
            .eq('id', record.id)

          if (updateError) {
            console.error(`Error updating record ${record.id}:`, updateError)
            failed++
          } else {
            processed++
            console.log(`Successfully processed record ${record.id}`)
          }
        } catch (error) {
          console.error(`Error processing record ${record.id}:`, error)
          failed++
        }
      }
    }

    return new Response(
      JSON.stringify({
        processed,
        failed,
        message: `Successfully processed ${processed} records. Failed to process ${failed} records.`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in extract-pdf-urls function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})