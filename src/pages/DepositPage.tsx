import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useInvestments } from "@/contexts/InvestmentContext";
import { motion } from "framer-motion";
import { ArrowDownToLine, Copy, Check, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const PAYMENT_METHODS = [
  { id: "bank", label: "Bank Transfer" },
  { id: "crypto", label: "Cryptocurrency" },
  { id: "card", label: "Credit/Debit Card" },
];

const DepositPage = () => {
  const { user, updateUser } = useAuth();
  const { addTransaction } = useInvestments();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("bank");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const presetAmounts = [100, 500, 1000, 5000];

  const handleDeposit = () => {
    const depositAmount = parseFloat(amount);
    if (!depositAmount || depositAmount <= 0) {
      toast({ title: "Invalid amount", description: "Please enter a valid deposit amount.", variant: "destructive" });
      return;
    }
    if (depositAmount > 100000) {
      toast({ title: "Limit exceeded", description: "Maximum single deposit is $100,000.", variant: "destructive" });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      updateUser({
        balance: (user?.balance ?? 0) + depositAmount,
        totalDeposit: (user?.totalDeposit ?? 0) + depositAmount,
      });
      addTransaction({
        type: "deposit",
        amount: depositAmount,
        description: `Deposit via ${PAYMENT_METHODS.find((m) => m.id === method)?.label}`,
        status: "completed",
        date: new Date().toISOString().split("T")[0],
      });
      toast({ title: "Deposit successful", description: `$${depositAmount.toLocaleString()} has been added to your balance.` });
      setAmount("");
      setLoading(false);
    }, 1200);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <ArrowDownToLine className="w-6 h-6 text-primary" /> Deposit Funds
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Add funds to your investment account</p>
      </motion.div>

      {/* Current Balance */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-elevated rounded-xl border border-border p-5 flex items-center gap-4"
      >
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Wallet className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Current Balance</p>
          <p className="text-2xl font-display font-bold text-foreground">
            ${user?.balance?.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </motion.div>

      {/* Deposit Form */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="card-elevated rounded-xl border border-border p-6 space-y-5"
      >
        {/* Payment Method */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Payment Method</Label>
          <div className="grid grid-cols-3 gap-2">
            {PAYMENT_METHODS.map((m) => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`rounded-lg border p-3 text-sm font-medium transition-all ${
                  method === m.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-muted/30 text-muted-foreground hover:border-muted-foreground"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Amount */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Amount (USD)</Label>
          <Input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min={1}
            max={100000}
            className="text-lg h-12"
          />
          <div className="flex gap-2 flex-wrap">
            {presetAmounts.map((preset) => (
              <button
                key={preset}
                onClick={() => setAmount(String(preset))}
                className="text-xs px-3 py-1.5 rounded-lg border border-border bg-muted/50 text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
              >
                ${preset.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Payment Details (mock) */}
        {method === "bank" && (
          <div className="space-y-2 rounded-lg bg-muted/40 p-4 border border-border">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Bank Details</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Account Number</p>
                <p className="text-sm font-medium text-foreground">1234567890</p>
              </div>
              <button onClick={() => handleCopy("1234567890")} className="text-muted-foreground hover:text-foreground">
                {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Bank Name</p>
              <p className="text-sm font-medium text-foreground">InvestFlow Bank</p>
            </div>
          </div>
        )}

        {method === "crypto" && (
          <div className="space-y-2 rounded-lg bg-muted/40 p-4 border border-border">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Wallet Address</p>
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-mono text-foreground truncate">0x1a2b3c4d5e6f7890abcdef1234567890abcdef12</p>
              <button onClick={() => handleCopy("0x1a2b3c4d5e6f7890abcdef1234567890abcdef12")} className="text-muted-foreground hover:text-foreground shrink-0">
                {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

        <Button onClick={handleDeposit} disabled={loading} className="w-full h-12 text-base gap-2">
          {loading ? "Processing..." : "Confirm Deposit"}
        </Button>
      </motion.div>
    </div>
  );
};

export default DepositPage;
