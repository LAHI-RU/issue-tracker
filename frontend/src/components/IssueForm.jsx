import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function IssueForm({
  form,
  mode = "create",
  submitting = false,
  onSubmit
}) {
  const {
    register,
    setValue,
    watch,
    formState: { errors }
  } = form;

  const priority = watch("priority") || "MEDIUM";
  const severity = watch("severity") || "MEDIUM";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Title */}
      <div className="glass bento p-5 hover-lift">
        <label className="text-sm font-medium">Title</label>
        <Input
          className="mt-2"
          placeholder="e.g., Login button not working on Safari"
          {...register("title")}
          aria-invalid={!!errors.title}
        />
        {errors.title ? (
          <p className="mt-2 text-xs text-destructive">{errors.title.message}</p>
        ) : (
          <p className="mt-2 text-xs text-muted-foreground">
            Keep it short and descriptive.
          </p>
        )}
      </div>

      {/* Description */}
      <div className="glass bento p-5 hover-lift">
        <label className="text-sm font-medium">Description</label>
        <Textarea
          className="mt-2 min-h-[140px]"
          placeholder="Describe the issue, steps to reproduce, and expected behavior..."
          {...register("description")}
          aria-invalid={!!errors.description}
        />
        {errors.description ? (
          <p className="mt-2 text-xs text-destructive">{errors.description.message}</p>
        ) : (
          <p className="mt-2 text-xs text-muted-foreground">
            Helpful details make issues easier to fix.
          </p>
        )}
      </div>

      {/* Priority + Severity (bento grid) */}
      <div className="grid gap-4 md:grid-cols-12">
        <div className="md:col-span-6">
          <div className="glass bento p-5 hover-lift">
            <label className="text-sm font-medium">Priority</label>
            <div className="mt-2">
              <Select value={priority} onValueChange={(v) => setValue("priority", v)}>
                <SelectTrigger aria-label="Select priority">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Priority reflects business urgency.
            </p>
          </div>
        </div>

        <div className="md:col-span-6">
          <div className="glass bento p-5 hover-lift">
            <label className="text-sm font-medium">Severity</label>
            <div className="mt-2">
              <Select value={severity} onValueChange={(v) => setValue("severity", v)}>
                <SelectTrigger aria-label="Select severity">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Severity reflects impact to users/system.
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="glass bento p-5 hover-lift flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          {mode === "edit"
            ? "Update the issue fields and save changes."
            : "Create a new issue and track it on the dashboard."}
        </p>

        <Button type="submit" disabled={submitting} className="hover-lift">
          {submitting
            ? mode === "edit"
              ? "Saving..."
              : "Creating..."
            : mode === "edit"
            ? "Save changes"
            : "Create issue"}
        </Button>
      </div>
    </form>
  );
}
