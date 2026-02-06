import { useParams } from "react-router-dom";

export default function IssueDetailPage() {
  const { id } = useParams();
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight">Issue Detail</h1>
      <p className="text-sm text-muted-foreground">Issue ID: {id}</p>
    </div>
  );
}
