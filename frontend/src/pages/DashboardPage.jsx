import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

import StatusChip from "@/components/StatusChip";
import PriorityChip from "@/components/PriorityChip";

import { fetchIssueStats, fetchIssues } from "@/lib/issues";
import { useDebouncedValue } from "@/lib/useDebouncedValue";

function formatDateTime(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return "—";
  }
}

export default function DashboardPage() {
  // UI state
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("ALL");
  const [priority, setPriority] = useState("ALL");
  const [severity, setSeverity] = useState("ALL");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Debounced query for search (already built in your previous step)
  const debouncedQ = useDebouncedValue(q, 350);

  // Reset to page 1 when query or filters change
  // (keeps pagination correct)
  useMemo(() => {
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ, status, priority, severity, sort]);

  // Stats query
  const statsQuery = useQuery({
    queryKey: ["issueStats"],
    queryFn: ({ signal }) => fetchIssueStats({ signal }),
  });

  // List query with cancellation
  const issuesQuery = useQuery({
    queryKey: [
      "issues",
      { q: debouncedQ, status, priority, severity, sort, page, limit },
    ],
    queryFn: ({ signal }) =>
      fetchIssues({
        q: debouncedQ,
        status: status === "ALL" ? undefined : status,
        priority: priority === "ALL" ? undefined : priority,
        severity: severity === "ALL" ? undefined : severity,
        sort,
        page,
        limit,
        signal,
      }),
    keepPreviousData: true,
  });

  const stats =
    statsQuery.data?.data?.stats ||
    statsQuery.data?.data?.counts ||
    statsQuery.data?.stats ||
    statsQuery.data?.counts;
  const issueData = issuesQuery.data?.data || issuesQuery.data; // supports either shape
  const issueMeta = issuesQuery.data?.meta || issuesQuery.data?.data?.meta;
  const items = issueData?.items || issueData?.issues || [];
  const total = issueMeta?.total ?? issueData?.total ?? 0;
  const totalPages =
    issueMeta?.totalPages ?? issueData?.totalPages ?? Math.max(1, Math.ceil(total / limit));

  const showingText = useMemo(() => {
    if (issuesQuery.isLoading) return "Loading…";
    return `Showing ${items.length} item(s)`;
  }, [issuesQuery.isLoading, items.length]);

  const searchingText = useMemo(() => {
    if (!q.trim()) return "—";
    return q.trim();
  }, [q]);

  return (
    <div className="space-y-6">
      {/* Title row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track issues, update status, and keep work moving.
          </p>
        </div>

        <Link to="/issues/new">
          <Button className="hover-lift">Create issue</Button>
        </Link>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid gap-4 md:grid-cols-12">
        <div className="md:col-span-3">
          <div className="glass bento hover-lift p-5">
            <p className="text-sm text-muted-foreground">Open</p>
            <p className="mt-2 text-3xl font-semibold">
              {statsQuery.isLoading ? "—" : (stats?.OPEN ?? 0)}
            </p>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="glass bento hover-lift p-5">
            <p className="text-sm text-muted-foreground">In Progress</p>
            <p className="mt-2 text-3xl font-semibold">
              {statsQuery.isLoading ? "—" : (stats?.IN_PROGRESS ?? 0)}
            </p>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="glass bento hover-lift p-5">
            <p className="text-sm text-muted-foreground">Resolved</p>
            <p className="mt-2 text-3xl font-semibold">
              {statsQuery.isLoading ? "—" : (stats?.RESOLVED ?? 0)}
            </p>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="glass bento hover-lift p-5">
            <p className="text-sm text-muted-foreground">Closed</p>
            <p className="mt-2 text-3xl font-semibold">
              {statsQuery.isLoading ? "—" : (stats?.CLOSED ?? 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Main panel with AI ring (visual only) */}
      <div className="ai-ring">
        <div className="glass bento p-4">
          {/* Controls */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <Input
                aria-label="Search issues"
                placeholder="Search issues by title/description..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger
                  aria-label="Filter by status"
                  className="w-[160px]"
                >
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger
                  aria-label="Filter by priority"
                  className="w-[160px]"
                >
                  <SelectValue placeholder="All Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Priority</SelectItem>
                  <SelectItem value="MINOR">Minor</SelectItem>
                  <SelectItem value="MAJOR">Major</SelectItem>
                  <SelectItem value="CRITICAL">Critical</SelectItem>
                </SelectContent>
              </Select>

              <Select value={severity} onValueChange={setSeverity}>
                <SelectTrigger
                  aria-label="Filter by severity"
                  className="w-[160px]"
                >
                  <SelectValue placeholder="All Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Severity</SelectItem>
                  <SelectItem value="MINOR">Minor</SelectItem>
                  <SelectItem value="MAJOR">Major</SelectItem>
                  <SelectItem value="CRITICAL">Critical</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger aria-label="Sort issues" className="w-[160px]">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            {showingText}
          </div>

          {/* Table / List */}
          <div className="mt-3 overflow-hidden rounded-2xl border bg-background/40">
            {issuesQuery.isLoading ? (
              <div className="p-4 space-y-3">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : issuesQuery.isError ? (
              <div className="p-6">
                <p className="text-sm font-medium text-destructive">
                  Failed to load issues
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {issuesQuery.error?.message}
                </p>
              </div>
            ) : items.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm font-medium">No issues found</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try changing filters, or create a new issue to get started.
                </p>
                <div className="mt-4">
                  <Link to="/issues/new">
                    <Button className="hover-lift">Create issue</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-black/5 dark:bg-white/5">
                    <tr className="text-muted-foreground">
                      <th className="px-4 py-3 font-medium">Title</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Priority</th>
                      <th className="px-4 py-3 font-medium">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((it) => (
                      <tr
                        key={it._id || it.id}
                        className="border-t hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
                      >
                        <td className="px-4 py-3">
                          <Link
                            to={`/issues/${it._id || it.id}`}
                            className="font-medium hover:underline"
                          >
                            {it.title}
                          </Link>
                          {it.description ? (
                            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                              {it.description}
                            </p>
                          ) : null}
                        </td>
                        <td className="px-4 py-3">
                          <StatusChip status={it.status} />
                        </td>
                        <td className="px-4 py-3">
                          <PriorityChip priority={it.priority} />
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {formatDateTime(it.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          {!issuesQuery.isLoading &&
          !issuesQuery.isError &&
          items.length > 0 ? (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Page{" "}
                <span className="font-medium text-foreground/80">{page}</span>{" "}
                of{" "}
                <span className="font-medium text-foreground/80">
                  {totalPages}
                </span>
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  disabled={page <= 1 || issuesQuery.isFetching}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Prev
                </Button>
                <Button
                  variant="outline"
                  disabled={page >= totalPages || issuesQuery.isFetching}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          ) : null}

          {issuesQuery.isFetching && !issuesQuery.isLoading ? (
            <div className="mt-3 text-xs text-muted-foreground">Updating…</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
