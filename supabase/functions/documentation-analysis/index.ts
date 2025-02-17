import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

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

    // Parse request body
    const { limit = 10 } = await req.json()
    console.log(`Processing ${limit} records`)

    // Get records that have url_documents but no pdf_urls
    const { data: records, error: fetchError } = await supabaseClient
      .from('property_data_api')
      .select('id, url_documents, pdf_urls')
      .is('pdf_urls', null)
      .not('url_documents', 'is', null)
      .limit(limit)

    if (fetchError) {
      console.error('Error fetching records:', fetchError)
      throw fetchError
    }

    console.log(`Found ${records?.length || 0} records to process`)

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
        
        // Update the record with empty array for now (we'll implement PDF extraction later)
        const { error: updateError } = await supabaseClient
          .from('property_data_api')
          .update({ pdf_urls: [] })
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