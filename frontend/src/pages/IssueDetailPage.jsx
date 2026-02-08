import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import StatusChip from "@/components/StatusChip";
import PriorityChip from "@/components/PriorityChip";
import ConfirmDialog from "@/components/ConfirmDialog";

import { fetchIssueById, updateIssueStatus } from "@/lib/issues";

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

  const [confirm, setConfirm] = useState({ open: false, status: null });

  const issueQuery = useQuery({
    queryKey: ["issue", id],
    queryFn: ({ signal }) => fetchIssueById(id, { signal })
  });

  const issue = issueQuery.data?.data?.issue;

  const canResolve = issue?.status && !["RESOLVED", "CLOSED"].includes(issue.status);
  const canClose = issue?.status && issue.status !== "CLOSED";

  const mutation = useMutation({
    mutationFn: ({ status }) => updateIssueStatus(id, status),
    onSuccess: async () => {
      // Refresh detail + list + stats
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["issue", id] }),
        qc.invalidateQueries({ queryKey: ["issues"] }),
        qc.invalidateQueries({ queryKey: ["issueStats"] })
      ]);
      setConfirm({ open: false, status: null });
    }
  });

  const confirmTitle = useMemo(() => {
    if (confirm.status === "RESOLVED") return "Mark issue as Resolved?";
    if (confirm.status === "CLOSED") return "Mark issue as Closed?";
    return "Confirm";
  }, [confirm.status]);

  const confirmDesc = useMemo(() => {
    if (confirm.status === "RESOLVED") return "This will set status to RESOLVED. You can still close it later.";
    if (confirm.status === "CLOSED") return "Closing is final. Closed issues cannot be reopened.";
    return "";
  }, [confirm.status]);

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
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="rounded-xl border bg-card p-4 text-sm text-muted-foreground">
        Issue not found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
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

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate(`/issues/${id}/edit`)}>
            Edit
          </Button>

          <Button
            variant="outline"
            disabled={!canResolve || mutation.isPending}
            onClick={() => setConfirm({ open: true, status: "RESOLVED" })}
          >
            Mark Resolved
          </Button>

          <Button
            variant="destructive"
            disabled={!canClose || mutation.isPending}
            onClick={() => setConfirm({ open: true, status: "CLOSED" })}
          >
            Close
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

      <ConfirmDialog
        open={confirm.open}
        title={confirmTitle}
        description={confirmDesc}
        confirmText={confirm.status === "CLOSED" ? "Yes, close it" : "Yes, mark resolved"}
        loading={mutation.isPending}
        onCancel={() => setConfirm({ open: false, status: null })}
        onConfirm={() => mutation.mutate({ status: confirm.status })}
      />
    </div>
  );
}
