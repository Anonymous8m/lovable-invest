import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Check, X, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface PendingWithdrawal {
  id: string;
  user_id: string;
  amount: number;
  description: string;
  status: string;
  date: string;
  user_email?: string;
  user_name?: string;
}

const AdminWithdrawals = () => {
  const { toast } = useToast();
  const [withdrawals, setWithdrawals] = useState<PendingWithdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchWithdrawals = useCallback(async () => {
    setLoading(true);
    const { data: txData } = await supabase.from("transactions").select("*").eq("type", "withdrawal").order("created_at", { ascending: false });
    if (txData) {
      const userIds = [...new Set(txData.map((t: any) => t.user_id))];
      const { data: profiles } = await supabase.from("profiles").select("id, full_name, email").in("id", userIds);
      const profileMap = new Map((profiles || []).map((p: any) => [p.id, p]));
      setWithdrawals(txData.map((t: any) => {
        const profile = profileMap.get(t.user_id);
        return { ...t, user_email: profile?.email || "Unknown", user_name: profile?.full_name || "Unknown" };
      }));
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchWithdrawals(); }, [fetchWithdrawals]);

  const handleAction = async (withdrawal: PendingWithdrawal, action: "completed" | "rejected") => {
    setProcessingId(withdrawal.id);
    const { error: txError } = await supabase.from("transactions").update({ status: action }).eq("id", withdrawal.id);
    if (txError) {
      toast({ title: "Error", description: "Failed to update transaction.", variant: "destructive" });
      setProcessingId(null);
      return;
    }
    if (action === "completed") {
      // Balance was already deducted on submission; just update total_withdrawal
      const { data: profile } = await supabase.from("profiles").select("total_withdrawal").eq("id", withdrawal.user_id).single();
      if (profile) {
        await supabase.from("profiles").update({ total_withdrawal: (profile.total_withdrawal ?? 0) + withdrawal.amount }).eq("id", withdrawal.user_id);
      }
    } else if (action === "rejected") {
      // Refund: add the held amount back to balance
      const { data: profile } = await supabase.from("profiles").select("balance").eq("id", withdrawal.user_id).single();
      if (profile) {
        await supabase.from("profiles").update({ balance: (profile.balance ?? 0) + withdrawal.amount }).eq("id", withdrawal.user_id);
      }
    }
    toast({ title: action === "completed" ? "Withdrawal approved" : "Withdrawal rejected", description: `$${withdrawal.amount.toLocaleString()} withdrawal has been ${action}.` });
    await fetchWithdrawals();
    setProcessingId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={fetchWithdrawals} className="gap-2">
          <RefreshCw className="w-4 h-4" /> Refresh
        </Button>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      ) : withdrawals.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No withdrawal requests found.</div>
      ) : (
        <div className="space-y-3">
          {withdrawals.map((withdrawal, i) => (
            <motion.div key={withdrawal.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="card-elevated rounded-xl border border-border p-5 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-foreground">{withdrawal.user_name}</p>
                    <span className="text-xs text-muted-foreground">{withdrawal.user_email}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{withdrawal.description}</p>
                  <p className="text-xs text-muted-foreground">{new Date(withdrawal.date).toLocaleString()}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg font-bold text-foreground">${withdrawal.amount.toLocaleString()}</p>
                  <Badge variant={withdrawal.status === "completed" ? "default" : withdrawal.status === "rejected" ? "destructive" : "secondary"} className="mt-1">{withdrawal.status}</Badge>
                </div>
              </div>
              {withdrawal.status === "pending" && (
                <div className="flex gap-2 pt-2 border-t border-border">
                  <Button size="sm" onClick={() => handleAction(withdrawal, "completed")} disabled={processingId === withdrawal.id} className="gap-1">
                    {processingId === withdrawal.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />} Approve
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleAction(withdrawal, "rejected")} disabled={processingId === withdrawal.id} className="gap-1">
                    {processingId === withdrawal.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-3 h-3" />} Reject
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

export default AdminWithdrawals;
