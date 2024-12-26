import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL");

interface ContactRequest {
  email: string | null;
  phone: string | null;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const contactRequest: ContactRequest = await req.json();

    // Prepare email content
    const contactMethod = contactRequest.email ? 
      `Email: ${contactRequest.email}` : 
      `Phone: ${contactRequest.phone}`;

    const emailContent = `
      New contact request received:
      
      ${contactMethod}
      Message: ${contactRequest.message}
    `;

    // Send email using Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Planning Pulse <onboarding@resend.dev>",
        to: [ADMIN_EMAIL!],
        subject: "New Contact Request - Planning Pulse",
        text: emailContent,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to send email");
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in notify-contact function:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
};

serve(handler);