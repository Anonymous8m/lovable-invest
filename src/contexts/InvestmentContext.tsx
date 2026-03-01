import { createContext, useContext, useState, ReactNode } from "react";

export interface Transaction {
  id: string;
  type: "deposit" | "withdrawal" | "investment";
  amount: number;
  description: string;
  status: "completed" | "pending" | "failed";
  date: string;
}

export interface Investment {
  id: string;
  planName: string;
  amount: number;
  roi: number;
  duration: string;
  startDate: string;
  status: "active" | "completed" | "pending";
}

interface InvestmentContextType {
  transactions: Transaction[];
  investments: Investment[];
  addTransaction: (t: Omit<Transaction, "id">) => void;
  addInvestment: (i: Omit<Investment, "id">) => void;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "1", type: "deposit", amount: 10000, description: "Initial Deposit", status: "completed", date: "2026-02-25" },
  { id: "2", type: "deposit", amount: 15000, description: "Wire Transfer", status: "completed", date: "2026-02-26" },
  { id: "3", type: "investment", amount: 5000, description: "Standard Plan Investment", status: "completed", date: "2026-02-27" },
  { id: "4", type: "deposit", amount: 7000, description: "Bank Transfer", status: "completed", date: "2026-02-27" },
  { id: "5", type: "withdrawal", amount: 3000, description: "Profit Withdrawal", status: "completed", date: "2026-02-28" },
  { id: "6", type: "investment", amount: 8000, description: "Professional Plan Investment", status: "active" as any, date: "2026-02-28" },
  { id: "7", type: "withdrawal", amount: 4150, description: "Withdrawal to Bank", status: "pending", date: "2026-03-01" },
];

const MOCK_INVESTMENTS: Investment[] = [
  { id: "1", planName: "Standard Plan", amount: 5000, roi: 12, duration: "30 days", startDate: "2026-02-27", status: "active" },
  { id: "2", planName: "Professional Plan", amount: 8000, roi: 18, duration: "60 days", startDate: "2026-02-28", status: "active" },
];

const InvestmentContext = createContext<InvestmentContextType | null>(null);

export function InvestmentProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [investments, setInvestments] = useState<Investment[]>(MOCK_INVESTMENTS);

  const addTransaction = (t: Omit<Transaction, "id">) => {
    setTransactions((prev) => [{ ...t, id: crypto.randomUUID() }, ...prev]);
  };

  const addInvestment = (i: Omit<Investment, "id">) => {
    setInvestments((prev) => [{ ...i, id: crypto.randomUUID() }, ...prev]);
  };

  return (
    <InvestmentContext.Provider value={{ transactions, investments, addTransaction, addInvestment }}>
      {children}
    </InvestmentContext.Provider>
  );
}

export function useInvestments() {
  const ctx = useContext(InvestmentContext);
  if (!ctx) throw new Error("useInvestments must be used within InvestmentProvider");
  return ctx;
}
