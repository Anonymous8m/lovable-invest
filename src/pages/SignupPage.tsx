import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingUp, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

const SignupPage = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [signupError, setSignupError] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = "Valid email is required";
    if (!form.phone.trim()) errs.phone = "Phone number is required";
    if (!form.username.trim() || form.username.length < 3) errs.username = "Username must be at least 3 characters";
    if (form.password.length < 6) errs.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords do not match";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError("");
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    
    setLoading(true);
    const result = await signup({
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      username: form.username,
      password: form.password,
    });
    setLoading(false);
    
    if (result.error) {
      setSignupError(result.error);
    } else {
      navigate("/dashboard");
    }
  };

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const fields = [
    { key: "fullName", label: "Full Name", placeholder: "John Doe", type: "text" },
    { key: "email", label: "Email Address", placeholder: "john@example.com", type: "email" },
    { key: "phone", label: "Phone Number", placeholder: "+1 555 0123", type: "tel" },
    { key: "username", label: "Username", placeholder: "johndoe", type: "text" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-display font-bold text-foreground">InvestFlow</span>
          </Link>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">Create Account</h1>
          <p className="text-muted-foreground">Start your investment journey today</p>
        </div>

        <div className="card-elevated rounded-xl p-8 border border-border">
          <form onSubmit={handleSubmit} className="space-y-4">
            {signupError && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {signupError}
              </div>
            )}

            {fields.map((f) => (
              <div key={f.key} className="space-y-1.5">
                <Label htmlFor={f.key}>{f.label}</Label>
                <Input
                  id={f.key}
                  type={f.type}
                  value={form[f.key as keyof typeof form]}
                  onChange={(e) => updateField(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className="bg-muted border-border"
                />
                {errors[f.key] && <p className="text-xs text-destructive">{errors[f.key]}</p>}
              </div>
            ))}

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  placeholder="Min. 6 characters"
                  className="bg-muted border-border pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={(e) => updateField("confirmPassword", e.target.value)}
                placeholder="Confirm your password"
                className="bg-muted border-border"
              />
              {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
            </div>

            <Button type="submit" className="w-full glow-primary" size="lg" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <p className="text-center mt-6 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;
