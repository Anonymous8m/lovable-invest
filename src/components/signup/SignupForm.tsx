import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { TrendingUp, Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { lovable } from "@/integrations/lovable/index";
import PasswordStrengthIndicator from "./PasswordStrengthIndicator";
import { COUNTRIES, detectUserCountry } from "@/lib/countries";

const SignupForm = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    confirmPassword: "",
    transactionPin: "",
    country: "",
    state: "",
    referralCode: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeAge, setAgreeAge] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [signupError, setSignupError] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    detectUserCountry().then((country) => {
      if (country) setForm((prev) => ({ ...prev, country }));
    });
  }, []);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = "Valid email is required";
    if (!form.phone.trim()) errs.phone = "Phone number is required";
    if (!form.username.trim() || form.username.length < 3) errs.username = "Username must be at least 3 characters";
    if (form.password.length < 6) errs.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords do not match";
    if (!/^\d{4}$/.test(form.transactionPin)) errs.transactionPin = "PIN must be exactly 4 digits";
    if (!form.country) errs.country = "Please select your country";
    if (!agreeTerms) errs.terms = "You must agree to the Terms of Service";
    if (!agreeAge) errs.age = "You must confirm you are at least 18";
    return errs;
  };

  const isFormValid = useMemo(() => {
    return (
      form.fullName.trim() &&
      form.email.trim() &&
      form.phone.trim() &&
      form.username.trim().length >= 3 &&
      form.password.length >= 6 &&
      form.password === form.confirmPassword &&
      /^\d{4}$/.test(form.transactionPin) &&
      form.country &&
      agreeTerms &&
      agreeAge
    );
  }, [form, agreeTerms, agreeAge]);

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
      transactionPin: form.transactionPin,
    });
    setLoading(false);

    if (result.error) {
      setSignupError(result.error);
    } else {
      navigate("/check-email");
    }
  };

  const handleOAuth = async (provider: "google" | "apple") => {
    const { error } = await lovable.auth.signInWithOAuth(provider, {
      redirect_uri: window.location.origin,
    });
    if (error) {
      setSignupError(error instanceof Error ? error.message : String(error));
    }
  };

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const inputClass = "bg-muted/50 border-border h-11 focus:border-primary/50 transition-colors";

  return (
    <div className="flex flex-col min-h-screen lg:min-h-0 overflow-y-auto">
      <div className="flex-1 flex flex-col justify-center px-5 sm:px-8 lg:px-12 xl:px-16 py-8 lg:py-6">
        {/* Mobile logo */}
        <div className="lg:hidden text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-display font-bold text-foreground">InvestFlow</span>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg mx-auto"
        >
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-1">Create Account</h1>
            <p className="text-muted-foreground text-sm">Start your investment journey today</p>
          </div>

          {/* Social Auth */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button
              type="button"
              variant="outline"
              className="h-11 gap-2 text-sm border-border hover:bg-muted/60"
              onClick={() => handleOAuth("google")}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 gap-2 text-sm border-border hover:bg-muted/60"
              onClick={() => handleOAuth("apple")}
            >
              <svg className="w-4 h-4 fill-foreground" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Apple
            </Button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-muted-foreground">or sign up with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {signupError && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {signupError}
              </div>
            )}

            {/* Account Details */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Account Details</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="fullName" className="text-sm">Full Name</Label>
                  <Input id="fullName" value={form.fullName} onChange={(e) => updateField("fullName", e.target.value)} placeholder="John Doe" className={inputClass} />
                  {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm">Email Address</Label>
                  <Input id="email" type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} placeholder="john@example.com" className={inputClass} />
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-sm">Phone Number</Label>
                  <Input id="phone" type="tel" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="+1 555 0123" className={inputClass} />
                  {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="username" className="text-sm">Username</Label>
                  <Input id="username" value={form.username} onChange={(e) => updateField("username", e.target.value)} placeholder="johndoe" className={inputClass} />
                  {errors.username && <p className="text-xs text-destructive">{errors.username}</p>}
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Security</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-sm">Password</Label>
                  <div className="relative">
                    <Input id="password" type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => updateField("password", e.target.value)} placeholder="Min. 6 characters" className={`${inputClass} pr-10`} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                  <PasswordStrengthIndicator password={form.password} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="text-sm">Confirm Password</Label>
                  <div className="relative">
                    <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={form.confirmPassword} onChange={(e) => updateField("confirmPassword", e.target.value)} placeholder="Confirm password" className={`${inputClass} pr-10`} />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
                </div>
              </div>
              <div className="space-y-1.5 max-w-[200px]">
                <Label htmlFor="transactionPin" className="text-sm">Transaction PIN</Label>
                <Input id="transactionPin" type="password" maxLength={4} inputMode="numeric" value={form.transactionPin} onChange={(e) => updateField("transactionPin", e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="4-digit PIN" className={inputClass} />
                {errors.transactionPin && <p className="text-xs text-destructive">{errors.transactionPin}</p>}
              </div>
            </div>

            {/* Location */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Location</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="country" className="text-sm">Country</Label>
                  <select
                    id="country"
                    value={form.country}
                    onChange={(e) => updateField("country", e.target.value)}
                    className="flex h-11 w-full rounded-md border border-border bg-muted/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-foreground transition-colors"
                  >
                    <option value="">Select country</option>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  {errors.country && <p className="text-xs text-destructive">{errors.country}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="state" className="text-sm">State / Region</Label>
                  <Input id="state" value={form.state} onChange={(e) => updateField("state", e.target.value)} placeholder="e.g. California" className={inputClass} />
                </div>
              </div>
            </div>

            {/* Referral */}
            <div className="space-y-1.5">
              <Label htmlFor="referralCode" className="text-sm text-muted-foreground">Referral Code (optional)</Label>
              <Input id="referralCode" value={form.referralCode} onChange={(e) => updateField("referralCode", e.target.value)} placeholder="Enter referral code" className={`${inputClass} max-w-xs`} />
            </div>

            {/* Agreements */}
            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-2.5">
                <Checkbox id="terms" checked={agreeTerms} onCheckedChange={(c) => { setAgreeTerms(!!c); if (errors.terms) setErrors((p) => ({ ...p, terms: "" })); }} className="mt-0.5" />
                <label htmlFor="terms" className="text-sm text-muted-foreground leading-snug cursor-pointer">
                  I agree to the <span className="text-primary hover:underline">Terms of Service</span> and <span className="text-primary hover:underline">Privacy Policy</span>
                </label>
              </div>
              {errors.terms && <p className="text-xs text-destructive ml-6">{errors.terms}</p>}
              <div className="flex items-start gap-2.5">
                <Checkbox id="age" checked={agreeAge} onCheckedChange={(c) => { setAgreeAge(!!c); if (errors.age) setErrors((p) => ({ ...p, age: "" })); }} className="mt-0.5" />
                <label htmlFor="age" className="text-sm text-muted-foreground leading-snug cursor-pointer">
                  I confirm that I am at least 18 years old
                </label>
              </div>
              {errors.age && <p className="text-xs text-destructive ml-6">{errors.age}</p>}
            </div>

            <Button type="submit" className="w-full h-12 text-base glow-primary" size="lg" disabled={loading || !isFormValid}>
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <p className="text-center mt-5 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
          </p>

          {/* Security indicators */}
          <div className="flex items-center justify-center gap-5 mt-6 pt-5 border-t border-border">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="w-3.5 h-3.5 text-primary" />
              <span>Secure encrypted connection</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <span>Privacy protected</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupForm;
