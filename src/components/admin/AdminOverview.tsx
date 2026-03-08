import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Users, DollarSign, TrendingUp, ArrowDownToLine, ArrowUpFromLine, Activity } from "lucide-react";

interface Stats {
  totalUsers: number;
  totalDeposits: number;
  totalWithdrawals: number;
  pendingDeposits: number;
  pendingWithdrawals: number;
  activeInvestments: number;
  totalInvested: number;
}

const AdminOverview = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    pendingDeposits: 0,
    pendingWithdrawals: 0,
    activeInvestments: 0,
    totalInvested: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [profilesRes, depositsRes, withdrawalsRes, pendingDepRes, pendingWithRes, investmentsRes] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("transactions").select("amount").eq("type", "deposit").eq("status", "completed"),
        supabase.from("transactions").select("amount").eq("type", "withdrawal").eq("status", "completed"),
        supabase.from("transactions").select("id", { count: "exact", head: true }).eq("type", "deposit").eq("status", "pending"),
        supabase.from("transactions").select("id", { count: "exact", head: true }).eq("type", "withdrawal").eq("status", "pending"),
        supabase.from("user_investments").select("amount").eq("status", "active"),
      ]);

      setStats({
        totalUsers: profilesRes.count ?? 0,
        totalDeposits: (depositsRes.data || []).reduce((s, d) => s + Number(d.amount), 0),
        totalWithdrawals: (withdrawalsRes.data || []).reduce((s, d) => s + Number(d.amount), 0),
        pendingDeposits: pendingDepRes.count ?? 0,
        pendingWithdrawals: pendingWithRes.count ?? 0,
        activeInvestments: (investmentsRes.data || []).length,
        totalInvested: (investmentsRes.data || []).reduce((s, d) => s + Number(d.amount), 0),
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Total Users", value: stats.totalUsers, icon: Users, format: "number" },
    { label: "Total Deposits", value: stats.totalDeposits, icon: ArrowDownToLine, format: "currency" },
    { label: "Total Withdrawals", value: stats.totalWithdrawals, icon: ArrowUpFromLine, format: "currency" },
    { label: "Pending Deposits", value: stats.pendingDeposits, icon: Activity, format: "number", highlight: true },
    { label: "Pending Withdrawals", value: stats.pendingWithdrawals, icon: Activity, format: "number", highlight: true },
    { label: "Active Investments", value: stats.activeInvestments, icon: TrendingUp, format: "number" },
    { label: "Total Invested", value: stats.totalInvested, icon: DollarSign, format: "currency" },
  ];

  if (loading) {
    return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-28 rounded-xl bg-muted animate-pulse" />)}</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className={`card-elevated rounded-xl border p-5 space-y-2 ${card.highlight && card.value > 0 ? "border-warning bg-warning/5" : "border-border"}`}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{card.label}</p>
            <card.icon className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-display font-bold text-foreground">
            {card.format === "currency"
              ? `$${card.value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
              : card.value.toLocaleString()}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default AdminOverview;
