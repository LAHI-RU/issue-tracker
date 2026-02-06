import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { login } from "@/lib/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const { register: rf, handleSubmit, formState } = useForm({
    defaultValues: { email: "", password: "" }
  });

  const onSubmit = async (values) => {
    setServerError("");
    try {
      await login(values);
      navigate("/");
    } catch (err) {
      setServerError(err.message || "Login failed");
    }
  };

  return (
    <div className="mx-auto max-w-sm">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {serverError ? (
            <Alert variant="destructive">
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          ) : null}

          <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                {...rf("email", { required: true })}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Your password"
                autoComplete="current-password"
                {...rf("password", { required: true })}
              />
            </div>

            <Button className="w-full" type="submit" disabled={formState.isSubmitting}>
              {formState.isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="text-sm text-muted-foreground">
            No account?{" "}
            <Link className="underline text-foreground" to="/register">
              Register
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
