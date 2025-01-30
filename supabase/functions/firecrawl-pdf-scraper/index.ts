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
        console.log(`Processing URL: ${record.url_documents}`)
        
        const crawlResponse = await firecrawl.crawlUrl(record.url_documents, {
          limit: 50, // Limit pages to crawl
          scrapeOptions: {
            formats: ['pdf'], // Only look for PDFs
            selectors: [
              'a[href$=".pdf"]', // Links ending in .pdf
              'a[href*="/pdf/"]', // Links containing /pdf/
              'a[href*="document"]', // Links containing "document"
              'a[href*="planning"]', // Links containing "planning"
            ]
          }
        })

        if (!crawlResponse.success) {
          console.error(`Failed to crawl ${record.url_documents}:`, crawlResponse.error)
          results.failed++
          continue
        }

        // Extract PDF URLs from the crawl response
        const pdfUrls = crawlResponse.data
          .filter(item => {
            const url = item.url.toLowerCase()
            return url.endsWith('.pdf') || 
                   url.includes('/pdf/') ||
                   (url.includes('document') && url.includes('planning'))
          })
          .map(item => item.url)

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