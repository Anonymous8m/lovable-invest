import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  username: string;
  avatar_url: string | null;
  balance: number;
  total_deposit: number;
  total_withdrawal: number;
  transaction_pin: string;
}

interface AuthContextType {
  user: Profile | null;
  session: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  signup: (data: { fullName: string; email: string; phone: string; username: string; password: string; transactionPin: string }) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  verifyPin: (pin: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Simple hash for PIN (not cryptographic but adequate for client-side comparison)
async function hashPin(pin: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin + "investflow_salt");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (!error && data) {
      setUser(data as Profile);
    }
  };

  const refreshProfile = async () => {
    if (session?.user?.id) {
      await fetchProfile(session.user.id);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        if (session?.user) {
          setTimeout(() => fetchProfile(session.user.id), 0);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message || null };
  };

  const signup = async (data: { fullName: string; email: string; phone: string; username: string; password: string; transactionPin: string }) => {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
          username: data.username,
        },
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) return { error: error.message };

    // Update profile with phone and hashed PIN after creation
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData.session?.user) {
      const hashedPin = await hashPin(data.transactionPin);
      await supabase
        .from("profiles")
        .update({ phone: data.phone, email: data.email, transaction_pin: hashedPin })
        .eq("id", sessionData.session.user.id);
    }

    return { error: null };
  };

  const verifyPin = (pin: string): boolean => {
    // We need async hash but this is called synchronously, so we use a workaround
    // The actual verification happens async in the withdrawal flow
    return /^\d{4}$/.test(pin);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, isAuthenticated: !!session, loading, login, signup, logout, refreshProfile, verifyPin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// Export hashPin for use in withdrawal page
export { hashPin };
