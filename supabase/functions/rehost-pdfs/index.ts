import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get request body
    const { limit = 10 } = await req.json()

    console.log(`Processing up to ${limit} records`)

    // Get records that have pdf_urls but haven't been rehosted
    const { data: records, error: fetchError } = await supabase
      .from('property_data_api')
      .select('id, pdf_urls')
      .is('rehosted_urls', null)
      .not('pdf_urls', 'is', null)
      .limit(limit)

    if (fetchError) {
      console.error('Error fetching records:', fetchError)
      throw fetchError
    }

    console.log(`Found ${records?.length || 0} records to process`)

    let processed = 0
    let failed = 0

    if (records && records.length > 0) {
      for (const record of records) {
        try {
          const pdfUrls = record.pdf_urls || []
          const rehostedUrls: string[] = []

          for (const pdfUrl of pdfUrls) {
            try {
              console.log(`Fetching PDF from ${pdfUrl}`)
              
              // Fetch the PDF with proper headers and timeout
              const controller = new AbortController()
              const timeout = setTimeout(() => controller.abort(), 30000) // 30 second timeout
              
              try {
                const response = await fetch(pdfUrl, {
                  headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept': 'application/pdf,*/*'
                  },
                  signal: controller.signal
                })

                clearTimeout(timeout)

                if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`)
                }
                
                const contentType = response.headers.get('content-type')
                if (!contentType?.includes('application/pdf') && !contentType?.includes('application/octet-stream')) {
                  console.warn(`Warning: Unexpected content type: ${contentType} for ${pdfUrl}`)
                }

                const pdfBuffer = await response.arrayBuffer()
                
                // Generate a unique filename
                const filename = `pdfs/${record.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.pdf`
                
                console.log(`Uploading to ${filename}`)

                // Upload to Supabase Storage
                const { data: uploadData, error: uploadError } = await supabase.storage
                  .from('planning-docs')
                  .upload(filename, pdfBuffer, {
                    contentType: 'application/pdf',
                    upsert: false
                  })

                if (uploadError) {
                  throw uploadError
                }

                // Get public URL
                const { data: publicUrlData } = await supabase.storage
                  .from('planning-docs')
                  .getPublicUrl(uploadData.path)

                rehostedUrls.push(publicUrlData.publicUrl)
                console.log(`Successfully rehosted ${pdfUrl} to ${publicUrlData.publicUrl}`)
                processed++

              } catch (error) {
                console.error(`Failed to process PDF ${pdfUrl} for record ${record.id}:`, error)
                failed++
                // Keep original URL if processing fails
                rehostedUrls.push(pdfUrl)
                continue
              }
            } catch (error) {
              console.error(`Failed to process PDF ${pdfUrl} for record ${record.id}:`, error)
              failed++
              // Keep original URL if processing fails
              rehostedUrls.push(pdfUrl)
              continue
            }
          }

          // Update the record with rehosted URLs
          const { error: updateError } = await supabase
            .from('property_data_api')
            .update({ 
              rehosted_urls: rehostedUrls,
              last_rehosted_at: new Date().toISOString()
            })
            .eq('id', record.id)

          if (updateError) {
            console.error(`Failed to update record ${record.id}:`, updateError)
            throw updateError
          }

        } catch (error) {
          console.error(`Failed to process record ${record.id}:`, error)
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
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('Error in rehost-pdfs function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      { 
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})
