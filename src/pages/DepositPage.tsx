import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useInvestments } from "@/contexts/InvestmentContext";
import { motion } from "framer-motion";
import { ArrowDownToLine, Copy, Check, Wallet, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const CRYPTO_NETWORKS = [
  { id: "btc", label: "Bitcoin (BTC)", address: "bc1qaqxxwxkcmd8w8lzsr7j5u63ve2f467qeeqa9dd" },
  { id: "eth", label: "Ethereum (ETH)", address: "0x08b965a49C3703274E7C0FCB8B58aad1Dc2Dd8c7" },
  { id: "usdt", label: "USDT (TRC20)", address: "TNmNBY2DVKz8dFWXxxyH5ap49axJKgFEfu" },
];

const DepositPage = () => {
  const { user, session } = useAuth();
  const { refreshData } = useInvestments();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [txHash, setTxHash] = useState("");
  const [network, setNetwork] = useState("btc");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const presetAmounts = [100, 500, 1000, 5000];
  const selectedNetwork = CRYPTO_NETWORKS.find((n) => n.id === network)!;

  const handleDeposit = async () => {
    const depositAmount = parseFloat(amount);
    if (!depositAmount || depositAmount <= 0) {
      toast({ title: "Invalid amount", description: "Please enter a valid deposit amount.", variant: "destructive" });
      return;
    }
    if (depositAmount > 100000) {
      toast({ title: "Limit exceeded", description: "Maximum single deposit is $100,000.", variant: "destructive" });
      return;
    }
    if (!txHash.trim()) {
      toast({ title: "Transaction hash required", description: "Please enter the transaction hash from your crypto transfer.", variant: "destructive" });
      return;
    }
    if (!session?.user) return;

    // Rate limit: max 5 pending deposits
    const { count } = await supabase
      .from("transactions")
      .select("*", { count: "exact", head: true })
      .eq("user_id", session.user.id)
      .eq("type", "deposit")
      .eq("status", "pending");
    if ((count ?? 0) >= 5) {
      toast({ title: "Too many pending requests", description: "You already have 5 pending deposits. Please wait for them to be processed.", variant: "destructive" });
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("transactions").insert({
      user_id: session.user.id,
      type: "deposit",
      amount: depositAmount,
      description: `Crypto deposit via ${selectedNetwork.label}`,
      status: "pending",
      date: new Date().toISOString(),
      tx_hash: txHash.trim(),
    });

    if (error) {
      toast({ title: "Error", description: "Failed to submit deposit request.", variant: "destructive" });
    } else {
      await refreshData();
      toast({
        title: "Deposit submitted",
        description: `Your deposit of $${depositAmount.toLocaleString()} is pending admin approval.`,
      });
      setAmount("");
      setTxHash("");
    }
    setLoading(false);
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
        <p className="text-muted-foreground text-sm mt-1">Send cryptocurrency and submit your transaction hash for verification</p>
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
            ${(user?.balance ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </motion.div>

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-3"
      >
        <Clock className="w-5 h-5 text-primary mt-0.5 shrink-0" />
        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-foreground">How deposits work</p>
          <p className="mt-1">1. Send crypto to the wallet address below. 2. Paste your transaction hash. 3. Submit — your deposit will be credited once verified by admin.</p>
        </div>
      </motion.div>

      {/* Deposit Form */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="card-elevated rounded-xl border border-border p-6 space-y-5"
      >
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Select Network</Label>
          <div className="grid grid-cols-3 gap-2">
            {CRYPTO_NETWORKS.map((n) => (
              <button
                key={n.id}
                onClick={() => setNetwork(n.id)}
                className={`rounded-lg border p-3 text-sm font-medium transition-all ${
                  network === n.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-muted/30 text-muted-foreground hover:border-muted-foreground"
                }`}
              >
                {n.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2 rounded-lg bg-muted/40 p-4 border border-border">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Wallet Address</p>
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-mono text-foreground truncate">{selectedNetwork.address}</p>
            <button onClick={() => handleCopy(selectedNetwork.address)} className="text-muted-foreground hover:text-foreground shrink-0">
              {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Only send {selectedNetwork.label} to this address.</p>
        </div>

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

        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Transaction Hash</Label>
          <Input
            type="text"
            placeholder="Paste your transaction hash here"
            value={txHash}
            onChange={(e) => setTxHash(e.target.value)}
            className="text-sm h-12 font-mono"
          />
          <p className="text-xs text-muted-foreground">Find this in your wallet app after sending the crypto.</p>
        </div>

        <Button onClick={handleDeposit} disabled={loading} className="w-full h-12 text-base gap-2">
          {loading ? "Submitting..." : "Submit Deposit Request"}
        </Button>
      </motion.div>
    </div>
  );
};

export default DepositPage;
