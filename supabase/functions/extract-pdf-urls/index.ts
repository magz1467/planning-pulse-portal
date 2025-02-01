import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log("PDF URL extraction function starting")

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log("Fetching records to process...")

    // Get records that need processing (10 at a time)
    const { data: records, error: fetchError } = await supabaseClient
      .from('property_data_api')
      .select('*')
      .is('pdf_urls', null)
      .limit(10)

    if (fetchError) {
      console.error('Error fetching records:', fetchError)
      throw new Error(`Failed to fetch records: ${fetchError.message}`)
    }

    if (!records || records.length === 0) {
      console.log("No records to process")
      return new Response(
        JSON.stringify({ 
          message: "No records to process",
          processed: 0,
          failed: 0 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log(`Processing ${records.length} records`)

    let processed = 0
    let failed = 0

    for (const record of records) {
      try {
        if (!record.url_documents) {
          console.log(`Skipping record ${record.id} - no url_documents`)
          failed++
          continue
        }

        // Fetch the document page
        console.log(`Fetching document page for record ${record.id}:`, record.url_documents)
        const response = await fetch(record.url_documents)
        const html = await response.text()

        // Extract PDF URLs using multiple patterns
        const pdfUrls = new Set()
        
        // Pattern 1: Direct PDF links
        const hrefPattern = /href=["'](.*?\.pdf)["']/gi
        let match
        while ((match = hrefPattern.exec(html)) !== null) {
          if (match[1]) pdfUrls.add(match[1])
        }

        // Pattern 2: URLs in data attributes
        const dataPattern = /data-[^=]*=["'](.*?\.pdf)["']/gi
        while ((match = dataPattern.exec(html)) !== null) {
          if (match[1]) pdfUrls.add(match[1])
        }

        // Pattern 3: URLs in src attributes
        const srcPattern = /src=["'](.*?\.pdf)["']/gi
        while ((match = srcPattern.exec(html)) !== null) {
          if (match[1]) pdfUrls.add(match[1])
        }

        // Convert Set to Array and handle relative URLs
        const pdfUrlsArray = Array.from(pdfUrls).map(url => {
          if (url.startsWith('/')) {
            const baseUrl = new URL(record.url_documents)
            return `${baseUrl.origin}${url}`
          }
          return url
        })

        console.log(`Found ${pdfUrlsArray.length} PDF URLs for record ${record.id}`)

        // Update the record
        const { error: updateError } = await supabaseClient
          .from('property_data_api')
          .update({ 
            pdf_urls: pdfUrlsArray,
            last_scraped_at: new Date().toISOString()
          })
          .eq('id', record.id)

        if (updateError) {
          console.error(`Error updating record ${record.id}:`, updateError)
          failed++
        } else {
          processed++
        }
      } catch (error) {
        console.error(`Error processing record ${record.id}:`, error)
        failed++
      }
    }

    console.log(`Completed processing. Processed: ${processed}, Failed: ${failed}`)

    return new Response(
      JSON.stringify({
        message: `Processed ${processed} records successfully`,
        processed,
        failed
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({
        error: 'Internal Server Error',
        details: error.message
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})