import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">Something went wrong</h1>
              <p className="text-muted-foreground mt-2 text-sm">
                An unexpected error occurred. Please try refreshing the page.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Button onClick={() => window.location.reload()} className="gap-2">
                <RefreshCw className="w-4 h-4" /> Refresh Page
              </Button>
              <Button variant="outline" onClick={() => (window.location.href = "/")} className="gap-2">
                <Home className="w-4 h-4" /> Go Home
              </Button>
            </div>
            {this.state.error && (
              <details className="text-left text-xs text-muted-foreground bg-muted rounded-lg p-3">
                <summary className="cursor-pointer font-medium">Error details</summary>
                <pre className="mt-2 whitespace-pre-wrap break-words">{this.state.error.message}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
