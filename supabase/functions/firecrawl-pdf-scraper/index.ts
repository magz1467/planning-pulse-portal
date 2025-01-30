import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import FirecrawlApp from 'https://esm.sh/@mendable/firecrawl-js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PropertyData {
  id: number;
  url_documents: string;
  pdf_urls: string[] | null;
}

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to retry with exponential backoff
async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  retries = 3,
  initialDelay = 1000
): Promise<T> {
  let lastError;
  let delayTime = initialDelay;

  for (let i = 0; i < retries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      
      // If it's not a rate limit error, don't retry
      if (error?.statusCode !== 429) {
        throw error;
      }

      console.log(`Attempt ${i + 1} failed, retrying in ${delayTime}ms...`);
      await delay(delayTime);
      delayTime *= 2; // Exponential backoff
    }
  }

  throw lastError;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY')
    if (!firecrawlApiKey) {
      throw new Error('FIRECRAWL_API_KEY not found in environment variables')
    }

    const firecrawl = new FirecrawlApp({ apiKey: firecrawlApiKey })

    // Get records that have url_documents but no pdf_urls
    const { data: records, error: fetchError } = await supabaseClient
      .from('property_data_api')
      .select('id, url_documents, pdf_urls')
      .is('pdf_urls', null)
      .not('url_documents', 'is', null)
      .limit(10) // Process in batches

    if (fetchError) {
      throw fetchError
    }

    console.log(`Processing ${records?.length || 0} records`)

    const results = {
      processed: 0,
      failed: 0,
      message: '',
    }

    if (!records || records.length === 0) {
      results.message = 'No records to process'
      return new Response(JSON.stringify(results), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Process each record
    for (const record of records) {
      try {
        if (!record.url_documents) {
          console.log(`Skipping record ${record.id}: No URL provided`)
          continue
        }

        console.log(`Processing URL: ${record.url_documents}`)
        
        try {
          // Use extract endpoint with retry logic
          const extractResponse = await retryWithBackoff(async () => {
            return await firecrawl.extract(record.url_documents, {
              instruction: "extract only and all the pdf links on this page",
              scrapeOptions: {
                selectors: [
                  'a[href$=".pdf"]',
                  'a[href*="/pdf/"]',
                  'a[href*="document"]',
                  'a[href*="planning"]'
                ]
              }
            })
          });

          console.log('Extract response:', JSON.stringify(extractResponse, null, 2))

          if (!extractResponse.success) {
            console.error(`Failed to extract from ${record.url_documents}:`, extractResponse.error)
            results.failed++
            continue
          }

          // Extract PDF URLs from the extract response
          const pdfUrls = (extractResponse.data?.links || [])
            .filter(url => {
              if (!url) return false
              const urlLower = url.toLowerCase()
              return urlLower.endsWith('.pdf') || 
                     urlLower.includes('/pdf/') ||
                     (urlLower.includes('document') && urlLower.includes('planning'))
            })

          console.log(`Found ${pdfUrls.length} PDF URLs for record ${record.id}`)

          // Update the record with PDF URLs
          const { error: updateError } = await supabaseClient
            .from('property_data_api')
            .update({ pdf_urls: pdfUrls })
            .eq('id', record.id)

          if (updateError) {
            console.error(`Failed to update record ${record.id}:`, updateError)
            results.failed++
          } else {
            results.processed++
          }
        } catch (extractError) {
          console.error(`Error extracting from ${record.url_documents}:`, extractError)
          results.failed++
        }
      } catch (error) {
        console.error(`Error processing record ${record.id}:`, error)
        results.failed++
      }
    }

    results.message = `Successfully processed ${results.processed} records`

    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})