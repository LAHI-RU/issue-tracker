import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import IssueForm from "@/components/IssueForm";
import { fetchIssueById, createIssue, updateIssue } from "@/lib/issues";
import { toastSuccess, toastError } from "@/lib/toast";

export default function IssueFormPage() {
  const { id } = useParams();
  const mode = id ? "edit" : "create";
  const navigate = useNavigate();
  const qc = useQueryClient();

  const issueQuery = useQuery({
    queryKey: ["issue", id],
    enabled: !!id,
    queryFn: ({ signal }) => fetchIssueById(id, { signal })
  });

  const initialValues = useMemo(() => {
    const issue = issueQuery.data?.data?.issue;
    if (!issue) return null;

    return {
      title: issue.title || "",
      description: issue.description || "",
      priority: issue.priority || "NONE",
      severity: issue.severity || "NONE"
    };
  }, [issueQuery.data]);

  const createMut = useMutation({
    mutationFn: (payload) => createIssue(payload),
    onSuccess: async (res) => {
      const created = res.data.issue;
      toastSuccess("Issue created");
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["issues"] }),
        qc.invalidateQueries({ queryKey: ["issueStats"] })
      ]);
      navigate(`/issues/${created._id}`);
    },
    onError: (err) => toastError(err.message)
  });

  const updateMut = useMutation({
    mutationFn: (payload) => updateIssue(id, payload),
    onSuccess: async (res) => {
      const updated = res.data.issue;
      toastSuccess("Issue updated");
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["issues"] }),
        qc.invalidateQueries({ queryKey: ["issueStats"] }),
        qc.invalidateQueries({ queryKey: ["issue", id] })
      ]);
      navigate(`/issues/${updated._id}`);
    },
    onError: (err) => toastError(err.message)
  });

  // Loading in edit mode
  if (mode === "edit" && issueQuery.isLoading) {
    return <div className="text-sm text-muted-foreground">Loading issue...</div>;
  }

  if (mode === "edit" && issueQuery.isError) {
    return (
      <div className="rounded-xl border bg-card p-4 text-sm text-destructive">
        Failed to load issue: {issueQuery.error?.message}
      </div>
    );
  }

  const submitting = createMut.isPending || updateMut.isPending;

  return (
    <IssueForm
      mode={mode}
      initialValues={initialValues}
      submitting={submitting}
      onSubmit={(payload) => (mode === "edit" ? updateMut.mutateAsync(payload) : createMut.mutateAsync(payload))}
    />
  );
}
