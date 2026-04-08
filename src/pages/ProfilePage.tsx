import { useAuth, hashPin } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { User, Mail, Phone, Lock, Camera, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const ProfilePage = () => {
  const { user, refreshProfile } = useAuth();
  const [form, setForm] = useState({
    full_name: user?.full_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    username: user?.username || "",
  });
  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirm: "",
  });
  const [pinForm, setPinForm] = useState({
    currentPin: "",
    newPin: "",
    confirmPin: "",
  });
  const [saving, setSaving] = useState(false);
  const [savingPin, setSavingPin] = useState(false);
  const hasExistingPin = !!user?.transaction_pin;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: form.full_name,
        phone: form.phone,
        username: form.username,
      })
      .eq("id", user.id);
    setSaving(false);
    if (error) {
      toast.error("Failed to update profile");
    } else {
      await refreshProfile();
      toast.success("Profile updated successfully");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: passwordForm.newPassword });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password changed successfully");
      setPasswordForm({ newPassword: "", confirm: "" });
    }
  };
  const handleUpdatePin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (hasExistingPin) {
      if (!/^\d{4}$/.test(pinForm.currentPin)) {
        toast.error("Enter your current 4-digit PIN");
        return;
      }
      const hashedCurrent = await hashPin(pinForm.currentPin);
      if (hashedCurrent !== user.transaction_pin) {
        toast.error("Current PIN is incorrect");
        return;
      }
    }

    if (!/^\d{4}$/.test(pinForm.newPin)) {
      toast.error("New PIN must be exactly 4 digits");
      return;
    }
    if (pinForm.newPin !== pinForm.confirmPin) {
      toast.error("PINs do not match");
      return;
    }

    setSavingPin(true);
    const hashedNew = await hashPin(pinForm.newPin);
    const { error } = await supabase
      .from("profiles")
      .update({ transaction_pin: hashedNew })
      .eq("id", user.id);
    setSavingPin(false);

    if (error) {
      toast.error("Failed to update PIN");
    } else {
      await refreshProfile();
      toast.success(hasExistingPin ? "Transaction PIN updated" : "Transaction PIN set successfully");
      setPinForm({ currentPin: "", newPin: "", confirmPin: "" });
    }
  };


  return (
    <div className="space-y-6 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-foreground">My Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your account settings</p>
      </motion.div>

      {/* Avatar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-elevated rounded-xl border border-border p-6 flex items-center gap-6"
      >
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-display font-bold">
            {user?.full_name?.charAt(0) || "U"}
          </div>
          <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:opacity-90 transition">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <div>
          <h2 className="text-lg font-display font-semibold text-foreground">{user?.full_name}</h2>
          <p className="text-muted-foreground text-sm">@{user?.username}</p>
        </div>
      </motion.div>

      {/* Profile Form */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card-elevated rounded-xl border border-border p-6"
      >
        <h2 className="font-display font-semibold text-foreground mb-4">Personal Information</h2>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><User className="w-3.5 h-3.5" /> Full Name</Label>
              <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="bg-muted border-border" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><User className="w-3.5 h-3.5" /> Username</Label>
              <Input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="bg-muted border-border" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> Email</Label>
              <Input value={form.email} disabled className="bg-muted border-border opacity-60" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> Phone</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="bg-muted border-border" />
            </div>
          </div>
          <Button type="submit" className="glow-primary" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </motion.div>

      {/* Change Password */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card-elevated rounded-xl border border-border p-6"
      >
        <h2 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
          <Lock className="w-4 h-4" /> Change Password
        </h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} className="bg-muted border-border" />
            </div>
            <div className="space-y-2">
              <Label>Confirm Password</Label>
              <Input type="password" value={passwordForm.confirm} onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })} className="bg-muted border-border" />
            </div>
          </div>
          <Button type="submit" variant="secondary">Update Password</Button>
        </form>
      </motion.div>

      {/* Transaction PIN */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card-elevated rounded-xl border border-border p-6"
      >
        <h2 className="font-display font-semibold text-foreground mb-1 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" /> Transaction PIN
        </h2>
        <p className="text-muted-foreground text-sm mb-4">
          {hasExistingPin ? "Update your 4-digit PIN used for withdrawals." : "Set a 4-digit PIN to secure your withdrawals."}
        </p>
        <form onSubmit={handleUpdatePin} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {hasExistingPin && (
              <div className="space-y-2">
                <Label>Current PIN</Label>
                <Input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="••••"
                  value={pinForm.currentPin}
                  onChange={(e) => setPinForm({ ...pinForm, currentPin: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                  className="bg-muted border-border max-w-[140px]"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label>New PIN</Label>
              <Input
                type="password"
                inputMode="numeric"
                maxLength={4}
                placeholder="••••"
                value={pinForm.newPin}
                onChange={(e) => setPinForm({ ...pinForm, newPin: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                className="bg-muted border-border max-w-[140px]"
              />
            </div>
            <div className="space-y-2">
              <Label>Confirm PIN</Label>
              <Input
                type="password"
                inputMode="numeric"
                maxLength={4}
                placeholder="••••"
                value={pinForm.confirmPin}
                onChange={(e) => setPinForm({ ...pinForm, confirmPin: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                className="bg-muted border-border max-w-[140px]"
              />
            </div>
          </div>
          <Button type="submit" variant="secondary" disabled={savingPin}>
            {savingPin ? "Saving..." : hasExistingPin ? "Update PIN" : "Set PIN"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
