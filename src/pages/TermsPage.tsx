import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const TermsPage = () => (
  <div className="min-h-screen bg-background">
    <nav className="flex items-center gap-4 px-6 lg:px-12 py-4 border-b border-border/50">
      <Link to="/">
        <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
      </Link>
      <h1 className="text-lg font-display font-bold text-foreground">Terms of Service</h1>
    </nav>
    <div className="max-w-3xl mx-auto px-6 py-12 prose prose-invert prose-sm">
      <h1 className="text-3xl font-display font-bold text-foreground">Terms of Service</h1>
      <p className="text-muted-foreground">Last updated: April 7, 2026</p>

      <h2 className="text-foreground">1. Acceptance of Terms</h2>
      <p className="text-muted-foreground">By accessing or using InvestFlow ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Platform.</p>

      <h2 className="text-foreground">2. Eligibility</h2>
      <p className="text-muted-foreground">You must be at least 18 years old and have the legal capacity to enter into a binding agreement to use the Platform.</p>

      <h2 className="text-foreground">3. Account Registration</h2>
      <p className="text-muted-foreground">You agree to provide accurate, current, and complete information during registration and to keep your account credentials secure. You are responsible for all activity under your account.</p>

      <h2 className="text-foreground">4. Investment Risks</h2>
      <p className="text-muted-foreground">All investments carry risk. Past performance is not indicative of future results. You acknowledge that you may lose some or all of your invested capital.</p>

      <h2 className="text-foreground">5. Deposits and Withdrawals</h2>
      <p className="text-muted-foreground">Deposits are credited after admin verification. Withdrawals are subject to review and processing times of 1-3 business days. The Platform reserves the right to delay or refuse transactions that appear fraudulent.</p>

      <h2 className="text-foreground">6. Prohibited Activities</h2>
      <p className="text-muted-foreground">You may not use the Platform for money laundering, fraud, or any illegal activity. Accounts involved in such activities will be terminated immediately.</p>

      <h2 className="text-foreground">7. Limitation of Liability</h2>
      <p className="text-muted-foreground">The Platform is provided "as is" without warranties of any kind. InvestFlow shall not be liable for any indirect, incidental, or consequential damages arising from use of the Platform.</p>

      <h2 className="text-foreground">8. Changes to Terms</h2>
      <p className="text-muted-foreground">We reserve the right to modify these terms at any time. Continued use of the Platform after changes constitutes acceptance of the new terms.</p>

      <h2 className="text-foreground">9. Contact</h2>
      <p className="text-muted-foreground">For questions about these Terms, please contact support through the Platform.</p>
    </div>
  </div>
);

export default TermsPage;
