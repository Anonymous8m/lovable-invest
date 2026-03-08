import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Loader2, RefreshCw, Search, User, DollarSign, Edit2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  username: string;
  phone: string;
  balance: number;
  total_deposit: number;
  total_withdrawal: number;
  created_at: string;
}

const AdminUsers = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editBalance, setEditBalance] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    if (data) {
      setUsers(data);
      setFilteredUsers(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredUsers(users);
    } else {
      const q = search.toLowerCase();
      setFilteredUsers(users.filter(u => u.full_name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.username.toLowerCase().includes(q)));
    }
  }, [search, users]);

  const handleSaveBalance = async (userId: string) => {
    const newBalance = Number(editBalance);
    if (isNaN(newBalance) || newBalance < 0) {
      toast({ title: "Invalid amount", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ balance: newBalance }).eq("id", userId);
    if (error) {
      toast({ title: "Error updating balance", variant: "destructive" });
    } else {
      toast({ title: "Balance updated successfully" });
      await fetchUsers();
    }
    setSaving(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            placeholder="Search users by name, email, or username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground w-full"
          />
        </div>
        <Button variant="outline" size="sm" onClick={fetchUsers} className="gap-2">
          <RefreshCw className="w-4 h-4" /> Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No users found.</div>
      ) : (
        <div className="space-y-3">
          {filteredUsers.map((user, i) => (
            <motion.div key={user.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }} className="card-elevated rounded-xl border border-border p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm shrink-0">
                    {user.full_name?.charAt(0) || "U"}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <p className="font-semibold text-foreground">{user.full_name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    <div className="flex items-center gap-2 flex-wrap mt-1">
                      <Badge variant="secondary" className="text-xs">@{user.username}</Badge>
                      {user.phone && <Badge variant="outline" className="text-xs">{user.phone}</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Joined {new Date(user.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right shrink-0 space-y-2">
                  {editingId === user.id ? (
                    <div className="flex items-center gap-2">
                      <Input type="number" value={editBalance} onChange={(e) => setEditBalance(e.target.value)} className="w-32 h-8 text-sm" />
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleSaveBalance(user.id)} disabled={saving}>
                        <Save className="w-3.5 h-3.5 text-primary" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditingId(null)}>
                        <X className="w-3.5 h-3.5 text-muted-foreground" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-bold text-foreground">${user.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setEditingId(user.id); setEditBalance(String(user.balance)); }}>
                        <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
                      </Button>
                    </div>
                  )}
                  <div className="flex gap-3 text-xs text-muted-foreground">
                    <span>Dep: ${user.total_deposit.toLocaleString()}</span>
                    <span>With: ${user.total_withdrawal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
