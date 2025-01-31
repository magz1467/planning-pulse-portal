import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting PDF URL extraction process');
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Query records that have url_documents but no pdf_urls
    const { data: records, error: queryError } = await supabase
      .from('property_data_api')
      .select('id, url_documents')
      .is('pdf_urls', null)
      .not('url_documents', 'is', null)
      .limit(5); // Process in small batches

    if (queryError) {
      console.error('Error querying records:', queryError);
      throw queryError;
    }

    if (!records || records.length === 0) {
      console.log('No records to process');
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

    console.log(`Processing ${records.length} records`);
    let processed = 0;
    let failed = 0;

    for (const record of records) {
      try {
        if (!record.url_documents) continue;

        const urls = await extractPdfUrls(record.url_documents);
        
        const { error: updateError } = await supabase
          .from('property_data_api')
          .update({ pdf_urls: urls })
          .eq('id', record.id);

        if (updateError) {
          console.error(`Error updating record ${record.id}:`, updateError);
          failed++;
        } else {
          processed++;
          console.log(`Successfully processed record ${record.id}`);
          
          // Trigger PDF rehosting for this record
          try {
            const { data: rehostData, error: rehostError } = await supabase.functions.invoke('rehost-pdfs', {
              method: 'POST',
              body: { limit: 1 }  // Process one record at a time
            });
            
            if (rehostError) {
              console.error(`Error triggering rehost for record ${record.id}:`, rehostError);
            } else {
              console.log(`Successfully triggered rehosting for record ${record.id}:`, rehostData);
            }
          } catch (rehostError) {
            console.error(`Failed to trigger rehosting for record ${record.id}:`, rehostError);
          }
        }
      } catch (error) {
        console.error(`Error processing record ${record.id}:`, error);
        failed++;
      }
    }

    return new Response(
      JSON.stringify({
        message: `Processed ${processed} records${failed > 0 ? `, failed: ${failed}` : ''}`,
        processed,
        failed
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in extract-pdf-urls function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
})

async function extractPdfUrls(url: string): Promise<string[]> {
  try {
    console.log(`Fetching ${url}`);
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    
    // Use regex to find PDF links in the HTML
    const pdfRegex = /href=["']((?:[^"']*\.pdf|[^"']*\/pdf\/[^"']*|[^"']*document\.ashx[^"']*))/gi;
    const matches = [...html.matchAll(pdfRegex)];
    const pdfUrls = matches.map(match => {
      const href = match[1];
      try {
        // Try to construct a full URL
        return new URL(href, url).href;
      } catch {
        // If URL construction fails, return the original href
        return href;
      }
    });
    
    // Remove duplicates and filter out invalid URLs
    const uniquePdfUrls = [...new Set(pdfUrls)].filter(url => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    });

    console.log(`Found ${uniquePdfUrls.length} PDF URLs`);
    return uniquePdfUrls;
    
  } catch (error) {
    console.error(`Error extracting PDFs from ${url}:`, error);
    return []; // Return empty array instead of throwing
  }
}