import SignupHeroPanel from "@/components/signup/SignupHeroPanel";
import SignupForm from "@/components/signup/SignupForm";

const SignupPage = () => {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <SignupHeroPanel />
      <SignupForm />
    </div>
  );
};

export default SignupPage;
