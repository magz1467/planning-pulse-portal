import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import puppeteer from 'https://deno.land/x/puppeteer@16.2.0/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PropertyData {
  id: number;
  url_documents: string;
  pdf_urls: string[] | null;
}

async function extractPdfUrls(url: string): Promise<string[]> {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  try {
    console.log(`Navigating to ${url}`);
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
    
    // Get all links on the page
    const links = await page.evaluate(() => {
      const anchors = document.querySelectorAll('a');
      return Array.from(anchors).map(a => a.href);
    });
    
    // Filter for PDF links
    const pdfUrls = links.filter(link => 
      link.toLowerCase().endsWith('.pdf') || 
      link.toLowerCase().includes('/pdf/') ||
      link.toLowerCase().includes('document.ashx')
    );
    
    console.log(`Found ${pdfUrls.length} PDF URLs`);
    return pdfUrls;
    
  } catch (error) {
    console.error(`Error extracting PDFs from ${url}:`, error);
    throw error;
  } finally {
    await browser.close();
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get records that need processing
    const { data: records, error: fetchError } = await supabaseClient
      .from('property_data_api')
      .select('id, url_documents')
      .is('pdf_urls', null)
      .not('url_documents', 'is', null)
      .limit(5); // Process in small batches

    if (fetchError) {
      throw fetchError;
    }

    if (!records || records.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No records to process' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing ${records.length} records`);
    let processed = 0;
    let failed = 0;

    for (const record of records) {
      try {
        if (!record.url_documents) continue;
        
        const pdfUrls = await extractPdfUrls(record.url_documents);
        
        const { error: updateError } = await supabaseClient
          .from('property_data_api')
          .update({ pdf_urls: pdfUrls })
          .eq('id', record.id);

        if (updateError) {
          console.error(`Error updating record ${record.id}:`, updateError);
          failed++;
        } else {
          processed++;
        }
      } catch (error) {
        console.error(`Error processing record ${record.id}:`, error);
        failed++;
      }
    }

    return new Response(
      JSON.stringify({
        message: `Processed ${processed} records`,
        processed,
        failed
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});