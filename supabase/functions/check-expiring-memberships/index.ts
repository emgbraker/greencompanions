import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting check for expiring memberships...");

    // Create Supabase client with service role for admin access
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get memberships expiring within 30 days that haven't been notified yet
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const { data: expiringMemberships, error: fetchError } = await supabaseAdmin
      .from("memberships")
      .select(`
        id,
        user_id,
        type,
        end_date,
        notification_sent,
        profiles!inner (
          id,
          first_name,
          email
        )
      `)
      .eq("status", "active")
      .eq("notification_sent", false)
      .not("end_date", "is", null)
      .lte("end_date", thirtyDaysFromNow.toISOString())
      .gte("end_date", new Date().toISOString());

    if (fetchError) {
      console.error("Error fetching expiring memberships:", fetchError);
      throw fetchError;
    }

    console.log(`Found ${expiringMemberships?.length || 0} expiring memberships to notify`);

    const results = [];

    for (const membership of expiringMemberships || []) {
      const profile = membership.profiles as any;
      const endDate = new Date(membership.end_date);
      const daysUntilExpiry = Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      
      const typeMap: Record<string, string> = {
        free: "Gratis",
        premium: "Premium",
        elite: "Elite"
      };
      const membershipTypeNL = typeMap[membership.type as string] || membership.type;

      try {
        // Send email notification
        const emailResult = await resend.emails.send({
          from: "GreenConnect <noreply@resend.dev>",
          to: [profile.email],
          subject: `Je ${membershipTypeNL} lidmaatschap verloopt binnenkort`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #16a34a;">GreenConnect</h1>
              <h2>Beste ${profile.first_name},</h2>
              <p>Je <strong>${membershipTypeNL}</strong> lidmaatschap bij GreenConnect verloopt over <strong>${daysUntilExpiry} dagen</strong> (op ${endDate.toLocaleDateString('nl-NL')}).</p>
              <p>Om ononderbroken toegang te behouden tot alle features, raden we je aan om je lidmaatschap te verlengen.</p>
              <div style="margin: 30px 0;">
                <a href="https://greenconnect.lovable.app/lidmaatschappen" 
                   style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                  Lidmaatschap Verlengen
                </a>
              </div>
              <p>Met sportieve groet,<br>Het GreenConnect Team</p>
            </div>
          `,
        });

        console.log(`Email sent to ${profile.email}:`, emailResult);

        // Create in-app notification
        const { error: notifError } = await supabaseAdmin
          .from("notifications")
          .insert({
            user_id: profile.id,
            title: "Lidmaatschap verloopt binnenkort",
            message: `Je ${membershipTypeNL} lidmaatschap verloopt over ${daysUntilExpiry} dagen. Verleng nu om ononderbroken toegang te behouden.`,
            type: "warning",
          });

        if (notifError) {
          console.error("Error creating notification:", notifError);
        }

        // Mark membership as notified
        const { error: updateError } = await supabaseAdmin
          .from("memberships")
          .update({ notification_sent: true })
          .eq("id", membership.id);

        if (updateError) {
          console.error("Error updating membership:", updateError);
        }

        results.push({
          user_id: profile.id,
          email: profile.email,
          status: "notified",
          days_until_expiry: daysUntilExpiry,
        });

      } catch (emailError: unknown) {
        const errMessage = emailError instanceof Error ? emailError.message : "Unknown error";
        console.error(`Error sending email to ${profile.email}:`, emailError);
        results.push({
          user_id: profile.id,
          email: profile.email,
          status: "error",
          error: errMessage,
        });
      }
    }

    // Also check and update expired memberships
    const { data: expiredMemberships, error: expiredError } = await supabaseAdmin
      .from("memberships")
      .update({ status: "expired" })
      .eq("status", "active")
      .lt("end_date", new Date().toISOString())
      .select();

    if (expiredError) {
      console.error("Error updating expired memberships:", expiredError);
    } else {
      console.log(`Marked ${expiredMemberships?.length || 0} memberships as expired`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        notified: results.length,
        expired: expiredMemberships?.length || 0,
        results,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in check-expiring-memberships:", error);
    return new Response(
      JSON.stringify({ error: errMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
