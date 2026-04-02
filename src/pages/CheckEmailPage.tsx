import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TrendingUp, Mail, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const CheckEmailPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-display font-bold text-foreground">InvestFlow</span>
        </Link>

        <div className="card-elevated rounded-xl border border-border p-8 space-y-5">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground">Verify your email</h1>
          <p className="text-muted-foreground text-sm">
            We've sent a confirmation email to your inbox. Please click the link in the email to verify your account before signing in.
          </p>
          <p className="text-xs text-muted-foreground">
            Didn't receive it? Check your spam folder or try signing up again.
          </p>
          <Link to="/login">
            <Button variant="outline" className="gap-2 mt-2">
              <ArrowLeft className="w-4 h-4" /> Go to Sign In
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default CheckEmailPage;
