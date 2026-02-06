import { Link } from "react-router-dom";

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-sm">
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Register</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Real register form comes next step.
        </p>

        <div className="mt-4 text-sm">
          <Link className="underline" to="/login">Already have an account?</Link>
        </div>
      </div>
    </div>
  );
}
