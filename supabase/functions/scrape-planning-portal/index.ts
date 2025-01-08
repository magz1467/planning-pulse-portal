import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import * as cheerio from 'https://esm.sh/cheerio@1.0.0-rc.12'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
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
      headers: corsHeaders,
      status: 204
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

    // Fetch the planning portal page with a timeout and retries
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const maxRetries = 3;
    let response;
    let retryCount = 0;
    
    while (retryCount < maxRetries) {
      try {
        response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Cache-Control': 'max-age=0'
          }
        });

        if (response.ok) {
          break;
        }

        console.log(`Attempt ${retryCount + 1} failed with status: ${response.status}`);
        retryCount++;
        await new Promise(resolve => setTimeout(resolve, 2000 * retryCount)); // Exponential backoff
      } catch (error) {
        console.error(`Fetch attempt ${retryCount + 1} failed:`, error);
        retryCount++;
        if (retryCount === maxRetries) throw error;
        await new Promise(resolve => setTimeout(resolve, 2000 * retryCount));
      }
    }

    if (!response?.ok) {
      throw new Error(`Failed to fetch URL after ${maxRetries} attempts: ${response?.statusText}`);
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

    // Find and categorize links with better error handling
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