import { useAuth } from "@/contexts/AuthContext";
import { useInvestments } from "@/contexts/InvestmentContext";
import { motion } from "framer-motion";
import { Wallet, ArrowDownToLine, ArrowUpFromLine, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const statCards = [
  { key: "balance", label: "Available Balance", icon: Wallet, format: true, color: "text-primary" },
  { key: "totalDeposit", label: "Total Deposit", icon: ArrowDownToLine, format: true, color: "text-success" },
  { key: "totalWithdrawal", label: "Total Withdrawal", icon: ArrowUpFromLine, format: true, color: "text-warning" },
];

const DashboardPage = () => {
  const { user } = useAuth();
  const { transactions, investments } = useInvestments();

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">
          Welcome, <span className="text-gradient">{user?.username}</span>
        </h1>
        <p className="text-muted-foreground mt-1">Here's your portfolio overview</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statCards.map((card, i) => {
          const value = user?.[card.key as keyof typeof user] as number;
          return (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card-elevated rounded-xl p-6 border border-border"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.label}</p>
                  <p className="text-2xl font-display font-bold text-foreground mt-2">
                    ${value?.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center ${card.color}`}>
                  <card.icon className="w-5 h-5" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Investments */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-elevated rounded-xl border border-border p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-foreground">Active Investments</h2>
            <Link to="/dashboard/invest" className="text-sm text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {investments.filter((i) => i.status === "active").length === 0 ? (
            <p className="text-muted-foreground text-sm">No active investments</p>
          ) : (
            <div className="space-y-3">
              {investments
                .filter((i) => i.status === "active")
                .map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{inv.planName}</p>
                        <p className="text-xs text-muted-foreground">{inv.duration} · {inv.roi}% ROI</p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-foreground">${inv.amount.toLocaleString()}</p>
                  </div>
                ))}
            </div>
          )}
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card-elevated rounded-xl border border-border p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-foreground">Recent Transactions</h2>
            <Link to="/dashboard/transactions" className="text-sm text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    tx.type === "deposit" ? "bg-success/10" : tx.type === "withdrawal" ? "bg-warning/10" : "bg-info/10"
                  }`}>
                    {tx.type === "deposit" ? (
                      <ArrowDownToLine className="w-4 h-4 text-success" />
                    ) : tx.type === "withdrawal" ? (
                      <ArrowUpFromLine className="w-4 h-4 text-warning" />
                    ) : (
                      <TrendingUp className="w-4 h-4 text-info" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{tx.description}</p>
                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                  </div>
                </div>
                <p className={`text-sm font-semibold ${
                  tx.type === "deposit" ? "text-success" : tx.type === "withdrawal" ? "text-warning" : "text-info"
                }`}>
                  {tx.type === "withdrawal" ? "-" : "+"}${tx.amount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
