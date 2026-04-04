import { useAuth } from "@/contexts/AuthContext";
import { useInvestments } from "@/contexts/InvestmentContext";
import { motion } from "framer-motion";
import { Info, ArrowRight, Wallet, TrendingUp, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";

const DashboardPage = () => {
  const { user } = useAuth();
  const { investments, transactions, loadingTransactions, loadingInvestments } = useInvestments();

  const activeInvestmentTotal = investments
    .filter((i) => i.status === "active")
    .reduce((sum, i) => sum + i.amount, 0);

  const hasDeposits = transactions.some((t) => t.type === "deposit");

  // Calculate this month's stats
  const thisMonthStats = useMemo(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const monthTx = transactions.filter((t) => t.date >= monthStart && t.status === "completed");
    return {
      deposits: monthTx.filter((t) => t.type === "deposit").reduce((s, t) => s + t.amount, 0),
      withdrawals: monthTx.filter((t) => t.type === "withdrawal").reduce((s, t) => s + t.amount, 0),
    };
  }, [transactions]);

  const recentTransactions = transactions.slice(0, 5);
  const isLoading = loadingTransactions || loadingInvestments;

  const statusColor = (s: string) => {
    if (s === "completed") return "bg-primary/10 text-primary border-primary/20";
    if (s === "pending") return "bg-accent/10 text-accent border-accent/20";
    return "bg-destructive/10 text-destructive border-destructive/20";
  };

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-sm text-muted-foreground">Welcome!</p>
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground mt-1">
          {user?.full_name || <Skeleton className="h-8 w-48" />}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Here's a summary of your account.</p>
      </motion.div>

      {/* Conditional alerts */}
      {!hasDeposits && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-info/30 bg-info/5 p-4 flex items-start gap-3"
        >
          <Info className="w-5 h-5 text-info mt-0.5 shrink-0" />
          <div>
            <p className="text-sm text-foreground">Make your first deposit to start investing and earning returns.</p>
            <Link to="/dashboard/deposit">
              <Button size="sm" className="mt-3 gap-1">
                Deposit Now <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      )}

      {(!user?.phone || user.phone === "") && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-xl border border-info/30 bg-info/5 p-4 flex items-start gap-3"
        >
          <Info className="w-5 h-5 text-info mt-0.5 shrink-0" />
          <div>
            <p className="text-sm text-foreground">Update your profile information to complete account setup.</p>
            <Link to="/dashboard/profile" className="text-sm text-info hover:underline mt-1 inline-block font-medium">
              Update Profile
            </Link>
          </div>
        </motion.div>
      )}

      {/* Available Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card-elevated rounded-xl border border-border p-5 space-y-4"
      >
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Available Balance</p>
          <Wallet className="w-4 h-4 text-muted-foreground" />
        </div>
        <p className="text-3xl font-display font-bold text-foreground">
          {(user?.balance ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })} <span className="text-lg font-normal text-muted-foreground">USD</span>
        </p>

        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Investment Account</p>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </div>
          {isLoading ? (
            <Skeleton className="h-7 w-40" />
          ) : (
            <p className="text-xl font-display font-bold text-foreground">
              {activeInvestmentTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })} <span className="text-sm font-normal text-muted-foreground">USD</span>
            </p>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <Button className="flex-1 gap-2" asChild>
            <Link to="/dashboard/deposit">
              Deposit <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button variant="secondary" className="flex-1" asChild>
            <Link to="/dashboard/invest">Invest & Earn</Link>
          </Button>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="card-elevated rounded-xl border border-border p-5 space-y-2"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Deposit</p>
            <ArrowDownToLine className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-xl font-display font-bold text-foreground">
            ${(user?.total_deposit ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <div className="pt-1">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">This Month</p>
            <p className="text-sm font-medium text-foreground mt-0.5">
              ${thisMonthStats.deposits.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-elevated rounded-xl border border-border p-5 space-y-2"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Withdraw</p>
            <ArrowUpFromLine className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-xl font-display font-bold text-foreground">
            ${(user?.total_withdrawal ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <div className="pt-1">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">This Month</p>
            <p className="text-sm font-medium text-foreground mt-0.5">
              ${thisMonthStats.withdrawals.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="card-elevated rounded-xl border border-border overflow-hidden"
      >
        <div className="flex items-center justify-between p-5 pb-3">
          <p className="text-sm font-semibold text-foreground">Recent Transactions</p>
          <Link to="/dashboard/transactions" className="text-xs text-primary hover:underline font-medium">View All</Link>
        </div>
        {isLoading ? (
          <div className="p-5 pt-0 space-y-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : recentTransactions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No transactions yet</p>
        ) : (
          <div className="divide-y divide-border/50">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between px-5 py-3 hover:bg-muted/20 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    tx.type === "deposit" ? "bg-primary/10" : tx.type === "withdrawal" ? "bg-accent/10" : "bg-info/10"
                  }`}>
                    {tx.type === "deposit" ? <ArrowDownToLine className="w-4 h-4 text-primary" /> :
                     tx.type === "withdrawal" ? <ArrowUpFromLine className="w-4 h-4 text-accent" /> :
                     <TrendingUp className="w-4 h-4 text-info" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-foreground truncate">{tx.description}</p>
                    <p className="text-[11px] text-muted-foreground">{tx.date?.split("T")[0]}</p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <p className={`text-sm font-semibold ${tx.type === "withdrawal" ? "text-accent" : "text-primary"}`}>
                    {tx.type === "withdrawal" ? "-" : "+"}${tx.amount.toLocaleString()}
                  </p>
                  <Badge variant="outline" className={`text-[10px] capitalize ${statusColor(tx.status)}`}>{tx.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center pt-4 pb-6 space-y-2"
      >
        <p className="text-xs text-muted-foreground">InvestFlow © 2026. All Rights Reserved.</p>
        <div className="flex items-center justify-center gap-4 text-xs">
          <a href="#" className="text-primary hover:underline">FAQs</a>
          <a href="#" className="text-primary hover:underline">Terms and Condition</a>
          <a href="#" className="text-primary hover:underline">Privacy</a>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
