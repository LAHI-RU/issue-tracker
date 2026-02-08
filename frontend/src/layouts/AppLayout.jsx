import { Outlet, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth";
import { Toaster } from "sonner";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toastError } from "@/lib/toast";

export default function AppLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    function onExpired() {
      toastError("Session expired. Please login again.");
      navigate("/login");
    }

    window.addEventListener("auth-expired", onExpired);
    return () => window.removeEventListener("auth-expired", onExpired);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:shadow"
      >
        Skip to content
      </a>

      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="font-semibold tracking-tight">
            Issue Tracker
          </Link>

          <nav className="flex items-center gap-2">
            <Link
              className="text-sm text-muted-foreground hover:text-foreground"
              to="/"
            >
              Dashboard
            </Link>
            <Link
              className="text-sm text-muted-foreground hover:text-foreground"
              to="/issues/new"
            >
              New Issue
            </Link>

            <Button
              variant="outline"
              size="sm"
              className="ml-2"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Logout
            </Button>
          </nav>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-6xl px-4 py-6">
        <Toaster richColors position="top-right" />
        <Outlet />
      </main>
    </div>
  );
}
