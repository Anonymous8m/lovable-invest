import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useInvestments } from "@/contexts/InvestmentContext";
import { motion } from "framer-motion";
import { ArrowUpFromLine, Wallet, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const WithdrawPage = () => {
  const { user, refreshProfile } = useAuth();
  const { addTransaction } = useInvestments();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const balance = user?.balance ?? 0;

  const handleWithdraw = async () => {
    const withdrawAmount = parseFloat(amount);
    if (!withdrawAmount || withdrawAmount <= 0) {
      toast({ title: "Invalid amount", description: "Please enter a valid withdrawal amount.", variant: "destructive" });
      return;
    }
    if (withdrawAmount > balance) {
      toast({ title: "Insufficient funds", description: "You don't have enough balance for this withdrawal.", variant: "destructive" });
      return;
    }
    if (withdrawAmount > 50000) {
      toast({ title: "Limit exceeded", description: "Maximum single withdrawal is $50,000.", variant: "destructive" });
      return;
    }
    if (!accountName.trim() || !accountNumber.trim()) {
      toast({ title: "Missing details", description: "Please fill in your account name and number.", variant: "destructive" });
      return;
    }
    if (accountName.trim().length > 100 || accountNumber.trim().length > 30) {
      toast({ title: "Invalid input", description: "Account details are too long.", variant: "destructive" });
      return;
    }
    if (!user) return;

    setLoading(true);

    await supabase
      .from("profiles")
      .update({
        balance: balance - withdrawAmount,
        total_withdrawal: (user.total_withdrawal ?? 0) + withdrawAmount,
      })
      .eq("id", user.id);

    await addTransaction({
      type: "withdrawal",
      amount: withdrawAmount,
      description: `Withdrawal to ${accountName.trim()}`,
      status: "pending",
      date: new Date().toISOString().split("T")[0],
    });

    await refreshProfile();
    toast({ title: "Withdrawal submitted", description: `$${withdrawAmount.toLocaleString()} withdrawal is pending approval.` });
    setAmount("");
    setAccountName("");
    setAccountNumber("");
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <ArrowUpFromLine className="w-6 h-6 text-accent" /> Withdraw Funds
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Cash out your profits to your bank account</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-elevated rounded-xl border border-border p-5 flex items-center gap-4"
      >
        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
          <Wallet className="w-6 h-6 text-accent" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Available Balance</p>
          <p className="text-2xl font-display font-bold text-foreground">
            ${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </motion.div>

      {balance <= 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border-2 border-accent/40 bg-accent/5 p-4 flex items-start gap-3"
        >
          <AlertTriangle className="w-5 h-5 text-accent mt-0.5 shrink-0" />
          <p className="text-sm text-foreground">Your balance is empty. Please deposit funds before withdrawing.</p>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="card-elevated rounded-xl border border-border p-6 space-y-5"
      >
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Account Holder Name</Label>
          <Input
            placeholder="Enter account holder name"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            maxLength={100}
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Account / Wallet Number</Label>
          <Input
            placeholder="Enter account or wallet number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            maxLength={30}
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Amount (USD)</Label>
          <Input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min={1}
            max={50000}
            className="text-lg h-12"
          />
          {balance > 0 && (
            <button
              onClick={() => setAmount(String(balance))}
              className="text-xs text-primary hover:underline"
            >
              Withdraw all (${balance.toLocaleString()})
            </button>
          )}
        </div>

        <Button
          onClick={handleWithdraw}
          disabled={loading || balance <= 0}
          className="w-full h-12 text-base gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
        >
          {loading ? "Processing..." : "Submit Withdrawal"}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Withdrawals are subject to review and may take 1-3 business days to process.
        </p>
      </motion.div>
    </div>
  );
};

export default WithdrawPage;
