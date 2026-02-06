import { useParams } from "react-router-dom";

export default function IssueFormPage() {
  const { id } = useParams();
  const mode = id ? "Edit" : "Create";

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight">{mode} Issue</h1>
      <p className="text-sm text-muted-foreground">
        Reusable create/edit form will be built next.
      </p>
    </div>
  );
}
