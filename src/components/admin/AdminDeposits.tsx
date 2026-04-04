import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Check, X, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface PendingDeposit {
  id: string;
  user_id: string;
  amount: number;
  description: string;
  status: string;
  date: string;
  tx_hash: string;
  user_email?: string;
  user_name?: string;
}

const AdminDeposits = () => {
  const { toast } = useToast();
  const [deposits, setDeposits] = useState<PendingDeposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchDeposits = useCallback(async () => {
    setLoading(true);
    const { data: txData } = await supabase
      .from("transactions")
      .select("*")
      .eq("type", "deposit")
      .order("created_at", { ascending: false });

    if (txData) {
      const userIds = [...new Set(txData.map((t: any) => t.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", userIds);

      const profileMap = new Map((profiles || []).map((p: any) => [p.id, p]));
      setDeposits(
        txData.map((t: any) => {
          const profile = profileMap.get(t.user_id);
          return { ...t, tx_hash: t.tx_hash || "", user_email: profile?.email || "Unknown", user_name: profile?.full_name || "Unknown" };
        })
      );
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchDeposits(); }, [fetchDeposits]);

  const handleAction = async (deposit: PendingDeposit, action: "completed" | "rejected") => {
    setProcessingId(deposit.id);
    const { error: txError } = await supabase.from("transactions").update({ status: action }).eq("id", deposit.id);
    if (txError) {
      toast({ title: "Error", description: "Failed to update transaction.", variant: "destructive" });
      setProcessingId(null);
      return;
    }
    if (action === "completed") {
      const { data: profile } = await supabase.from("profiles").select("balance, total_deposit").eq("id", deposit.user_id).single();
      if (profile) {
        await supabase.from("profiles").update({ balance: (profile.balance ?? 0) + deposit.amount, total_deposit: (profile.total_deposit ?? 0) + deposit.amount }).eq("id", deposit.user_id);
      }
    }
    // Create notification
    await supabase.rpc("create_notification", {
      _user_id: deposit.user_id,
      _title: action === "completed" ? "Deposit Approved ✅" : "Deposit Rejected ❌",
      _message: action === "completed"
        ? `Your deposit of $${deposit.amount.toLocaleString()} has been approved and credited to your balance.`
        : `Your deposit of $${deposit.amount.toLocaleString()} has been rejected. Please contact support if you believe this is an error.`,
    });
    toast({ title: action === "completed" ? "Deposit approved" : "Deposit rejected", description: `$${deposit.amount.toLocaleString()} deposit has been ${action}.` });
    await fetchDeposits();
    setProcessingId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={fetchDeposits} className="gap-2">
          <RefreshCw className="w-4 h-4" /> Refresh
        </Button>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      ) : deposits.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No deposit requests found.</div>
      ) : (
        <div className="space-y-3">
          {deposits.map((deposit, i) => (
            <motion.div key={deposit.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="card-elevated rounded-xl border border-border p-5 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-foreground">{deposit.user_name}</p>
                    <span className="text-xs text-muted-foreground">{deposit.user_email}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{deposit.description}</p>
                  {deposit.tx_hash && <p className="text-xs font-mono text-muted-foreground truncate">TX: {deposit.tx_hash}</p>}
                  <p className="text-xs text-muted-foreground">{new Date(deposit.date).toLocaleString()}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg font-bold text-foreground">${deposit.amount.toLocaleString()}</p>
                  <Badge variant={deposit.status === "completed" ? "default" : deposit.status === "rejected" ? "destructive" : "secondary"} className="mt-1">{deposit.status}</Badge>
                </div>
              </div>
              {deposit.status === "pending" && (
                <div className="flex gap-2 pt-2 border-t border-border">
                  <Button size="sm" onClick={() => handleAction(deposit, "completed")} disabled={processingId === deposit.id} className="gap-1">
                    {processingId === deposit.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />} Approve
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleAction(deposit, "rejected")} disabled={processingId === deposit.id} className="gap-1">
                    {processingId === deposit.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-3 h-3" />} Reject
                  </Button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDeposits;
