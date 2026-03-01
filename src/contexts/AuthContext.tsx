import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  username: string;
  avatarUrl?: string;
  balance: number;
  totalDeposit: number;
  totalWithdrawal: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  signup: (data: Omit<User, "id" | "balance" | "totalDeposit" | "totalWithdrawal"> & { password: string }) => boolean;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  updateBalance: (amount: number) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const MOCK_USER: User = {
  id: "1",
  fullName: "Alex Morgan",
  email: "alex@investflow.com",
  phone: "+1 555 0123",
  username: "alexmorgan",
  balance: 24850.0,
  totalDeposit: 32000.0,
  totalWithdrawal: 7150.0,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string, _password: string) => {
    // Mock login - accepts any credentials
    setUser({ ...MOCK_USER, username });
    return true;
  };

  const signup = (data: Omit<User, "id" | "balance" | "totalDeposit" | "totalWithdrawal"> & { password: string }) => {
    setUser({
      id: crypto.randomUUID(),
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      username: data.username,
      balance: 0,
      totalDeposit: 0,
      totalWithdrawal: 0,
    });
    return true;
  };

  const logout = () => setUser(null);

  const updateUser = (data: Partial<User>) => {
    if (user) setUser({ ...user, ...data });
  };

  const updateBalance = (amount: number) => {
    if (user) setUser({ ...user, balance: user.balance - amount });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout, updateUser, updateBalance }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
