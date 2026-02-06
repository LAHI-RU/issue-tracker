import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm">
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Login</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Real login form comes next step.
        </p>

        <div className="mt-4 text-sm">
          <Link className="underline" to="/register">Create an account</Link>
        </div>

        <div className="mt-6">
          <button
            className="w-full rounded-md bg-black px-3 py-2 text-sm font-medium text-white"
            onClick={() => {
              // TEMP ONLY
              localStorage.setItem("token", "dev-token");
              window.location.href = "/";
            }}
          >
            Dev Login (temporary)
          </button>
        </div>
      </div>
    </div>
  );
}
