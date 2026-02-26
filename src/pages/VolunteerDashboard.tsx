import { useState } from "react";
import { useApp, type RequestStatus } from "@/context/AppContext";
import DisasterCard from "@/components/DisasterCard";
import FilterBar from "@/components/FilterBar";
import { Button } from "@/components/ui/button";
import { HandHelping, CheckCircle, Loader2 } from "lucide-react";
import { useRequests, useUserHelp, volunteerForRequest } from "@/hooks/useSupabaseData";

const VolunteerDashboard = () => {
  const { currentUser } = useApp();
  const [zoneFilter, setZoneFilter] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<RequestStatus | null>(null);
  const [tab, setTab] = useState<"browse" | "my">("browse");

  const { requests, loading } = useRequests();
  const { helps, refetch: refetchHelps } = useUserHelp(
    currentUser?.source === "user" ? { userid: currentUser.id } : undefined
  );

  const activeRequests = requests
    .filter((r) => ["Open", "InProgress"].includes(r.status))
    .filter((r) => !zoneFilter || r.zoneid === zoneFilter)
    .filter((r) => !statusFilter || r.status === statusFilter);

  const hasVolunteered = (requestid: number) =>
    helps.some((h) => h.requestid === requestid);

  const handleVolunteer = async (requestid: number) => {
    if (!currentUser || hasVolunteered(requestid)) return;
    const ok = await volunteerForRequest(requestid, currentUser.id);
    if (ok) refetchHelps();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold font-mono text-foreground mb-6">Volunteer Portal</h1>

      <div className="flex gap-2 mb-6">
        <Button variant={tab === "browse" ? "default" : "secondary"} size="sm" onClick={() => setTab("browse")}>
          Browse Requests
        </Button>
        <Button variant={tab === "my" ? "default" : "secondary"} size="sm" onClick={() => setTab("my")}>
          My Help ({helps.length})
        </Button>
      </div>

      {tab === "browse" ? (
        <>
          <FilterBar zoneFilter={zoneFilter} setZoneFilter={setZoneFilter} statusFilter={statusFilter} setStatusFilter={setStatusFilter} />
          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
          ) : (
            <div className="grid gap-4">
              {activeRequests.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">No active requests</div>
              ) : (
                activeRequests.map((r) => (
                  <DisasterCard
                    key={r.requestid}
                    request={r}
                    actions={
                      hasVolunteered(r.requestid) ? (
                        <span className="inline-flex items-center gap-1 text-xs text-success font-mono">
                          <CheckCircle className="w-3 h-3" /> Volunteered
                        </span>
                      ) : (
                        <Button size="sm" variant="secondary" onClick={() => handleVolunteer(r.requestid)} className="gap-1">
                          <HandHelping className="w-4 h-4" /> Volunteer
                        </Button>
                      )
                    }
                  />
                ))
              )}
            </div>
          )}
        </>
      ) : (
        <div className="grid gap-3">
          {helps.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">No volunteer activity yet</div>
          ) : (
            helps.map((h) => {
              const req = requests.find((r) => r.requestid === h.requestid);
              return (
                <div key={`${h.requestid}-${h.userid}`} className="glass-card rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm text-foreground">{req?.title ?? "Unknown"}</div>
                    <div className="text-xs text-muted-foreground">
                      Joined {h.joinedat ? new Date(h.joinedat).toLocaleDateString() : "—"}
                    </div>
                  </div>
                  <span className={`text-xs font-mono px-2 py-1 rounded ${
                    h.status === "Completed" ? "bg-success/20 text-success" :
                    h.status === "Withdrawn" ? "bg-destructive/20 text-destructive" :
                    "bg-warning/20 text-warning"
                  }`}>
                    {h.status}
                  </span>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default VolunteerDashboard;
