import AuthHeroPanel from "@/components/auth/AuthHeroPanel";
import SignupForm from "@/components/signup/SignupForm";
import signupIllustration from "@/assets/signup-illustration.png";
import { TrendingUp, Shield, Users, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const SignupHeroPanel = () => {
  return (
    <div className="hidden lg:flex flex-col justify-between p-10 xl:p-14 bg-gradient-to-br from-primary/15 via-background to-secondary/30 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-[-80px] right-[-80px] w-[260px] h-[260px] rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-[-60px] left-[-60px] w-[200px] h-[200px] rounded-full bg-accent/10 blur-3xl" />

      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex items-center gap-2.5 mb-12">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-display font-bold text-foreground">InvestFlow</span>
        </div>

        <h1 className="text-4xl xl:text-5xl font-display font-bold text-foreground leading-tight mb-4">
          Invest smarter.
          <br />
          <span className="text-gradient">Grow your wealth.</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-md">
          Join thousands of investors building their financial future with our secure, intelligent platform.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="flex justify-center my-8"
      >
        <img src={signupIllustration} alt="Investment growth illustration" className="w-full max-w-xs xl:max-w-sm object-contain drop-shadow-lg" />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }} className="space-y-5">
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Shield, label: "Bank-grade security" },
            { icon: Users, label: "10K+ investors" },
            { icon: BarChart3, label: "Real-time analytics" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-card/60 border border-border/50">
              <Icon className="w-5 h-5 text-primary" />
              <span className="text-xs text-muted-foreground text-center">{label}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="w-4 h-4 text-primary shrink-0" />
          <span>Secure platform trusted by thousands of investors.</span>
        </div>
      </motion.div>
    </div>
  );
};

const SignupPage = () => {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <SignupHeroPanel />
      <SignupForm />
    </div>
  );
};

export default SignupPage;
