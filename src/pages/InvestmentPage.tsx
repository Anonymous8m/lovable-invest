import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useInvestments } from "@/contexts/InvestmentContext";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingUp, Clock, DollarSign, Percent } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const plans = [
  { name: "Standard Plan", min: 1000, max: 5000, roi: 12, duration: "30 days", color: "from-primary/20 to-primary/5" },
  { name: "Professional Plan", min: 5000, max: 25000, roi: 18, duration: "60 days", color: "from-info/20 to-info/5" },
  { name: "Jupiter Plan", min: 25000, max: 100000, roi: 25, duration: "90 days", color: "from-warning/20 to-warning/5" },
  { name: "Mercury Plan", min: 100000, max: 500000, roi: 35, duration: "120 days", color: "from-destructive/20 to-destructive/5" },
];

type Plan = typeof plans[0];

const InvestmentPage = () => {
  const { user, session, refreshProfile } = useAuth();
  const { addInvestment, addTransaction, investments } = useInvestments();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [investAmount, setInvestAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const parsedAmount = Number(investAmount);
  const isValidAmount =
    selectedPlan &&
    !isNaN(parsedAmount) &&
    parsedAmount >= selectedPlan.min &&
    parsedAmount <= selectedPlan.max;

  const handleConfirmInvest = async () => {
    if (!user || !session || !selectedPlan || !isValidAmount) return;

    if (user.balance < parsedAmount) {
      toast.error("Insufficient balance for this investment");
      return;
    }

    setIsSubmitting(true);
    try {
      await supabase
        .from("profiles")
        .update({ balance: user.balance - parsedAmount })
        .eq("id", user.id);

      await addInvestment({
        plan_name: selectedPlan.name,
        amount: parsedAmount,
        roi: selectedPlan.roi,
        duration: selectedPlan.duration,
        start_date: new Date().toISOString().split("T")[0],
        status: "active",
      });

      await addTransaction({
        type: "investment",
        amount: parsedAmount,
        description: `${selectedPlan.name} Investment`,
        status: "completed",
        date: new Date().toISOString().split("T")[0],
      });

      await refreshProfile();
      toast.success(`Successfully invested $${parsedAmount.toLocaleString()} in ${selectedPlan.name}`);
    } catch {
      toast.error("Investment failed. Please try again.");
    } finally {
      setIsSubmitting(false);
      setSelectedPlan(null);
      setInvestAmount("");
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-foreground">Investment Plans</h1>
        <p className="text-muted-foreground mt-1">Choose a plan that matches your investment goals</p>
      </motion.div>

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
                    <p className="font-medium text-foreground">{inv.plan_name}</p>
                    <p className="text-xs text-muted-foreground">{inv.duration} · {inv.roi}% ROI · Started {inv.start_date}</p>
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
              <Button
                onClick={() => {
                  setSelectedPlan(plan);
                  setInvestAmount(String(plan.min));
                }}
                className="w-full glow-primary"
                size="lg"
              >
                Invest Now
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Investment Amount Dialog */}
      <AlertDialog open={!!selectedPlan} onOpenChange={(open) => { if (!open) { setSelectedPlan(null); setInvestAmount(""); } }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">Invest in {selectedPlan?.name}</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4 pt-2">
                <p className="text-sm text-muted-foreground">
                  Enter the amount you'd like to invest. Must be between{" "}
                  <span className="font-medium text-foreground">${selectedPlan?.min.toLocaleString()}</span> and{" "}
                  <span className="font-medium text-foreground">${selectedPlan?.max.toLocaleString()}</span>.
                </p>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Investment Amount ($)</label>
                  <Input
                    type="number"
                    value={investAmount}
                    onChange={(e) => setInvestAmount(e.target.value)}
                    min={selectedPlan?.min}
                    max={selectedPlan?.max}
                    placeholder={`Min $${selectedPlan?.min.toLocaleString()}`}
                  />
                  {investAmount && !isValidAmount && (
                    <p className="text-xs text-destructive">
                      Amount must be between ${selectedPlan?.min.toLocaleString()} and ${selectedPlan?.max.toLocaleString()}
                    </p>
                  )}
                </div>
                {isValidAmount && (
                  <div className="rounded-lg bg-muted/50 border border-border p-3 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Investment</span>
                      <span className="font-medium text-foreground">${parsedAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expected ROI</span>
                      <span className="font-medium text-primary">
                        +${((parsedAmount * (selectedPlan?.roi ?? 0)) / 100).toLocaleString()} ({selectedPlan?.roi}%)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-medium text-foreground">{selectedPlan?.duration}</span>
                    </div>
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmInvest}
              disabled={!isValidAmount || isSubmitting}
            >
              {isSubmitting ? "Processing..." : `Confirm Investment`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InvestmentPage;
