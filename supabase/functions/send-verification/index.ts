import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'
import { createSupabaseClient } from '../_shared/supabase-client.ts'

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();
    const supabase = createSupabaseClient();

    // Generate verification token
    const token = crypto.randomUUID();
    const expires = new Date();
    expires.setHours(expires.getHours() + 24); // Token expires in 24 hours

    // Save token to database
    const { error: dbError } = await supabase
      .from('User data')
      .update({ 
        verification_token: token,
        verification_token_expires: expires.toISOString()
      })
      .eq('Email', email);

    if (dbError) throw dbError;

    // Send verification email using Resend
    const verificationUrl = `${req.headers.get('origin')}/verify?email=${encodeURIComponent(email)}&token=${token}`;
    
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Planning Pulse <no-reply@planningpulse.co.uk>",
        to: [email],
        subject: "Verify your email subscription",
        html: `
          <h1>Verify your email</h1>
          <p>Click the link below to verify your email address and complete your newsletter subscription:</p>
          <a href="${verificationUrl}">Verify Email</a>
          <p>This link will expire in 24 hours.</p>
        `,
      }),
    });

    if (!res.ok) {
      throw new Error('Failed to send verification email');
    }

    return new Response(
      JSON.stringify({ message: 'Verification email sent' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});