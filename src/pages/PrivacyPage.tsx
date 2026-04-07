import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const PrivacyPage = () => (
  <div className="min-h-screen bg-background">
    <nav className="flex items-center gap-4 px-6 lg:px-12 py-4 border-b border-border/50">
      <Link to="/">
        <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
      </Link>
      <h1 className="text-lg font-display font-bold text-foreground">Privacy Policy</h1>
    </nav>
    <div className="max-w-3xl mx-auto px-6 py-12 prose prose-invert prose-sm">
      <h1 className="text-3xl font-display font-bold text-foreground">Privacy Policy</h1>
      <p className="text-muted-foreground">Last updated: April 7, 2026</p>

      <h2 className="text-foreground">1. Information We Collect</h2>
      <p className="text-muted-foreground">We collect information you provide during registration (name, email, phone number) and transaction data generated through your use of the Platform.</p>

      <h2 className="text-foreground">2. How We Use Your Information</h2>
      <p className="text-muted-foreground">Your information is used to provide and improve our services, process transactions, verify identity, and communicate important updates about your account.</p>

      <h2 className="text-foreground">3. Data Security</h2>
      <p className="text-muted-foreground">We implement industry-standard security measures including encryption, secure servers, and access controls to protect your personal information.</p>

      <h2 className="text-foreground">4. Data Sharing</h2>
      <p className="text-muted-foreground">We do not sell your personal information. We may share data with service providers who assist in operating the Platform, or when required by law.</p>

      <h2 className="text-foreground">5. Cookies</h2>
      <p className="text-muted-foreground">We use essential cookies for authentication and session management. No third-party tracking cookies are used.</p>

      <h2 className="text-foreground">6. Your Rights</h2>
      <p className="text-muted-foreground">You may request access to, correction of, or deletion of your personal data by contacting support. Account deletion will result in permanent removal of your data.</p>

      <h2 className="text-foreground">7. Data Retention</h2>
      <p className="text-muted-foreground">We retain your data for as long as your account is active and for a reasonable period afterward for legal and regulatory compliance.</p>

      <h2 className="text-foreground">8. Changes to This Policy</h2>
      <p className="text-muted-foreground">We may update this Privacy Policy periodically. We will notify you of significant changes through the Platform.</p>

      <h2 className="text-foreground">9. Contact</h2>
      <p className="text-muted-foreground">For privacy-related inquiries, please contact support through the Platform.</p>
    </div>
  </div>
);

export default PrivacyPage;
