import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TrendingUp, Shield, BarChart3, Zap, ArrowRight, UserPlus, Wallet, PiggyBank, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface Plan {
  id: string;
  name: string;
  roi: number;
  duration: string;
  min_amount: number;
  max_amount: number;
}

const Index = () => {
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    supabase.from("investment_plans").select("*").order("min_amount").then(({ data }) => {
      if (data) setPlans(data);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 lg:px-12 py-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-display font-bold text-foreground">InvestFlow</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">Sign In</Button>
          </Link>
          <Link to="/signup">
            <Button className="glow-primary">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 lg:px-12 py-20 lg:py-32 max-w-5xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
            <Zap className="w-4 h-4" /> Smart investing made simple
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-foreground leading-tight">
            Grow your wealth with{" "}
            <span className="text-gradient">confidence</span>
          </h1>
          <p className="text-lg text-muted-foreground mt-6 max-w-2xl mx-auto">
            Access professionally managed investment plans with guaranteed returns. Start building your financial future today.
          </p>
          <div className="flex items-center justify-center gap-4 mt-10">
            <Link to="/signup">
              <Button size="lg" className="glow-primary text-lg px-8">
                Start Investing <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="text-lg px-8 border-border text-foreground hover:bg-muted">
                View Dashboard
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* How it Works */}
      <section className="px-6 lg:px-12 py-20 border-t border-border/50">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">How It Works</h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">Three simple steps to start earning</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: UserPlus, step: "01", title: "Create Account", desc: "Sign up in under 2 minutes with just your email and a secure password." },
              { icon: Wallet, step: "02", title: "Fund Your Wallet", desc: "Deposit crypto via Bitcoin, Ethereum, or USDT. Verified instantly by our team." },
              { icon: PiggyBank, step: "03", title: "Invest & Earn", desc: "Pick a plan, invest, and watch your returns grow. Withdraw anytime after maturity." },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center"
              >
                <div className="text-5xl font-display font-bold text-primary/10 mb-2">{item.step}</div>
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-display font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 lg:px-12 py-20 border-t border-border/50">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Shield, title: "Secure Platform", desc: "Bank-grade encryption and security protocols protect your investments around the clock." },
            { icon: BarChart3, title: "High Returns", desc: "Our managed plans deliver competitive ROI with transparent tracking and reporting." },
            { icon: Zap, title: "Instant Access", desc: "Start investing in minutes. Manage your portfolio from anywhere, anytime." },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.1 }}
              className="card-elevated rounded-xl border border-border p-8 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-display font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Live Plans */}
      {plans.length > 0 && (
        <section className="px-6 lg:px-12 py-20 border-t border-border/50">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">Investment Plans</h2>
              <p className="text-muted-foreground mt-3 max-w-lg mx-auto">Choose a plan that fits your goals</p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan, i) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="card-elevated rounded-xl border border-border p-6 space-y-4"
                >
                  <h3 className="text-lg font-display font-semibold text-foreground">{plan.name}</h3>
                  <div className="text-3xl font-display font-bold text-gradient">{plan.roi}% ROI</div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between"><span>Duration</span><span className="text-foreground font-medium">{plan.duration}</span></div>
                    <div className="flex justify-between"><span>Min Investment</span><span className="text-foreground font-medium">${plan.min_amount.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>Max Investment</span><span className="text-foreground font-medium">${plan.max_amount.toLocaleString()}</span></div>
                  </div>
                  <Link to="/signup">
                    <Button className="w-full mt-2">Get Started</Button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="px-6 lg:px-12 py-20 border-t border-border/50">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">Trusted by Investors</h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">See what our community has to say</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Michael R.", text: "InvestFlow made it incredibly easy to start investing. My first plan matured right on time with the promised returns.", avatar: "M" },
              { name: "Sarah K.", text: "The platform is transparent and reliable. I've been using it for months and withdrawals are always smooth.", avatar: "S" },
              { name: "David L.", text: "Great customer support and solid returns. The dashboard makes tracking everything simple and intuitive.", avatar: "D" },
            ].map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-elevated rounded-xl border border-border p-6 space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">{t.avatar}</div>
                  <p className="font-display font-semibold text-foreground">{t.name}</p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">"{t.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 lg:px-12 py-20 border-t border-border/50">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">Frequently Asked Questions</h2>
          </motion.div>
          <Accordion type="single" collapsible className="space-y-3">
            {[
              { q: "How do I start investing?", a: "Create an account, deposit funds using your preferred cryptocurrency, choose an investment plan, and your returns will begin accruing immediately." },
              { q: "What is the minimum investment?", a: "The minimum investment varies by plan, starting from as low as $1,000. Check our plans section for specific details." },
              { q: "How do withdrawals work?", a: "Submit a withdrawal request from your dashboard. Our team verifies and processes it within 1-3 business days to your crypto wallet." },
              { q: "Is my investment safe?", a: "We use bank-grade encryption and security protocols. All funds are managed through secure, audited processes with full transparency." },
              { q: "What happens when my investment matures?", a: "Your principal plus earned ROI is automatically credited to your account balance. You can reinvest or withdraw the funds." },
            ].map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="card-elevated rounded-xl border border-border px-5">
                <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 lg:px-12 py-20 border-t border-border/50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center card-elevated rounded-2xl border border-border p-10 lg:p-14"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">Ready to grow your wealth?</h2>
          <p className="text-muted-foreground mt-4 max-w-md mx-auto">Join thousands of investors already earning with InvestFlow. Start your journey today.</p>
          <Link to="/signup">
            <Button size="lg" className="glow-primary text-lg px-10 mt-8">
              Create Free Account <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="px-6 lg:px-12 py-8 border-t border-border/50 text-center text-sm text-muted-foreground">
        © 2026 InvestFlow. All rights reserved.
      </footer>
    </div>
  );
};

export default Index;
