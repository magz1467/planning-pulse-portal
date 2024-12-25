import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, token } = await req.json();
    const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);

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