import { useAuth } from "@/contexts/AuthContext";
import { useInvestments } from "@/contexts/InvestmentContext";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TrendingUp, Clock, DollarSign, Percent } from "lucide-react";
import { toast } from "sonner";

const plans = [
  { name: "Standard Plan", min: 500, max: 10000, roi: 12, duration: "30 days", color: "from-primary/20 to-primary/5" },
  { name: "Professional Plan", min: 5000, max: 50000, roi: 18, duration: "60 days", color: "from-info/20 to-info/5" },
  { name: "Jupiter Plan", min: 10000, max: 100000, roi: 25, duration: "90 days", color: "from-warning/20 to-warning/5" },
  { name: "Mercury Plan", min: 25000, max: 500000, roi: 35, duration: "120 days", color: "from-destructive/20 to-destructive/5" },
];

const InvestmentPage = () => {
  const { user, updateBalance } = useAuth();
  const { addInvestment, addTransaction, investments } = useInvestments();

  const handleInvest = (plan: typeof plans[0]) => {
    if (!user || user.balance < plan.min) {
      toast.error("Insufficient balance for this plan");
      return;
    }

    const amount = plan.min;
    updateBalance(amount);
    addInvestment({
      planName: plan.name,
      amount,
      roi: plan.roi,
      duration: plan.duration,
      startDate: new Date().toISOString().split("T")[0],
      status: "active",
    });
    addTransaction({
      type: "investment",
      amount,
      description: `${plan.name} Investment`,
      status: "completed",
      date: new Date().toISOString().split("T")[0],
    });
    toast.success(`Successfully invested $${amount.toLocaleString()} in ${plan.name}`);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-foreground">Investment Plans</h1>
        <p className="text-muted-foreground mt-1">Choose a plan that matches your investment goals</p>
      </motion.div>

      {/* Active investments summary */}
      {investments.filter((i) => i.status === "active").length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-elevated rounded-xl border border-border p-6"
        >
          <h2 className="font-display font-semibold text-foreground mb-4">Your Active Investments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {investments.filter((i) => i.status === "active").map((inv) => (
              <div key={inv.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center animate-pulse-glow">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{inv.planName}</p>
                    <p className="text-xs text-muted-foreground">{inv.duration} · {inv.roi}% ROI · Started {inv.startDate}</p>
                  </div>
                </div>
                <p className="font-display font-bold text-foreground">${inv.amount.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card-elevated rounded-xl border border-border overflow-hidden"
          >
            <div className={`p-6 bg-gradient-to-br ${plan.color}`}>
              <h3 className="text-xl font-display font-bold text-foreground">{plan.name}</h3>
              <p className="text-4xl font-display font-bold text-foreground mt-2">{plan.roi}%</p>
              <p className="text-sm text-muted-foreground">Return on Investment</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Min Investment:</span>
                  <span className="ml-auto font-medium text-foreground">${plan.min.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Max Investment:</span>
                  <span className="ml-auto font-medium text-foreground">${plan.max.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Percent className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">ROI:</span>
                  <span className="ml-auto font-medium text-primary">{plan.roi}%</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="ml-auto font-medium text-foreground">{plan.duration}</span>
                </div>
              </div>
              <Button onClick={() => handleInvest(plan)} className="w-full glow-primary" size="lg">
                Invest Now
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default InvestmentPage;
