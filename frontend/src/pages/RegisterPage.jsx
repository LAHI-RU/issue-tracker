import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { register as registerUser } from "@/lib/auth";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const { register: rf, handleSubmit, formState, watch } = useForm({
    defaultValues: { name: "", email: "", password: "", confirm: "" }
  });

  const onSubmit = async (values) => {
    setServerError("");

    if (values.password !== values.confirm) {
      setServerError("Passwords do not match");
      return;
    }

    try {
      await registerUser({ name: values.name || undefined, email: values.email, password: values.password });
      navigate("/");
    } catch (err) {
      setServerError(err.message || "Registration failed");
    }
  };

  const password = watch("password");

  return (
    <div className="mx-auto max-w-sm">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Register</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {serverError ? (
            <Alert variant="destructive">
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          ) : null}

          <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-1">
              <Label htmlFor="name">Name (optional)</Label>
              <Input id="name" placeholder="Your name" {...rf("name")} />
            </div>

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
                placeholder="Password123"
                autoComplete="new-password"
                {...rf("password", { required: true, minLength: 8 })}
              />
              <p className="text-xs text-muted-foreground">
                Must include uppercase, lowercase, and a number.
              </p>
            </div>

            <div className="space-y-1">
              <Label htmlFor="confirm">Confirm password</Label>
              <Input
                id="confirm"
                type="password"
                placeholder="Repeat password"
                autoComplete="new-password"
                {...rf("confirm", { required: true, validate: (v) => v === password || "Passwords do not match" })}
              />
            </div>

            <Button className="w-full" type="submit" disabled={formState.isSubmitting}>
              {formState.isSubmitting ? "Creating..." : "Create account"}
            </Button>
          </form>

          <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link className="underline text-foreground" to="/login">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
