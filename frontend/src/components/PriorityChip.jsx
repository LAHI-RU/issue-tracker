import { Badge } from "@/components/ui/badge";

const MAP = {
  LOW: { label: "Low", variant: "secondary" },
  MEDIUM: { label: "Medium", variant: "default" },
  HIGH: { label: "High", variant: "outline" },
  URGENT: { label: "Urgent", variant: "destructive" }
};

export default function PriorityChip({ priority }) {
  if (!priority) return null;
  const p = MAP[priority] || { label: priority, variant: "secondary" };
  return <Badge variant={p.variant}>{p.label}</Badge>;
}
