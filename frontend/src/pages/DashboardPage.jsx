import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchIssueStats } from "@/lib/issues";

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

export default function DashboardPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["issueStats"],
    queryFn: ({ signal }) => fetchIssueStats({ signal })
  });

  const counts = data?.data?.counts || { OPEN: 0, IN_PROGRESS: 0, RESOLVED: 0, CLOSED: 0 };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      </div>

      {isError ? (
        <div className="rounded-xl border bg-card p-4 text-sm text-destructive">
          Failed to load stats: {error?.message}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Open" value={counts.OPEN} loading={isLoading} />
        <StatCard label="In Progress" value={counts.IN_PROGRESS} loading={isLoading} />
        <StatCard label="Resolved" value={counts.RESOLVED} loading={isLoading} />
        <StatCard label="Closed" value={counts.CLOSED} loading={isLoading} />
      </div>

      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <p className="text-sm text-muted-foreground">
          Next step: Issues list table (search, filters, pagination, badges).
        </p>
      </div>
    </div>
  );
}
