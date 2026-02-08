import { Outlet, Link, useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import { useEffect } from "react";
import { toastError } from "@/lib/toast";
import { clearToken, getToken } from "@/lib/token";

export default function AppLayout() {
  const navigate = useNavigate();
  const isAuthed = !!getToken();

  useEffect(() => {
    function onExpired() {
      toastError("Session expired. Please login again.");
      navigate("/login");
    }
    window.addEventListener("auth-expired", onExpired);
    return () => window.removeEventListener("auth-expired", onExpired);
  }, [navigate]);

  function logout() {
    clearToken();
    navigate("/login");
  }

  return (
    <div className="min-h-screen">
      {/* Skip link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:shadow"
      >
        Skip to content
      </a>

      {/* Glass header */}
      <header className="sticky top-0 z-40 glass-strong border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-sm font-semibold tracking-tight">Issue Tracker</span>
          </Link>

          {isAuthed ? (
            <nav className="flex items-center gap-2 text-sm">
              <Link
                to="/"
                className="rounded-md px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10"
              >
                Dashboard
              </Link>

              <Link
                to="/issues/new"
                className="rounded-md px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10"
              >
                New Issue
              </Link>

              <button
                onClick={logout}
                className="rounded-md border px-3 py-2 font-medium hover:bg-black/5 dark:hover:bg-white/10"
              >
                Logout
              </button>
            </nav>
          ) : null}
        </div>
      </header>

      <main id="main" className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>

      <Toaster richColors position="top-right" />
    </div>
  );
}
