import { useInvestments } from "@/contexts/InvestmentContext";
import { motion } from "framer-motion";
import { ArrowDownToLine, ArrowUpFromLine, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const TransactionsPage = () => {
  const { transactions, loadingTransactions } = useInvestments();
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all" ? transactions : transactions.filter((t) => t.type === filter);

  const statusColor = (s: string) => {
    if (s === "completed") return "bg-success/10 text-success border-success/20";
    if (s === "pending") return "bg-warning/10 text-warning border-warning/20";
    return "bg-destructive/10 text-destructive border-destructive/20";
  };

  const filters = ["all", "deposit", "withdrawal", "investment"];

  if (loadingTransactions) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading transactions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-foreground">Transactions</h1>
        <p className="text-muted-foreground mt-1">View your complete transaction history</p>
      </motion.div>

      <div className="flex gap-2 flex-wrap">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              filter === f
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-elevated rounded-xl border border-border overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Type</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Description</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Amount</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">No transactions yet</td>
                </tr>
              )}
              {filtered.map((tx, i) => (
                <motion.tr
                  key={tx.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <td className="p-4">
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
                  </td>
                  <td className="p-4 text-sm text-foreground">{tx.description}</td>
                  <td className={`p-4 text-sm font-semibold ${
                    tx.type === "deposit" ? "text-success" : tx.type === "withdrawal" ? "text-warning" : "text-info"
                  }`}>
                    {tx.type === "withdrawal" ? "-" : "+"}${tx.amount.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <Badge variant="outline" className={`capitalize ${statusColor(tx.status)}`}>
                      {tx.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{tx.date?.split("T")[0]}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default TransactionsPage;
