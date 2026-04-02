import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { TrendingUp, Clock, DollarSign, Percent, Shield, Star, Loader2 } from "lucide-react";

interface Plan {
  id: string;
  name: string;
  min_amount: number;
  max_amount: number;
  roi: number;
  duration: string;
}

const PLAN_FEATURES: Record<string, string[]> = {
  "Standard Plan": ["Daily profit updates", "Withdraw anytime", "24/7 support"],
  "Professional Plan": ["Priority support", "Compounding returns", "Portfolio tracking"],
  "Jupiter Plan": ["Dedicated manager", "Advanced analytics", "Tax optimization"],
  "Mercury Plan": ["VIP support", "Custom strategies", "Institutional access"],
};

const PlansPage = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      const { data } = await supabase
        .from("investment_plans")
        .select("*")
        .order("min_amount", { ascending: true });
      if (data) setPlans(data);
      setLoading(false);
    };
    fetchPlans();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-foreground">Our Plans</h1>
        <p className="text-muted-foreground mt-1">Compare our investment plans and find the right fit</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {plans.map((plan, i) => {
          const features = PLAN_FEATURES[plan.name] || ["Secure investment", "Guaranteed returns", "24/7 support"];
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card-elevated rounded-xl border border-border p-6"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-display font-bold text-foreground">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm mt-1">{plan.duration} investment period</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-display font-bold text-primary">{plan.roi}%</p>
                  <p className="text-xs text-muted-foreground">ROI</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Range:</span>
                  <span className="ml-auto font-medium text-foreground">
                    ${plan.min_amount.toLocaleString()} – ${plan.max_amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="ml-auto font-medium text-foreground">{plan.duration}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Percent className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Returns:</span>
                  <span className="ml-auto font-medium text-primary">{plan.roi}% guaranteed</span>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" /> Features
                </p>
                <ul className="space-y-2">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Star className="w-3 h-3 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default PlansPage;
