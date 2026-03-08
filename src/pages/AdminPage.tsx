import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { ShieldCheck, LayoutDashboard, ArrowDownToLine, ArrowUpFromLine, Users, Layers } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminOverview from "@/components/admin/AdminOverview";
import AdminDeposits from "@/components/admin/AdminDeposits";
import AdminWithdrawals from "@/components/admin/AdminWithdrawals";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminPlans from "@/components/admin/AdminPlans";

const AdminPage = () => {
  const { session } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!session?.user) { setLoading(false); return; }
      const { data } = await supabase.rpc("has_role", { _user_id: session.user.id, _role: "admin" });
      setIsAdmin(!!data);
      setLoading(false);
    };
    checkAdmin();
  }, [session?.user?.id]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><p className="text-muted-foreground">Loading...</p></div>;
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Access denied. Admin privileges required.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-primary" /> Admin Panel
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your platform from one place</p>
      </motion.div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 h-auto">
          <TabsTrigger value="overview" className="gap-1.5 text-xs sm:text-sm py-2.5">
            <LayoutDashboard className="w-4 h-4 hidden sm:block" /> Overview
          </TabsTrigger>
          <TabsTrigger value="deposits" className="gap-1.5 text-xs sm:text-sm py-2.5">
            <ArrowDownToLine className="w-4 h-4 hidden sm:block" /> Deposits
          </TabsTrigger>
          <TabsTrigger value="withdrawals" className="gap-1.5 text-xs sm:text-sm py-2.5">
            <ArrowUpFromLine className="w-4 h-4 hidden sm:block" /> Withdrawals
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-1.5 text-xs sm:text-sm py-2.5">
            <Users className="w-4 h-4 hidden sm:block" /> Users
          </TabsTrigger>
          <TabsTrigger value="plans" className="gap-1.5 text-xs sm:text-sm py-2.5">
            <Layers className="w-4 h-4 hidden sm:block" /> Plans
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview"><AdminOverview /></TabsContent>
        <TabsContent value="deposits"><AdminDeposits /></TabsContent>
        <TabsContent value="withdrawals"><AdminWithdrawals /></TabsContent>
        <TabsContent value="users"><AdminUsers /></TabsContent>
        <TabsContent value="plans"><AdminPlans /></TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
