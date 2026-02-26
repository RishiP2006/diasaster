import { useState } from "react";
import { useApp, type RequestStatus } from "@/context/AppContext";
import DisasterCard from "@/components/DisasterCard";
import FilterBar from "@/components/FilterBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, List, Loader2 } from "lucide-react";
import { useRequests, createRequest } from "@/hooks/useSupabaseData";

const CitizenDashboard = () => {
  const { currentUser, zones, crisisTypes } = useApp();
  const [view, setView] = useState<"list" | "report">("list");
  const [zoneFilter, setZoneFilter] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<RequestStatus | null>(null);

  const { requests, loading, refetch } = useRequests({
    createdby: currentUser?.source === "user" ? currentUser.id : undefined,
  });

  const filtered = requests
    .filter((r) => !zoneFilter || r.zoneid === zoneFilter)
    .filter((r) => !statusFilter || r.status === statusFilter);

  // Form state
  const [title, setTitle] = useState("");
  const [typeId, setTypeId] = useState(crisisTypes[0]?.crisistypeid ?? 1);
  const [zoneId, setZoneId] = useState(zones[0]?.zoneid ?? 1);
  const [severity, setSeverity] = useState(3);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
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
      setView("list");
      refetch();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-mono text-foreground">My Reports</h1>
        <Button
          onClick={() => setView(view === "list" ? "report" : "list")}
          variant={view === "report" ? "secondary" : "default"}
          className="gap-2"
        >
          {view === "list" ? <><Plus className="w-4 h-4" /> Report Disaster</> : <><List className="w-4 h-4" /> View Reports</>}
        </Button>
      </div>

      {view === "report" ? (
        <div className="glass-card rounded-lg p-6 max-w-xl">
          <h2 className="text-lg font-mono font-bold mb-4 text-foreground">New Disaster Report</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Title *</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Brief title" className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type</Label>
                <select value={typeId} onChange={(e) => setTypeId(Number(e.target.value))} className="w-full mt-1 bg-secondary text-foreground text-sm rounded-md border border-border px-3 py-2">
                  {crisisTypes.map((t) => <option key={t.crisistypeid} value={t.crisistypeid}>{t.typename}</option>)}
                </select>
              </div>
              <div>
                <Label>Zone</Label>
                <select value={zoneId} onChange={(e) => setZoneId(Number(e.target.value))} className="w-full mt-1 bg-secondary text-foreground text-sm rounded-md border border-border px-3 py-2">
                  {zones.map((z) => <option key={z.zoneid} value={z.zoneid}>{z.zonename}</option>)}
                </select>
              </div>
            </div>
            <div>
              <Label>Severity (1–5)</Label>
              <div className="flex gap-2 mt-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSeverity(s)}
                    className={`w-10 h-10 rounded-md font-mono font-bold text-sm transition-all ${
                      severity === s ? `severity-${s} ring-2 ring-ring` : "bg-secondary text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Description *</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the situation..." className="mt-1" rows={4} />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Submit Report
            </Button>
          </form>
        </div>
      ) : (
        <>
          <FilterBar zoneFilter={zoneFilter} setZoneFilter={setZoneFilter} statusFilter={statusFilter} setStatusFilter={setStatusFilter} />
          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-lg">No reports found</p>
              <p className="text-sm mt-1">Submit your first disaster report above.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filtered.map((r) => <DisasterCard key={r.requestid} request={r} />)}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CitizenDashboard;
