import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import IssueListTable from "@/components/IssueListTable";
import IssueListCards from "@/components/IssueListCards";
import PaginationBar from "@/components/PaginationBar";

import { fetchIssueStats, fetchIssuesList } from "@/lib/issues";

function StatCard({ label, value, loading }) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className="mt-2">
          {loading ? <Skeleton className="h-8 w-14" /> : <p className="text-2xl font-semibold">{value}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

function ListSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="space-y-3">
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-5 w-3/5" />
        <Skeleton className="h-5 w-1/2" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  // UI state
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("ALL");
  const [priority, setPriority] = useState("ALL");
  const [severity, setSeverity] = useState("ALL");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Stats
  const statsQuery = useQuery({
    queryKey: ["issueStats"],
    queryFn: ({ signal }) => fetchIssueStats({ signal })
  });

  // List params (convert ALL to undefined)
  const listParams = useMemo(
    () => ({
      q: q.trim() || undefined,
      status: status === "ALL" ? undefined : status,
      priority: priority === "ALL" ? undefined : priority,
      severity: severity === "ALL" ? undefined : severity,
      page,
      limit,
      sort: "newest"
    }),
    [q, status, priority, severity, page]
  );

  const listQuery = useQuery({
    queryKey: ["issues", listParams],
    queryFn: ({ signal }) => fetchIssuesList({ ...listParams, signal }),
    keepPreviousData: true
  });

  const counts = statsQuery.data?.data?.counts || { OPEN: 0, IN_PROGRESS: 0, RESOLVED: 0, CLOSED: 0 };

  const items = listQuery.data?.data?.items || [];
  const meta = listQuery.data?.meta || { page: 1, totalPages: 1 };

  // Reset to page 1 when filters/search change
  function onFilterChange(fn) {
    fn();
    setPage(1);
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>

      {/* Stats cards */}
      {statsQuery.isError ? (
        <div className="rounded-xl border bg-card p-4 text-sm text-destructive">
          Failed to load stats: {statsQuery.error?.message}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Open" value={counts.OPEN} loading={statsQuery.isLoading} />
        <StatCard label="In Progress" value={counts.IN_PROGRESS} loading={statsQuery.isLoading} />
        <StatCard label="Resolved" value={counts.RESOLVED} loading={statsQuery.isLoading} />
        <StatCard label="Closed" value={counts.CLOSED} loading={statsQuery.isLoading} />
      </div>

      <Separator />

      {/* Controls */}
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search issues by title/description..."
              value={q}
              onChange={(e) => onFilterChange(() => setQ(e.target.value))}
            />
          </div>

          <Select value={status} onValueChange={(v) => onFilterChange(() => setStatus(v))}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="OPEN">Open</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="RESOLVED">Resolved</SelectItem>
              <SelectItem value="CLOSED">Closed</SelectItem>
            </SelectContent>
          </Select>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-2">
            <Select value={priority} onValueChange={(v) => onFilterChange(() => setPriority(v))}>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Priority</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="URGENT">Urgent</SelectItem>
              </SelectContent>
            </Select>

            <Select value={severity} onValueChange={(v) => onFilterChange(() => setSeverity(v))}>
              <SelectTrigger>
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Severity</SelectItem>
                <SelectItem value="MINOR">Minor</SelectItem>
                <SelectItem value="MAJOR">Major</SelectItem>
                <SelectItem value="CRITICAL">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4">
          {listQuery.isError ? (
            <div className="rounded-lg border p-3 text-sm text-destructive">
              Failed to load issues: {listQuery.error?.message}
            </div>
          ) : null}

          {listQuery.isLoading ? (
            <ListSkeleton />
          ) : items.length === 0 ? (
            <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground text-center">
              No issues found. Try changing filters or create a new issue.
            </div>
          ) : (
            <>
              <IssueListTable items={items} />
              <IssueListCards items={items} />

              <PaginationBar
                page={meta.page}
                totalPages={meta.totalPages}
                disabled={listQuery.isFetching}
                onPrev={() => setPage((p) => Math.max(1, p - 1))}
                onNext={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
