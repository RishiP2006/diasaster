import { useApp, type Request } from "@/context/AppContext";
import { StatusBadge, SeverityBadge } from "./StatusBadge";
import { MapPin, Clock } from "lucide-react";

interface Props {
  request: Request;
  actions?: React.ReactNode;
}

const DisasterCard = ({ request, actions }: Props) => {
  const { zones, crisisTypes } = useApp();
  const typeName = crisisTypes.find((t) => t.crisistypeid === request.crisistypeid)?.typename ?? "Unknown";
  const zoneName = zones.find((z) => z.zoneid === request.zoneid)?.zonename ?? "Unknown";

  return (
    <div className="glass-card rounded-lg p-5 hover:border-border transition-all">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          {request.severity && <SeverityBadge level={request.severity} />}
          <h3 className="font-semibold text-foreground text-sm leading-tight">
            {request.title}
          </h3>
        </div>
        <StatusBadge status={request.status} />
      </div>

      {request.description && (
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {request.description}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
        <span className="inline-flex items-center gap-1 bg-secondary px-2 py-1 rounded">
          {typeName}
        </span>
        <span className="inline-flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {zoneName}
        </span>
        {request.startdatetime && (
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {new Date(request.startdatetime).toLocaleDateString()}
          </span>
        )}
      </div>

      {actions && <div className="flex items-center gap-2 pt-2 border-t border-border/50">{actions}</div>}
    </div>
  );
};

export default DisasterCard;
