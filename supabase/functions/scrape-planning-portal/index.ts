import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import * as cheerio from 'https://esm.sh/cheerio@1.0.0-rc.12'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ScrapingResult {
  sitePlanLinks: string[];
  committeeNotes: string[];
  otherLinks: Record<string, { url: string; description: string }>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      }
    });
  }

  try {
    const { url, applicationId, lpaAppNo, lpaName, description } = await req.json();

    if (!url || !applicationId) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required parameters',
          details: 'url and applicationId are required'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      );
    }

    console.log(`Starting scraping for application ${applicationId} at URL: ${url}`);

    // Fetch the planning portal page with a timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch URL: ${response.statusText}`);
      }

      const html = await response.text();
      clearTimeout(timeout);

      const $ = cheerio.load(html);

      // Initialize result structure
      const result: ScrapingResult = {
        sitePlanLinks: [],
        committeeNotes: [],
        otherLinks: {}
      };

      // Find and categorize links
      $('a').each((_, element) => {
        const link = $(element);
        const href = link.attr('href');
        const text = link.text().toLowerCase().trim();

        if (!href) return;

        try {
          // Normalize URL
          const fullUrl = href.startsWith('http') ? href : new URL(href, url).toString();

          // Categorize based on text content
          if (text.includes('site plan') || text.includes('location plan')) {
            result.sitePlanLinks.push(fullUrl);
          } else if (text.includes('committee') || text.includes('meeting notes')) {
            result.committeeNotes.push(fullUrl);
          } else if (text.includes('document') || text.includes('pdf') || text.includes('plan')) {
            const key = `doc_${Object.keys(result.otherLinks).length + 1}`;
            result.otherLinks[key] = {
              url: fullUrl,
              description: text
            };
          }
        } catch (urlError) {
          console.error('Error processing URL:', urlError);
        }
      });

      console.log(`Found ${result.sitePlanLinks.length} site plans, ${result.committeeNotes.length} committee notes, and ${Object.keys(result.otherLinks).length} other documents`);

      // Store results in Supabase
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      const { data, error } = await supabase
        .from('application_additional_details')
        .upsert({
          application_id: applicationId,
          lpa_app_no: lpaAppNo,
          lpa_name: lpaName,
          description: description,
          url_planning_app: url,
          site_plan_link: result.sitePlanLinks,
          committee_notes: result.committeeNotes,
          other_links: result.otherLinks,
          last_scraped_at: new Date().toISOString()
        }, {
          onConflict: 'application_id'
        })
        .select();

      if (error) {
        console.error('Error storing results:', error);
        throw error;
      }

      return new Response(
        JSON.stringify({ 
          message: 'Scraping completed successfully',
          data: data[0]
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          },
          status: 200
        }
      );

    } catch (fetchError) {
      clearTimeout(timeout);
      if (fetchError.name === 'AbortError') {
        throw new Error('Request timed out after 15 seconds');
      }
      throw fetchError;
    }

  } catch (error) {
    console.error('Error in scraping function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to scrape planning portal',
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});