import { Outlet, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth";

export default function AppLayout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="font-semibold tracking-tight">
            Issue Tracker
          </Link>

          <nav className="flex items-center gap-2">
            <Link className="text-sm text-muted-foreground hover:text-foreground" to="/">
              Dashboard
            </Link>
            <Link className="text-sm text-muted-foreground hover:text-foreground" to="/issues/new">
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

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
