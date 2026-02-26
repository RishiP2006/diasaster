import { useState } from "react";
import { useApp, type RequestStatus } from "@/context/AppContext";
import DisasterCard from "@/components/DisasterCard";
import FilterBar from "@/components/FilterBar";
import { Button } from "@/components/ui/button";
import { Loader2, Radio, List } from "lucide-react";
import {
  useRequests,
  useAssignments,
  updateRequestStatus,
  updateAssignmentStatus,
} from "@/hooks/useSupabaseData";

const AuthorityDashboard = () => {
  const { currentUser } = useApp();
  const [zoneFilter, setZoneFilter]   = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<RequestStatus | null>(null);
  const [tab, setTab]                 = useState<"assigned" | "all">("assigned");

  const { assignments, loading: assignmentsLoading, refetch: refetchAssignments } = useAssignments(
    currentUser?.source === "authority" ? { authorityid: currentUser.id } : undefined
  );

  const assignedRequestIds = assignments.map((a) => a.requestid);
  const { requests, loading: requestsLoading, refetch: refetchRequests } = useRequests();

  const refetchAll = () => {
    refetchAssignments();
    refetchRequests();
  };

  const myRequests = requests.filter((r) => assignedRequestIds.includes(r.requestid));

  const filteredMy = myRequests
    .filter((r) => !zoneFilter   || r.zoneid  === zoneFilter)
    .filter((r) => !statusFilter || r.status  === statusFilter);

  const filteredAll = requests
    .filter((r) => !zoneFilter   || r.zoneid  === zoneFilter)
    .filter((r) => !statusFilter || r.status  === statusFilter);

  const displayed = tab === "assigned" ? filteredMy : filteredAll;
  const loading   = assignmentsLoading || requestsLoading;

  const handleUpdateStatus = async (requestid: number, newStatus: RequestStatus) => {
    const ok = await updateRequestStatus(requestid, newStatus);
    if (ok && currentUser) {
      // Sync assignment status when request status changes
      const assignment = assignments.find((a) => a.requestid === requestid);
      if (assignment) {
        const aStatus =
          newStatus === "Resolved" || newStatus === "Closed" ? "Completed" as const : "InProgress" as const;
        await updateAssignmentStatus(requestid, currentUser.id, aStatus);
      }
      refetchAll();
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold font-mono text-foreground mb-1">Authority Dashboard</h1>
      <p className="text-sm text-muted-foreground mb-6">
        {currentUser?.fname} {currentUser?.lname} — Manage your assigned requests
      </p>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <Button
          size="sm"
          variant={tab === "assigned" ? "default" : "secondary"}
          onClick={() => setTab("assigned")}
          className="gap-1.5"
        >
          <Radio className="w-3.5 h-3.5" />
          My Assignments ({myRequests.length})
        </Button>
        <Button
          size="sm"
          variant={tab === "all" ? "default" : "secondary"}
          onClick={() => setTab("all")}
          className="gap-1.5"
        >
          <List className="w-3.5 h-3.5" />
          All Requests ({requests.length})
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
      ) : displayed.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Radio className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>
            {tab === "assigned"
              ? "No requests assigned to you yet."
              : "No requests match the current filters."}
          </p>
          {tab === "assigned" && myRequests.length === 0 && (
            <p className="text-xs mt-2 opacity-70">
              Switch to "All Requests" to browse and monitor all active incidents.
            </p>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {displayed.map((r) => {
            const isAssigned = assignedRequestIds.includes(r.requestid);
            return (
              <DisasterCard
                key={r.requestid}
                request={r}
                actions={
                  isAssigned ? (
                    <div className="flex gap-2 flex-wrap">
                      {r.status === "Open" && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleUpdateStatus(r.requestid, "InProgress")}
                        >
                          Start Response
                        </Button>
                      )}
                      {(r.status === "Open" || r.status === "InProgress") && (
                        <Button
                          size="sm"
                          onClick={() => handleUpdateStatus(r.requestid, "Resolved")}
                          className="bg-success hover:bg-success/90 text-success-foreground"
                        >
                          Mark Resolved
                        </Button>
                      )}
                      {r.status !== "Closed" && r.status !== "Resolved" && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleUpdateStatus(r.requestid, "Closed")}
                        >
                          Close
                        </Button>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground font-mono italic">
                      Not assigned to you
                    </span>
                  )
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AuthorityDashboard;
