import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'
import { createSupabaseClient } from '../_shared/supabase-client.ts'

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, token } = await req.json();
    const supabase = createSupabaseClient();

    // Verify token
    const { data, error } = await supabase
      .from('User data')
      .select('*')
      .eq('Email', email)
      .eq('verification_token', token)
      .gt('verification_token_expires', new Date().toISOString())
      .single();

    if (error || !data) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired verification token' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Update verification status
    const { error: updateError } = await supabase
      .from('User data')
      .update({ 
        email_verified: true,
        verification_token: null,
        verification_token_expires: null
      })
      .eq('Email', email);

    if (updateError) {
      throw updateError;
    }

    return new Response(
      JSON.stringify({ message: 'Email verified successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});