import { useState } from "react";
import { useApp, type RequestStatus } from "@/context/AppContext";
import DisasterCard from "@/components/DisasterCard";
import FilterBar from "@/components/FilterBar";
import { Button } from "@/components/ui/button";
import { HandHelping, CheckCircle, Loader2, Heart, X } from "lucide-react";
import { useRequests, useUserHelp, volunteerForRequest, withdrawVolunteer } from "@/hooks/useSupabaseData";
import { StatusBadge } from "@/components/StatusBadge";

const VolunteerDashboard = () => {
  const { currentUser, zones, crisisTypes } = useApp();
  const [zoneFilter, setZoneFilter]     = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<RequestStatus | null>(null);
  const [tab, setTab]                   = useState<"browse" | "my">("browse");

  const { requests, loading } = useRequests();
  const { helps, loading: helpsLoading, refetch: refetchHelps } = useUserHelp(
    currentUser?.source === "user" ? { userid: currentUser.id } : undefined
  );

  const activeRequests = requests
    .filter((r) => ["Open", "InProgress"].includes(r.status))
    .filter((r) => !zoneFilter   || r.zoneid  === zoneFilter)
    .filter((r) => !statusFilter || r.status  === statusFilter);

  const activeHelps = helps.filter((h) => h.status === "Active");

  const getHelpEntry = (requestid: number) =>
    helps.find((h) => h.requestid === requestid);

  const handleVolunteer = async (requestid: number) => {
    if (!currentUser) return;
    const ok = await volunteerForRequest(requestid, currentUser.id);
    if (ok) refetchHelps();
  };

  const handleWithdraw = async (requestid: number) => {
    if (!currentUser) return;
    const ok = await withdrawVolunteer(requestid, currentUser.id);
    if (ok) refetchHelps();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold font-mono text-foreground mb-1">Volunteer Portal</h1>
      <p className="text-sm text-muted-foreground mb-6">
        {currentUser?.fname} — You are actively helping on {activeHelps.length} request{activeHelps.length !== 1 ? "s" : ""}
      </p>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <Button
          variant={tab === "browse" ? "default" : "secondary"}
          size="sm"
          onClick={() => setTab("browse")}
          className="gap-1.5"
        >
          <HandHelping className="w-3.5 h-3.5" />
          Browse Requests
        </Button>
        <Button
          variant={tab === "my" ? "default" : "secondary"}
          size="sm"
          onClick={() => setTab("my")}
          className="gap-1.5"
        >
          <Heart className="w-3.5 h-3.5" />
          My Activity ({helps.length})
        </Button>
      </div>

      {tab === "browse" ? (
        <>
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
          ) : activeRequests.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <HandHelping className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No active requests right now.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {activeRequests.map((r) => {
                const help = getHelpEntry(r.requestid);
                const volunteered = help?.status === "Active";
                return (
                  <DisasterCard
                    key={r.requestid}
                    request={r}
                    actions={
                      volunteered ? (
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center gap-1.5 text-xs text-success font-mono">
                            <CheckCircle className="w-3.5 h-3.5" /> Volunteering
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleWithdraw(r.requestid)}
                            className="text-xs text-muted-foreground hover:text-destructive gap-1 h-7 px-2"
                          >
                            <X className="w-3 h-3" /> Withdraw
                          </Button>
                        </div>
                      ) : help?.status === "Withdrawn" ? (
                        <span className="text-xs text-muted-foreground font-mono italic">
                          Withdrawn
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleVolunteer(r.requestid)}
                          className="gap-1.5"
                        >
                          <HandHelping className="w-4 h-4" /> Volunteer
                        </Button>
                      )
                    }
                  />
                );
              })}
            </div>
          )}
        </>
      ) : (
        /* ─── My Activity Tab ─── */
        <div>
          {helpsLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : helps.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Heart className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No volunteer activity yet.</p>
              <p className="text-sm mt-1">Browse requests and start helping your community!</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {helps.map((h) => {
                const req = requests.find((r) => r.requestid === h.requestid);
                const zoneName = req
                  ? (zones.find((z) => z.zoneid === req.zoneid)?.zonename ?? "Unknown zone")
                  : "";
                const typeName = req
                  ? (crisisTypes.find((t) => t.crisistypeid === req.crisistypeid)?.typename ?? "")
                  : "";
                return (
                  <div
                    key={`${h.requestid}-${h.userid}`}
                    className="glass-card rounded-lg p-4 flex items-start justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-foreground truncate">
                        {req?.title ?? `Request #${h.requestid}`}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {typeName && (
                          <span className="text-xs bg-secondary px-2 py-0.5 rounded text-muted-foreground">
                            {typeName}
                          </span>
                        )}
                        {zoneName && (
                          <span className="text-xs text-muted-foreground">{zoneName}</span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1.5">
                        Joined {h.joinedat ? new Date(h.joinedat).toLocaleDateString() : "—"}
                        {h.completedat && ` · Ended ${new Date(h.completedat).toLocaleDateString()}`}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span
                        className={`text-xs font-mono px-2 py-1 rounded ${
                          h.status === "Completed"
                            ? "bg-success/20 text-success"
                            : h.status === "Withdrawn"
                            ? "bg-destructive/20 text-destructive"
                            : "bg-warning/20 text-warning"
                        }`}
                      >
                        {h.status}
                      </span>
                      {req && <StatusBadge status={req.status} />}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VolunteerDashboard;
