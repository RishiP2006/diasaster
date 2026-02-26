import { useState, useEffect } from "react";
import { useApp, type RequestStatus } from "@/context/AppContext";
import DisasterCard from "@/components/DisasterCard";
import FilterBar from "@/components/FilterBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, List, Globe, Loader2, AlertTriangle } from "lucide-react";
import { useRequests, createRequest } from "@/hooks/useSupabaseData";

type ViewMode = "my" | "all" | "report";

const CitizenDashboard = () => {
  const { currentUser, zones, crisisTypes } = useApp();
  const [view, setView] = useState<ViewMode>("all");
  const [zoneFilter, setZoneFilter] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<RequestStatus | null>(null);

  // My reports
  const { requests: myRequests, loading: myLoading, refetch: refetchMine } = useRequests({
    createdby: currentUser?.source === "user" ? currentUser.id : undefined,
  });

  // All reports (public feed)
  const { requests: allRequests, loading: allLoading } = useRequests();

  const filtered = (view === "my" ? myRequests : allRequests)
    .filter((r) => !zoneFilter || r.zoneid === zoneFilter)
    .filter((r) => !statusFilter || r.status === statusFilter);

  // ── Form state — initialized to 0 and updated once reference data arrives ──
  const [title, setTitle]           = useState("");
  const [typeId, setTypeId]         = useState(0);
  const [zoneId, setZoneId]         = useState(0);
  const [severity, setSeverity]     = useState(3);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Sync form defaults once crisisTypes / zones load from DB
  useEffect(() => {
    if (crisisTypes.length > 0 && typeId === 0) {
      setTypeId(crisisTypes[0].crisistypeid);
    }
  }, [crisisTypes]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (zones.length > 0 && zoneId === 0) {
      // Default to user's own zone if available
      const defaultZone = currentUser?.zoneid
        ? zones.find((z) => z.zoneid === currentUser.zoneid)
        : zones[0];
      setZoneId(defaultZone?.zoneid ?? zones[0].zoneid);
    }
  }, [zones]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    if (typeId === 0 || zoneId === 0) {
      return;
    }
    setSubmitting(true);
    const ok = await createRequest({
      crisistypeid: typeId,
      createdby: currentUser!.id,
      zoneid: zoneId,
      title: title.trim(),
      description: description.trim(),
      severity,
    });
    setSubmitting(false);
    if (ok) {
      setTitle("");
      setDescription("");
      setSeverity(3);
      setView("my");
      refetchMine();
    }
  };

  const loading = view === "my" ? myLoading : allLoading;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold font-mono text-foreground">Disaster Feed</h1>
        <Button
          onClick={() => setView(view === "report" ? "all" : "report")}
          variant={view === "report" ? "secondary" : "default"}
          className="gap-2"
        >
          {view === "report" ? (
            <><List className="w-4 h-4" /> View Feed</>
          ) : (
            <><Plus className="w-4 h-4" /> Report Disaster</>
          )}
        </Button>
      </div>

      {view === "report" ? (
        /* ─── Report Form ─── */
        <div className="glass-card rounded-lg p-6 max-w-xl">
          <div className="flex items-center gap-2 mb-5">
            <AlertTriangle className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-mono font-bold text-foreground">New Disaster Report</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Flooding near River Road"
                className="mt-1"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Disaster Type</Label>
                {crisisTypes.length === 0 ? (
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground py-2">
                    <Loader2 className="w-3 h-3 animate-spin" /> Loading…
                  </div>
                ) : (
                  <select
                    id="type"
                    value={typeId}
                    onChange={(e) => setTypeId(Number(e.target.value))}
                    className="w-full mt-1 bg-secondary text-foreground text-sm rounded-md border border-border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    {crisisTypes.map((t) => (
                      <option key={t.crisistypeid} value={t.crisistypeid}>
                        {t.typename}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <Label htmlFor="zone">Zone</Label>
                {zones.length === 0 ? (
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground py-2">
                    <Loader2 className="w-3 h-3 animate-spin" /> Loading…
                  </div>
                ) : (
                  <select
                    id="zone"
                    value={zoneId}
                    onChange={(e) => setZoneId(Number(e.target.value))}
                    className="w-full mt-1 bg-secondary text-foreground text-sm rounded-md border border-border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    {zones.map((z) => (
                      <option key={z.zoneid} value={z.zoneid}>
                        {z.zonename}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div>
              <Label>Severity</Label>
              <div className="flex gap-2 mt-1">
                {[
                  { v: 1, label: "1 – Minor" },
                  { v: 2, label: "2 – Low" },
                  { v: 3, label: "3 – Medium" },
                  { v: 4, label: "4 – High" },
                  { v: 5, label: "5 – Critical" },
                ].map(({ v, label }) => (
                  <button
                    key={v}
                    type="button"
                    title={label}
                    onClick={() => setSeverity(v)}
                    className={`w-10 h-10 rounded-md font-mono font-bold text-sm transition-all ${
                      severity === v
                        ? `severity-${v} ring-2 ring-offset-1 ring-offset-background ring-ring`
                        : "bg-secondary text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {["", "Minor – no immediate danger", "Low – limited impact", "Medium – moderate impact", "High – significant danger", "Critical – life-threatening"][severity]}
              </p>
            </div>

            <div>
              <Label htmlFor="desc">Description <span className="text-destructive">*</span></Label>
              <Textarea
                id="desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the situation in detail — location, number of people affected, immediate needs…"
                className="mt-1"
                rows={4}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full gap-2"
              disabled={submitting || crisisTypes.length === 0 || zones.length === 0}
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Submit Report
            </Button>
          </form>
        </div>
      ) : (
        /* ─── List view ─── */
        <>
          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            <Button
              size="sm"
              variant={view === "all" ? "default" : "secondary"}
              onClick={() => setView("all")}
              className="gap-1.5"
            >
              <Globe className="w-3.5 h-3.5" /> All Reports ({allRequests.length})
            </Button>
            <Button
              size="sm"
              variant={view === "my" ? "default" : "secondary"}
              onClick={() => setView("my")}
              className="gap-1.5"
            >
              <List className="w-3.5 h-3.5" /> My Reports ({myRequests.length})
            </Button>
          </div>

          <FilterBar
            zoneFilter={zoneFilter}
            setZoneFilter={setZoneFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <AlertTriangle className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-lg">No reports found</p>
              <p className="text-sm mt-1">
                {view === "my"
                  ? "You haven't submitted any reports yet."
                  : "No disaster reports match the current filters."}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filtered.map((r) => (
                <DisasterCard key={r.requestid} request={r} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CitizenDashboard;
