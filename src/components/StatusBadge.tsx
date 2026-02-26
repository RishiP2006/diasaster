import { Badge } from "@/components/ui/badge";
import type { RequestStatus } from "@/context/AppContext";
import { cn } from "@/lib/utils";

const statusStyles: Record<RequestStatus, string> = {
  Open: "bg-info/20 text-info border-info/30",
  InProgress: "bg-warning/20 text-warning border-warning/30",
  Resolved: "bg-success/20 text-success border-success/30",
  Closed: "bg-muted/20 text-muted-foreground border-muted/30",
};

export const StatusBadge = ({ status }: { status: RequestStatus }) => (
  <Badge variant="outline" className={cn("font-mono text-xs", statusStyles[status])}>
    {status}
  </Badge>
);

export const SeverityBadge = ({ level }: { level: number }) => {
  const cls = `severity-${level}`;
  return (
    <span className={cn("inline-flex items-center justify-center w-7 h-7 rounded-md text-xs font-bold font-mono", cls)}>
      {level}
    </span>
  );
};
