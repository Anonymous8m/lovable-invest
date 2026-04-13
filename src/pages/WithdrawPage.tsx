import { motion } from "framer-motion";
import { ArrowUpFromLine, Clock } from "lucide-react";

const WithdrawPage = () => {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <ArrowUpFromLine className="w-6 h-6 text-accent" /> Withdraw Funds
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Withdraw your profits to a cryptocurrency wallet</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-elevated rounded-xl border border-border p-8 flex flex-col items-center justify-center text-center space-y-4"
      >
        <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
          <Clock className="w-8 h-8 text-accent" />
        </div>
        <h2 className="text-xl font-display font-semibold text-foreground">
          Investment Not Matured Yet
        </h2>
        <p className="text-muted-foreground text-sm max-w-md">
          Your investment has not matured yet. Withdrawals are only available once your investment period is complete. Please check back later.
        </p>
      </motion.div>
    </div>
  );
};

export default WithdrawPage;
