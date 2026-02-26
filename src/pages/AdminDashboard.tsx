import { useState } from "react";
import { useApp, type RequestStatus, type Request } from "@/context/AppContext";
import DisasterCard from "@/components/DisasterCard";
import FilterBar from "@/components/FilterBar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, X, Users, BarChart3 } from "lucide-react";
import { useRequests, useAuthorities, createAssignment, updateRequestStatus } from "@/hooks/useSupabaseData";

// Modal for assigning authority to a request
const AssignModal = ({
  request,
  onClose,
  onAssigned,
}: {
  request: Request;
  onClose: () => void;
  onAssigned: () => void;
}) => {
  const { authorities, loading } = useAuthorities();
  const [selectedAuthority, setSelectedAuthority] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const availableAuthorities = authorities.filter(
    (a) => a.availabilitystatus !== "OFFLINE"
  );

  const handleAssign = async () => {
    if (!selectedAuthority) return;
    setSubmitting(true);
    const auth = authorities.find((a) => a.authorityid === selectedAuthority);
    const ok = await createAssignment({
      requestid: request.requestid,
      authorityid: selectedAuthority,
      notes: notes || `Assigned to ${auth?.fname} ${auth?.lname}`,
    });
    if (ok) {
      await updateRequestStatus(request.requestid, "InProgress");
      onAssigned();
      onClose();
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <h3 className="font-mono font-bold text-foreground">Assign Authority</h3>
            <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-xs">
              {request.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <Label className="text-xs uppercase tracking-widest font-mono text-muted-foreground mb-2 block">
              Select Authority
            </Label>
            {loading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            ) : availableAuthorities.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No available authorities at this time.
              </p>
            ) : (
              <div className="grid gap-2 max-h-56 overflow-y-auto">
                {availableAuthorities.map((a) => (
                  <button
                    key={a.authorityid}
                    onClick={() => setSelectedAuthority(a.authorityid)}
                    className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                      selectedAuthority === a.authorityid
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border bg-secondary/50 hover:border-border/80 hover:bg-secondary"
                    }`}
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-foreground">
                        {a.fname} {a.lname}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {a.rank && <span>{a.rank} · </span>}
                        {a.badgenumber && <span>#{a.badgenumber} · </span>}
                        <span
                          className={`font-mono ${
                            a.availabilitystatus === "AVAILABLE"
                              ? "text-success"
                              : "text-warning"
                          }`}
                        >
                          {a.availabilitystatus}
                        </span>
                      </div>
                    </div>
                    {selectedAuthority === a.authorityid && (
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <Label className="text-xs uppercase tracking-widest font-mono text-muted-foreground mb-2 block">
              Notes (optional)
            </Label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Assignment notes..."
              rows={2}
              className="w-full bg-secondary text-foreground text-sm rounded-md border border-border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-ring resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 p-5 border-t border-border">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedAuthority || submitting}
            className="flex-1 gap-2"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Assign
          </Button>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [zoneFilter, setZoneFilter] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<RequestStatus | null>(null);
  const [assigningRequest, setAssigningRequest] = useState<Request | null>(null);

  const { requests, loading, refetch } = useRequests();
  const { authorities } = useAuthorities();

  const filtered = requests
    .filter((r) => !zoneFilter || r.zoneid === zoneFilter)
    .filter((r) => !statusFilter || r.status === statusFilter);

  // Stats
  const openCount = requests.filter((r) => r.status === "Open").length;
  const inProgressCount = requests.filter((r) => r.status === "InProgress").length;
  const resolvedCount = requests.filter((r) => r.status === "Resolved").length;
  const availableAuthorities = authorities.filter(
    (a) => a.availabilitystatus === "AVAILABLE"
  ).length;

  const handleCloseRequest = async (requestid: number) => {
    await updateRequestStatus(requestid, "Closed");
    refetch();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold font-mono text-foreground mb-6">
        Admin Dashboard
      </h1>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Open", value: openCount, color: "text-info" },
          { label: "In Progress", value: inProgressCount, color: "text-warning" },
          { label: "Resolved", value: resolvedCount, color: "text-success" },
          { label: "Authorities Available", value: availableAuthorities, color: "text-primary" },
        ].map((stat) => (
          <div key={stat.label} className="glass-card rounded-lg p-4">
            <div className={`text-2xl font-bold font-mono ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
          </div>
        ))}
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
          <BarChart3 className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No requests found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((r) => (
            <DisasterCard
              key={r.requestid}
              request={r}
              actions={
                <div className="flex gap-2 flex-wrap">
                  {r.status === "Open" && (
                    <Button
                      size="sm"
                      onClick={() => setAssigningRequest(r)}
                      className="gap-1"
                    >
                      <Users className="w-3.5 h-3.5" />
                      Assign Authority
                    </Button>
                  )}
                  {(r.status === "Open" || r.status === "InProgress") && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleCloseRequest(r.requestid)}
                    >
                      Close
                    </Button>
                  )}
                  {(r.status === "Resolved" || r.status === "Closed") && (
                    <span className="text-xs text-muted-foreground font-mono">
                      {r.status}
                    </span>
                  )}
                </div>
              }
            />
          ))}
        </div>
      )}

      {assigningRequest && (
        <AssignModal
          request={assigningRequest}
          onClose={() => setAssigningRequest(null)}
          onAssigned={refetch}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
