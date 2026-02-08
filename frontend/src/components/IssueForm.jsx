import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"];
const SEVERITIES = ["MINOR", "MAJOR", "CRITICAL"];

export default function IssueForm({
  mode, // "create" | "edit"
  initialValues,
  onSubmit,
  submitting
}) {
  const [serverError, setServerError] = useState("");

  const defaults = useMemo(
    () => ({
      title: "",
      description: "",
      priority: "NONE",
      severity: "NONE",
      ...(initialValues || {})
    }),
    [initialValues]
  );

  const { register, handleSubmit, setValue, reset, formState, watch } = useForm({
    defaultValues: defaults
  });

  // When initialValues arrive (edit mode), update form
  useEffect(() => {
    reset(defaults);
  }, [defaults, reset]);

  const priority = watch("priority");
  const severity = watch("severity");

  const submit = async (values) => {
    setServerError("");

    // client-side sanitize: "NONE" -> undefined
    const payload = {
      title: values.title.trim(),
      description: values.description.trim(),
      priority: values.priority === "NONE" ? undefined : values.priority,
      severity: values.severity === "NONE" ? undefined : values.severity
    };

    try {
      await onSubmit(payload);
    } catch (err) {
      setServerError(err.message || "Request failed");
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>{mode === "edit" ? "Edit Issue" : "Create Issue"}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {serverError ? (
          <Alert variant="destructive">
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        ) : null}

        <form className="space-y-4" onSubmit={handleSubmit(submit)}>
          <div className="space-y-1">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Short, clear issue title"
              {...register("title", { required: "Title is required", minLength: { value: 3, message: "Min 3 chars" } })}
            />
            {formState.errors.title ? (
              <p className="text-xs text-destructive">{formState.errors.title.message}</p>
            ) : null}
          </div>

          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={6}
              placeholder="Describe the issue clearly (steps, expected vs actual, impact)"
              {...register("description", {
                required: "Description is required",
                minLength: { value: 10, message: "Min 10 chars" }
              })}
            />
            {formState.errors.description ? (
              <p className="text-xs text-destructive">{formState.errors.description.message}</p>
            ) : null}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <Label>Priority (optional)</Label>
              <Select
                value={priority}
                onValueChange={(v) => setValue("priority", v, { shouldDirty: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE">None</SelectItem>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label>Severity (optional)</Label>
              <Select
                value={severity}
                onValueChange={(v) => setValue("severity", v, { shouldDirty: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE">None</SelectItem>
                  {SEVERITIES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : mode === "edit" ? "Save changes" : "Create issue"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
