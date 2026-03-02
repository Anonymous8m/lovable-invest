import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";

export interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  status: string;
  date: string;
}

export interface Investment {
  id: string;
  plan_name: string;
  amount: number;
  roi: number;
  duration: string;
  start_date: string;
  status: string;
}

interface InvestmentContextType {
  transactions: Transaction[];
  investments: Investment[];
  loadingTransactions: boolean;
  loadingInvestments: boolean;
  addTransaction: (t: Omit<Transaction, "id">) => Promise<void>;
  addInvestment: (i: Omit<Investment, "id">) => Promise<void>;
  refreshData: () => Promise<void>;
}

const InvestmentContext = createContext<InvestmentContextType | null>(null);

export function InvestmentProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [loadingInvestments, setLoadingInvestments] = useState(false);

  const fetchTransactions = useCallback(async () => {
    if (!session?.user) return;
    setLoadingTransactions(true);
    const { data } = await supabase
      .from("transactions")
      .select("id, type, amount, description, status, date")
      .eq("user_id", session.user.id)
      .order("date", { ascending: false });
    if (data) setTransactions(data);
    setLoadingTransactions(false);
  }, [session?.user?.id]);

  const fetchInvestments = useCallback(async () => {
    if (!session?.user) return;
    setLoadingInvestments(true);
    const { data } = await supabase
      .from("user_investments")
      .select("id, plan_name, amount, roi, duration, start_date, status")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });
    if (data) setInvestments(data);
    setLoadingInvestments(false);
  }, [session?.user?.id]);

  const refreshData = useCallback(async () => {
    await Promise.all([fetchTransactions(), fetchInvestments()]);
  }, [fetchTransactions, fetchInvestments]);

  useEffect(() => {
    if (session?.user) {
      refreshData();
    } else {
      setTransactions([]);
      setInvestments([]);
    }
  }, [session?.user?.id, refreshData]);

  const addTransaction = async (t: Omit<Transaction, "id">) => {
    if (!session?.user) return;
    await supabase.from("transactions").insert({
      user_id: session.user.id,
      type: t.type,
      amount: t.amount,
      description: t.description,
      status: t.status,
      date: t.date,
    });
    await fetchTransactions();
  };

  const addInvestment = async (i: Omit<Investment, "id">) => {
    if (!session?.user) return;
    await supabase.from("user_investments").insert({
      user_id: session.user.id,
      plan_name: i.plan_name,
      amount: i.amount,
      roi: i.roi,
      duration: i.duration,
      start_date: i.start_date,
      status: i.status,
    });
    await fetchInvestments();
  };

  return (
    <InvestmentContext.Provider value={{ transactions, investments, loadingTransactions, loadingInvestments, addTransaction, addInvestment, refreshData }}>
      {children}
    </InvestmentContext.Provider>
  );
}

export function useInvestments() {
  const ctx = useContext(InvestmentContext);
  if (!ctx) throw new Error("useInvestments must be used within InvestmentProvider");
  return ctx;
}
