import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  firstName: string;
  membershipType: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Welcome email function called");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, firstName, membershipType }: WelcomeEmailRequest = await req.json();
    
    console.log(`Sending welcome email to ${email} for ${firstName}`);

    const membershipText = membershipType === "elite" 
      ? "Je bent nu een Elite lid en kunt andere golfers vinden die ook een relatie zoeken."
      : "Je bent nu een gratis lid en kunt golfpartners vinden in je regio.";

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #22c55e, #16a34a);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .logo {
              width: 60px;
              height: 60px;
              background: white;
              border-radius: 50%;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              font-size: 32px;
              font-weight: bold;
              color: #22c55e;
              margin-bottom: 15px;
            }
            .content {
              background: #f9fafb;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            h1 {
              margin: 0;
              font-size: 24px;
            }
            .cta-button {
              display: inline-block;
              background: linear-gradient(135deg, #22c55e, #16a34a);
              color: white;
              padding: 15px 30px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: bold;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              color: #666;
              font-size: 12px;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">G</div>
            <h1>Welkom bij GreenConnect!</h1>
          </div>
          <div class="content">
            <p>Beste ${firstName},</p>
            <p>Gefeliciteerd! Je account bij GreenConnect is succesvol aangemaakt. 🎉</p>
            <p>${membershipText}</p>
            <p>Wat kun je nu doen:</p>
            <ul>
              <li>Vul je profiel aan met een foto en bio</li>
              <li>Zoek naar golfers in jouw regio</li>
              <li>Stuur matches een bericht om een ronde te plannen</li>
            </ul>
            <p style="text-align: center;">
              <a href="https://greenconnect.lovable.app/profile" class="cta-button">
                Bekijk je Profiel
              </a>
            </p>
            <p>Veel plezier op de baan!</p>
            <p>Het GreenConnect Team</p>
          </div>
          <div class="footer">
            <p>GreenConnect - Verbind, Speel, Geniet</p>
            <p>Dit is een automatisch gegenereerde e-mail.</p>
          </div>
        </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "GreenConnect <onboarding@resend.dev>",
      to: [email],
      subject: `Welkom bij GreenConnect, ${firstName}! 🏌️`,
      html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
