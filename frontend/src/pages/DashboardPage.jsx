export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-4">
        {["Open", "In Progress", "Resolved", "Closed"].map((label) => (
          <div key={label} className="rounded-xl border bg-card p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-2 text-2xl font-semibold">—</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <p className="text-sm text-muted-foreground">
          Issues list (search/filter/pagination) will go here.
        </p>
      </div>
    </div>
  );
}
