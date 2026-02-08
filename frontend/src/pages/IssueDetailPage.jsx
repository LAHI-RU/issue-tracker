import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import StatusChip from "@/components/StatusChip";
import PriorityChip from "@/components/PriorityChip";
import ConfirmDialog from "@/components/ConfirmDialog";

import { fetchIssueById, updateIssueStatus, deleteIssue } from "@/lib/issues";
import { toastSuccess, toastError } from "@/lib/toast";

function formatDateTime(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return "—";
  }
}

export default function IssueDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  // one dialog for status, one for delete
  const [confirmStatus, setConfirmStatus] = useState({ open: false, status: null });
  const [confirmDelete, setConfirmDelete] = useState(false);

  const issueQuery = useQuery({
    queryKey: ["issue", id],
    queryFn: ({ signal }) => fetchIssueById(id, { signal })
  });

  const issue = issueQuery.data?.data?.issue;

  const canResolve = issue?.status && !["RESOLVED", "CLOSED"].includes(issue.status);
  const canClose = issue?.status && issue.status !== "CLOSED";

  const statusMutation = useMutation({
    mutationFn: ({ status }) => updateIssueStatus(id, status),
    onSuccess: async () => {
      toastSuccess("Status updated");
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["issue", id] }),
        qc.invalidateQueries({ queryKey: ["issues"] }),
        qc.invalidateQueries({ queryKey: ["issueStats"] })
      ]);
      setConfirmStatus({ open: false, status: null });
    },
    onError: (err) => toastError(err.message)
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteIssue(id),
    onSuccess: async () => {
      toastSuccess("Issue deleted");
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["issues"] }),
        qc.invalidateQueries({ queryKey: ["issueStats"] })
      ]);
      setConfirmDelete(false);
      navigate("/");
    },
    onError: (err) => toastError(err.message)
  });

  const confirmTitle = useMemo(() => {
    if (confirmStatus.status === "RESOLVED") return "Mark issue as Resolved?";
    if (confirmStatus.status === "CLOSED") return "Mark issue as Closed?";
    return "Confirm";
  }, [confirmStatus.status]);

  const confirmDesc = useMemo(() => {
    if (confirmStatus.status === "RESOLVED")
      return "This will set status to RESOLVED. You can still close it later.";
    if (confirmStatus.status === "CLOSED")
      return "Closing is final. Closed issues cannot be reopened.";
    return "";
  }, [confirmStatus.status]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toastSuccess("Link copied");
    } catch {
      toastError("Failed to copy link");
    }
  }

  if (issueQuery.isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (issueQuery.isError) {
    return (
      <div className="rounded-xl border bg-card p-4 text-sm text-destructive">
        Failed to load issue: {issueQuery.error?.message}
        <div className="mt-3">
          <Button variant="outline" size="sm" onClick={() => navigate("/")}>
            Back to dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="rounded-xl border bg-card p-4 text-sm text-muted-foreground">
        Issue not found.
        <div className="mt-3">
          <Button variant="outline" size="sm" onClick={() => navigate("/")}>
            Back to dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3 ">
        <div>
          <div className="text-sm text-muted-foreground">
            <Link className="underline" to="/">Dashboard</Link> / Issue
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">{issue.title}</h1>

          <div className="mt-2 flex flex-wrap gap-2">
            <StatusChip status={issue.status} />
            <PriorityChip priority={issue.priority} />
          </div>

          <div className="mt-2 text-sm text-muted-foreground">
            Created: {formatDateTime(issue.createdAt)}
            {issue.updatedAt ? ` • Updated: ${formatDateTime(issue.updatedAt)}` : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 overflow-x-auto">
          <Button variant="outline" onClick={copyLink}>
            Copy link
          </Button>

          <Button variant="outline" onClick={() => navigate(`/issues/${id}/edit`)}>
            Edit
          </Button>

          <Button
            variant="outline"
            disabled={!canResolve || statusMutation.isPending}
            onClick={() => setConfirmStatus({ open: true, status: "RESOLVED" })}
          >
            Mark Resolved
          </Button>

          <Button
            variant="destructive"
            disabled={!canClose || statusMutation.isPending}
            onClick={() => setConfirmStatus({ open: true, status: "CLOSED" })}
          >
            Close
          </Button>

          <Button
            variant="destructive"
            disabled={deleteMutation.isPending}
            onClick={() => setConfirmDelete(true)}
          >
            Delete
          </Button>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-4 space-y-3">
          <div>
            <p className="text-sm font-medium">Description</p>
            <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
              {issue.description}
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Severity</p>
              <p className="mt-1 text-sm font-medium">{issue.severity || "—"}</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Priority</p>
              <p className="mt-1 text-sm font-medium">{issue.priority || "—"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status confirm */}
      <ConfirmDialog
        open={confirmStatus.open}
        title={confirmTitle}
        description={confirmDesc}
        confirmText={confirmStatus.status === "CLOSED" ? "Yes, close it" : "Yes, mark resolved"}
        loading={statusMutation.isPending}
        onCancel={() => setConfirmStatus({ open: false, status: null })}
        onConfirm={() => statusMutation.mutate({ status: confirmStatus.status })}
      />

      {/* Delete confirm */}
      <ConfirmDialog
        open={confirmDelete}
        title="Delete this issue?"
        description="This action cannot be undone."
        confirmText="Yes, delete"
        loading={deleteMutation.isPending}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => deleteMutation.mutate()}
      />
    </div>
  );
}
