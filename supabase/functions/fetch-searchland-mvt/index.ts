import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { z, x, y } = await req.json()
    
    // Validate coordinates
    if (typeof z !== 'number' || typeof x !== 'number' || typeof y !== 'number') {
      console.error('Invalid coordinates:', { z, x, y })
      throw new Error('Invalid coordinates provided')
    }

    // Create MVT endpoint URL
    const functionUrl = `https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/${z}/${x}/${y}.mvt`
    
    console.log('Generated MVT URL:', functionUrl)

    return new Response(
      JSON.stringify({ functionUrl }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})