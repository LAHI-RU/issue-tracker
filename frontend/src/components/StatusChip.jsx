import { Badge } from "@/components/ui/badge";

const MAP = {
  OPEN: { label: "Open", variant: "default" },
  IN_PROGRESS: { label: "In Progress", variant: "secondary" },
  RESOLVED: { label: "Resolved", variant: "outline" },
  CLOSED: { label: "Closed", variant: "destructive" }
};

export default function StatusChip({ status }) {
  const s = MAP[status] || { label: status || "—", variant: "secondary" };
  return <Badge variant={s.variant}>{s.label}</Badge>;
}
