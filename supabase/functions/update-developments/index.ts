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
    // Initialize Supabase client with service role key
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // For testing purposes, create a mock development entry
    const mockDevelopment = {
      external_id: 'MAP_' + Date.now(),
      title: 'Test Development from MapCloud',
      address: '123 Test Street, London',
      status: 'Under Review',
      description: 'Test development entry from scheduled job',
      applicant: 'Test Developer',
      submission_date: new Date().toISOString(),
      decision_due: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      type: 'Residential',
      ward: 'Test Ward',
      officer: 'Test Officer',
      consultation_end: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
      lat: 51.5074,
      lng: -0.1278,
      raw_data: { source: 'MapCloud API Mock' }
    }

    // Insert the mock development
    const { data, error } = await supabase
      .from('developments')
      .upsert(mockDevelopment, {
        onConflict: 'external_id',
        returning: true
      })

    if (error) {
      console.error('Error inserting development:', error)
      throw error
    }

    console.log('Successfully inserted/updated development:', data)

    return new Response(
      JSON.stringify({
        message: 'Development data updated successfully',
        data
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error in update-developments function:', error)
    return new Response(
      JSON.stringify({
        error: 'Failed to update development data',
        details: error.message
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})