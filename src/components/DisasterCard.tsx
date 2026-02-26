import { useApp, type Request } from "@/context/AppContext";
import { StatusBadge, SeverityBadge } from "./StatusBadge";
import { MapPin, Clock, Tag } from "lucide-react";

interface Props {
  request: Request;
  actions?: React.ReactNode;
}

const DisasterCard = ({ request, actions }: Props) => {
  const { zones, crisisTypes } = useApp();
  const typeName = crisisTypes.find((t) => t.crisistypeid === request.crisistypeid)?.typename ?? "Unknown";
  const zoneName = zones.find((z) => z.zoneid === request.zoneid)?.zonename ?? "Unknown Zone";

  const timeAgo = (dt?: string) => {
    if (!dt) return null;
    const diff = Date.now() - new Date(dt).getTime();
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days  = Math.floor(hours / 24);
    if (days  > 0)  return `${days}d ago`;
    if (hours > 0)  return `${hours}h ago`;
    if (mins  > 0)  return `${mins}m ago`;
    return "Just now";
  };

  return (
    <div className="glass-card rounded-lg p-5 hover:border-border transition-all">
      {/* Title row */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          {request.severity != null && <SeverityBadge level={request.severity} />}
          <h3 className="font-semibold text-foreground text-sm leading-tight pt-0.5">
            {request.title}
          </h3>
        </div>
        <StatusBadge status={request.status} />
      </div>

      {/* Description */}
      {request.description && (
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2 pl-9">
          {request.description}
        </p>
      )}

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground pl-9">
        <span className="inline-flex items-center gap-1">
          <Tag className="w-3 h-3" />
          {typeName}
        </span>
        <span className="inline-flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {zoneName}
        </span>
        {request.startdatetime && (
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {timeAgo(request.startdatetime)}
          </span>
        )}
        {request.numvolunteerneeded != null && request.numvolunteerneeded > 0 && (
          <span className="text-warning font-mono">
            {request.numvolunteerneeded} volunteers needed
          </span>
        )}
      </div>

      {/* Actions */}
      {actions && (
        <div className="flex items-center gap-2 pt-3 mt-3 border-t border-border/50">
          {actions}
        </div>
      )}
    </div>
  );
};

export default DisasterCard;
