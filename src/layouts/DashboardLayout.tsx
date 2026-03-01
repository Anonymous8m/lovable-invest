import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, Search } from "lucide-react";

const DashboardLayout = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center justify-between border-b border-border px-4 lg:px-6 bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
              <div className="hidden md:flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                  placeholder="Search..."
                  className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground w-48"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative text-muted-foreground hover:text-foreground">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
              </button>
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
                {user?.fullName?.charAt(0) || "U"}
              </div>
            </div>
          </header>
          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
