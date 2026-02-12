import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import IssueForm from "@/components/IssueForm";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

import { issueCreateSchema, issueUpdateSchema } from "@/lib/validators";
import { createIssue, fetchIssueById, updateIssue } from "@/lib/issues";
import { toastSuccess, toastError } from "@/lib/toast";

export default function IssueFormPage() {
  const { id } = useParams(); // present = edit
  const isEdit = !!id;
  const navigate = useNavigate();
  const qc = useQueryClient();

  const issueQuery = useQuery({
    queryKey: ["issue", id],
    queryFn: ({ signal }) => fetchIssueById(id, { signal }),
    enabled: isEdit
  });

  const issue = issueQuery.data?.data?.issue;

  const form = useForm({
    resolver: zodResolver(isEdit ? issueUpdateSchema : issueCreateSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "MEDIUM",
      severity: "MINOR"
    },
    values: isEdit && issue
      ? {
          title: issue.title || "",
          description: issue.description || "",
          priority: issue.priority || "MEDIUM",
          severity: issue.severity || "MINOR"
        }
      : undefined
  });

  const createMutation = useMutation({
    mutationFn: (payload) => createIssue(payload),
    onSuccess: async (res) => {
      toastSuccess("Issue created");
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["issues"] }),
        qc.invalidateQueries({ queryKey: ["issueStats"] })
      ]);
      const newId = res?.data?.issue?._id;
      navigate(newId ? `/issues/${newId}` : "/");
    },
    onError: (err) => toastError(err.message)
  });

  const updateMutation = useMutation({
    mutationFn: (payload) => updateIssue(id, payload),
    onSuccess: async () => {
      toastSuccess("Issue updated");
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["issues"] }),
        qc.invalidateQueries({ queryKey: ["issueStats"] }),
        qc.invalidateQueries({ queryKey: ["issue", id] })
      ]);
      navigate(`/issues/${id}`);
    },
    onError: (err) => toastError(err.message)
  });

  const submitting = createMutation.isPending || updateMutation.isPending;

  function onSubmit(values) {
    if (isEdit) updateMutation.mutate(values);
    else createMutation.mutate(values);
  }

  if (isEdit && issueQuery.isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isEdit && issueQuery.isError) {
    return (
      <div className="glass bento p-5">
        <p className="text-sm font-medium text-destructive">Failed to load issue</p>
        <p className="mt-1 text-sm text-muted-foreground">{issueQuery.error?.message}</p>
        <div className="mt-4">
          <Button variant="outline" onClick={() => navigate("/")}>
            Back to dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground">
        <Link className="underline" to="/">
          Dashboard
        </Link>{" "}
        / {isEdit ? "Edit Issue" : "New Issue"}
      </div>

      {/* Header */}
      <div className="glass bento p-5 hover-lift flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {isEdit ? "Edit issue" : "Create a new issue"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isEdit
              ? "Update details and keep the team aligned."
              : "Capture problems clearly so they’re easy to fix."}
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(isEdit ? `/issues/${id}` : "/")}>
            Cancel
          </Button>
        </div>
      </div>

      {/* Form */}
      <IssueForm
        form={form}
        mode={isEdit ? "edit" : "create"}
        submitting={submitting}
        onSubmit={form.handleSubmit(onSubmit)}
      />
    </div>
  );
}
