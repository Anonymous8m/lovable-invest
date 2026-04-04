import { createClient } from "https://esm.sh/@supabase/supabase-js@2.98.0";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.98.0/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  // Fetch active investments
  const { data: investments, error: fetchError } = await supabase
    .from("user_investments")
    .select("*")
    .eq("status", "active");

  if (fetchError) {
    return new Response(JSON.stringify({ error: fetchError.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const now = new Date();
  let maturedCount = 0;

  for (const inv of investments || []) {
    const startDate = new Date(inv.start_date);
    // Parse duration like "30 days", "7 days", "90 days"
    const durationMatch = inv.duration.match(/(\d+)/);
    if (!durationMatch) continue;
    const durationDays = parseInt(durationMatch[1], 10);
    const maturityDate = new Date(startDate.getTime() + durationDays * 86400000);

    if (now >= maturityDate) {
      const payout = inv.amount + inv.amount * (inv.roi / 100);

      // Mark investment as completed
      await supabase
        .from("user_investments")
        .update({ status: "completed" })
        .eq("id", inv.id);

      // Credit user balance
      const { data: profile } = await supabase
        .from("profiles")
        .select("balance")
        .eq("id", inv.user_id)
        .single();

      if (profile) {
        await supabase
          .from("profiles")
          .update({ balance: (profile.balance ?? 0) + payout })
          .eq("id", inv.user_id);
      }

      // Create transaction record
      await supabase.from("transactions").insert({
        user_id: inv.user_id,
        type: "deposit",
        amount: payout,
        description: `Investment matured: ${inv.plan_name} — $${inv.amount} + $${(payout - inv.amount).toFixed(2)} ROI`,
        status: "completed",
        date: now.toISOString(),
      });

      // Create notification
      await supabase.rpc("create_notification", {
        _user_id: inv.user_id,
        _title: "Investment Matured! 🎉",
        _message: `Your ${inv.plan_name} investment of $${inv.amount.toLocaleString()} has matured. $${payout.toLocaleString()} has been credited to your balance.`,
      });

      maturedCount++;
    }
  }

  return new Response(JSON.stringify({ matured: maturedCount }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
