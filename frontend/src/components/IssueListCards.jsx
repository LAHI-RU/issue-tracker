import { Link } from "react-router-dom";
import StatusChip from "@/components/StatusChip";
import PriorityChip from "@/components/PriorityChip";

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return "—";
  }
}

export default function IssueListCards({ items }) {
  return (
    <div className="grid gap-3 md:hidden">
      {items.map((it) => (
        <Link
          key={it._id}
          to={`/issues/${it._id}`}
          className="rounded-xl border bg-card p-4 shadow-sm active:scale-[0.99] transition"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="font-medium leading-snug">{it.title}</div>
              <div className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {it.description}
              </div>
            </div>
            <div className="text-xs text-muted-foreground">{formatDate(it.createdAt)}</div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <StatusChip status={it.status} />
            <PriorityChip priority={it.priority} />
          </div>
        </Link>
      ))}
    </div>
  );
}
