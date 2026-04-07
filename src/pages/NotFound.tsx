import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="text-center max-w-md space-y-6">
        <div className="text-8xl font-display font-bold text-gradient">404</div>
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Page not found</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            The page <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{location.pathname}</code> doesn't exist.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <Button onClick={() => window.history.back()} variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Go Back
          </Button>
          <Link to="/">
            <Button className="gap-2">
              <Home className="w-4 h-4" /> Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
