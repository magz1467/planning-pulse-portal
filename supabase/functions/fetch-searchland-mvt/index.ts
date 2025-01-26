import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SEARCHLAND_API_KEY = Deno.env.get('SEARCHLAND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Fetch data from SearchLand API for London area
    const searchlandResponse = await fetch('https://api.searchland.co.uk/v1/planning/applications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': SEARCHLAND_API_KEY!
      },
      body: JSON.stringify({
        bbox: '-0.5,51.3,-0.1,51.5', // London area
        limit: 100,
        submitted_after: '2025-01-01',
        submitted_before: '2025-12-31'
      })
    })

    if (!searchlandResponse.ok) {
      const errorText = await searchlandResponse.text()
      console.error('SearchLand API error:', errorText)
      throw new Error(`SearchLand API failed with status ${searchlandResponse.status}: ${errorText}`)
    }

    const data = await searchlandResponse.json()
    console.log('SearchLand data received:', data.length, 'applications')

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!)

    // Clear existing data
    const { error: clearError } = await supabase
      .from('planning_applications')
      .delete()
      .neq('id', 0) // Delete all rows

    if (clearError) {
      console.error('Error clearing table:', clearError)
      throw clearError
    }

    // Store the applications in the database
    const { error: insertError } = await supabase
      .from('planning_applications')
      .upsert(
        data.map((app: any) => ({
          application_number: app.reference,
          status: app.status,
          submitted_date: app.submissionDate,
          description: app.description,
          category: app.type || 'Unknown',
          region: app.address?.split(',').pop()?.trim() || 'London',
          geom: `SRID=4326;POINT(${app.location.coordinates[0]} ${app.location.coordinates[1]})`
        })),
        { onConflict: 'application_number' }
      )

    if (insertError) {
      console.error('Error inserting applications:', insertError)
      throw insertError
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully imported ${data.length} applications`
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})