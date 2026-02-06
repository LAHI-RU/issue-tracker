import { Outlet, Link } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="font-semibold tracking-tight">
            Issue Tracker
          </Link>

          <nav className="flex items-center gap-3 text-sm">
            <Link className="text-muted-foreground hover:text-foreground" to="/">
              Dashboard
            </Link>
            <Link className="text-muted-foreground hover:text-foreground" to="/issues/new">
              New Issue
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
