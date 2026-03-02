import { useAuth } from "@/contexts/AuthContext";
import { useInvestments } from "@/contexts/InvestmentContext";
import { motion } from "framer-motion";
import { AlertTriangle, Info, ArrowRight, Wallet, TrendingUp, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const DashboardPage = () => {
  const { user } = useAuth();
  const { investments } = useInvestments();

  const activeInvestmentTotal = investments
    .filter((i) => i.status === "active")
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-sm text-muted-foreground">Welcome!</p>
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground mt-1">
          {user?.full_name}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Here's a summary of your account. Have fun!</p>
      </motion.div>

      {/* Alert Banners */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border-2 border-accent/40 bg-accent/5 p-4 flex items-start gap-3"
      >
        <AlertTriangle className="w-5 h-5 text-accent mt-0.5 shrink-0" />
        <div>
          <p className="text-sm text-foreground">Add an account that you'd like to receive payment or withdraw fund.</p>
          <Button variant="default" size="sm" className="mt-3 bg-accent text-accent-foreground hover:bg-accent/90">
            Add Account
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-xl border border-info/30 bg-info/5 p-4 flex items-start gap-3"
      >
        <Info className="w-5 h-5 text-info mt-0.5 shrink-0" />
        <div>
          <p className="text-sm text-foreground">Update your account information from your profile to complete account setup.</p>
          <Link to="/dashboard/profile" className="text-sm text-info hover:underline mt-1 inline-block font-medium">
            Update Profile
          </Link>
        </div>
      </motion.div>

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
          <p className="text-xl font-display font-bold text-foreground">
            {activeInvestmentTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })} <span className="text-sm font-normal text-muted-foreground">USD</span>
          </p>
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

      {/* Total Deposit Card */}
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
        <p className="text-2xl font-display font-bold text-foreground">
          {(user?.total_deposit ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })} <span className="text-sm font-normal text-muted-foreground">USD</span>
        </p>
        <div className="pt-1">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">This Month</p>
          <p className="text-sm font-medium text-foreground mt-0.5">
            {(user?.total_deposit ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })} USD
          </p>
        </div>
        <div className="h-1 rounded-full bg-primary/30 mt-2">
          <div className="h-full rounded-full bg-primary" style={{ width: "60%" }} />
        </div>
      </motion.div>

      {/* Total Withdrawal Card */}
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
        <p className="text-2xl font-display font-bold text-foreground">
          {(user?.total_withdrawal ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })} <span className="text-sm font-normal text-muted-foreground">USD</span>
        </p>
        <div className="pt-1">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">This Month</p>
          <p className="text-sm font-medium text-foreground mt-0.5">
            {(user?.total_withdrawal ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })} USD
          </p>
        </div>
        <div className="h-1 rounded-full bg-accent/30 mt-2">
          <div className="h-full rounded-full bg-accent" style={{ width: "40%" }} />
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
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
