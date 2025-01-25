import { serve } from 'https://deno.fresh.dev/std@v1/http/server.ts'

serve(async (req) => {
  try {
    const SEARCHLAND_API_KEY = Deno.env.get('SEARCHLAND_API_KEY')
    
    if (!SEARCHLAND_API_KEY) {
      throw new Error('SEARCHLAND_API_KEY not found')
    }

    return new Response(
      JSON.stringify({ SEARCHLAND_API_KEY }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})