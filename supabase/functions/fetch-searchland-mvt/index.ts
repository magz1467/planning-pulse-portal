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
    const url = new URL(req.url)
    const z = parseInt(url.searchParams.get('z') || '')
    const x = parseInt(url.searchParams.get('x') || '')
    const y = parseInt(url.searchParams.get('y') || '')

    if (isNaN(z) || isNaN(x) || isNaN(y)) {
      console.error('Invalid tile coordinates:', { z, x, y })
      return new Response(
        JSON.stringify({ error: 'Invalid tile coordinates' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Fetching tile:', { z, x, y })

    // Convert tile coordinates to bounding box
    const bbox = tileToLatLngBounds(x, y, z)
    console.log('Bbox:', bbox)

    // Fetch data from SearchLand API
    const searchlandResponse = await fetch('https://api.searchland.co.uk/v1/planning/applications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': SEARCHLAND_API_KEY!
      },
      body: JSON.stringify({
        bbox: `${bbox.west},${bbox.south},${bbox.east},${bbox.north}`,
        limit: 100
      })
    })

    if (!searchlandResponse.ok) {
      console.error('SearchLand API error:', await searchlandResponse.text())
      throw new Error('Failed to fetch from SearchLand API')
    }

    const data = await searchlandResponse.json()
    console.log('SearchLand data received:', data.length, 'applications')

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!)

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
          region: app.address?.split(',').pop()?.trim() || 'Unknown',
          geom: `SRID=4326;POINT(${app.location.coordinates[0]} ${app.location.coordinates[1]})`
        })),
        { onConflict: 'application_number' }
      )

    if (insertError) {
      console.error('Error inserting applications:', insertError)
    }

    // Generate MVT from the database
    const { data: mvt, error } = await supabase.rpc('fetch_searchland_mvt', {
      z,
      x,
      y
    })

    if (error) {
      console.error('Error generating MVT:', error)
      throw error
    }

    return new Response(mvt, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/x-protobuf'
      }
    })

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

// Helper function to convert tile coordinates to lat/lng bounds
function tileToLatLngBounds(x: number, y: number, z: number) {
  const n = Math.PI - 2 * Math.PI * y / Math.pow(2, z)
  const north = (180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))))
  const south = (180 / Math.PI * Math.atan(0.5 * (Math.exp(n + Math.PI / Math.pow(2, z - 1)) - Math.exp(-n - Math.PI / Math.pow(2, z - 1)))))
  
  const west = (x / Math.pow(2, z) * 360 - 180)
  const east = ((x + 1) / Math.pow(2, z) * 360 - 180)
  
  return { north, south, east, west }
}