import { Button } from "@/components/ui/button";

export default function PaginationBar({ page, totalPages, onPrev, onNext, disabled }) {
  return (
    <div className="flex items-center justify-between gap-3 pt-3">
      <div className="text-sm text-muted-foreground">
        Page <span className="font-medium text-foreground">{page}</span> of{" "}
        <span className="font-medium text-foreground">{totalPages || 1}</span>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onPrev} disabled={disabled || page <= 1}>
          Prev
        </Button>
        <Button variant="outline" size="sm" onClick={onNext} disabled={disabled || page >= totalPages}>
          Next
        </Button>
      </div>
    </div>
  );
}
