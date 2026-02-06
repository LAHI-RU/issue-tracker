import { Link } from "react-router-dom";
import StatusChip from "@/components/StatusChip";
import PriorityChip from "@/components/PriorityChip";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return "—";
  }
}

export default function IssueListTable({ items }) {
  return (
    <div className="hidden md:block rounded-xl border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead className="text-right">Created</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {items.map((it) => (
            <TableRow key={it._id} className="hover:bg-muted/40">
              <TableCell className="font-medium">
                <Link className="underline-offset-2 hover:underline" to={`/issues/${it._id}`}>
                  {it.title}
                </Link>
                <div className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                  {it.description}
                </div>
              </TableCell>

              <TableCell>
                <StatusChip status={it.status} />
              </TableCell>

              <TableCell>
                <PriorityChip priority={it.priority} />
              </TableCell>

              <TableCell className="text-right text-sm text-muted-foreground">
                {formatDate(it.createdAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
