import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { User, Mail, Phone, Lock, Camera } from "lucide-react";

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    username: user?.username || "",
  });
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(form);
    toast.success("Profile updated successfully");
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    toast.success("Password changed successfully");
    setPasswordForm({ current: "", newPassword: "", confirm: "" });
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
            {user?.fullName?.charAt(0) || "U"}
          </div>
          <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:opacity-90 transition">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <div>
          <h2 className="text-lg font-display font-semibold text-foreground">{user?.fullName}</h2>
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
              <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="bg-muted border-border" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><User className="w-3.5 h-3.5" /> Username</Label>
              <Input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="bg-muted border-border" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> Email</Label>
              <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-muted border-border" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> Phone</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="bg-muted border-border" />
            </div>
          </div>
          <Button type="submit" className="glow-primary">Save Changes</Button>
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
          <div className="space-y-2">
            <Label>Current Password</Label>
            <Input type="password" value={passwordForm.current} onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })} className="bg-muted border-border" />
          </div>
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
    </div>
  );
};

export default ProfilePage;
