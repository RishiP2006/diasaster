import { useApp } from "@/context/AppContext";
import type { RequestStatus } from "@/context/AppContext";

interface Props {
  zoneFilter: number | null;
  setZoneFilter: (v: number | null) => void;
  statusFilter: RequestStatus | null;
  setStatusFilter: (v: RequestStatus | null) => void;
  typeFilter?: number | null;
  setTypeFilter?: (v: number | null) => void;
}

const STATUSES: RequestStatus[] = ["Open", "InProgress", "Resolved", "Closed"];

const FilterBar = ({ zoneFilter, setZoneFilter, statusFilter, setStatusFilter, typeFilter, setTypeFilter }: Props) => {
  const { zones, crisisTypes } = useApp();

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <select
        value={zoneFilter ?? ""}
        onChange={(e) => setZoneFilter(e.target.value ? Number(e.target.value) : null)}
        className="bg-secondary text-foreground text-sm rounded-md border border-border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-ring"
      >
        <option value="">All Zones</option>
        {zones.map((z) => (
          <option key={z.zoneid} value={z.zoneid}>{z.zonename}</option>
        ))}
      </select>

      <select
        value={statusFilter ?? ""}
        onChange={(e) => setStatusFilter(e.target.value ? (e.target.value as RequestStatus) : null)}
        className="bg-secondary text-foreground text-sm rounded-md border border-border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-ring"
      >
        <option value="">All Statuses</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {setTypeFilter && (
        <select
          value={typeFilter ?? ""}
          onChange={(e) => setTypeFilter(e.target.value ? Number(e.target.value) : null)}
          className="bg-secondary text-foreground text-sm rounded-md border border-border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="">All Types</option>
          {crisisTypes.map((t) => (
            <option key={t.crisistypeid} value={t.crisistypeid}>{t.typename}</option>
          ))}
        </select>
      )}
    </div>
  );
};

export default FilterBar;
