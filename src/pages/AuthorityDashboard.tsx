import { useState } from "react";
import { useApp, type RequestStatus } from "@/context/AppContext";
import DisasterCard from "@/components/DisasterCard";
import FilterBar from "@/components/FilterBar";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRequests, useAssignments, updateRequestStatus, updateAssignmentStatus } from "@/hooks/useSupabaseData";

const AuthorityDashboard = () => {
  const { currentUser } = useApp();
  const [zoneFilter, setZoneFilter] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<RequestStatus | null>(null);

  const { assignments } = useAssignments(
    currentUser?.source === "authority" ? { authorityid: currentUser.id } : undefined
  );

  const assignedRequestIds = assignments.map((a) => a.requestid);
  const { requests, loading, refetch } = useRequests();

  const myRequests = requests
    .filter((r) => assignedRequestIds.includes(r.requestid))
    .filter((r) => !zoneFilter || r.zoneid === zoneFilter)
    .filter((r) => !statusFilter || r.status === statusFilter);

  const handleUpdateStatus = async (requestid: number, newStatus: RequestStatus) => {
    const ok = await updateRequestStatus(requestid, newStatus);
    if (ok && currentUser) {
      const assignmentStatus = newStatus === "Resolved" ? "Completed" as const : "InProgress" as const;
      await updateAssignmentStatus(requestid, currentUser.id, assignmentStatus);
      refetch();
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold font-mono text-foreground mb-2">Authority Dashboard</h1>
      <p className="text-sm text-muted-foreground mb-6">Assigned Requests</p>

      <FilterBar zoneFilter={zoneFilter} setZoneFilter={setZoneFilter} statusFilter={statusFilter} setStatusFilter={setStatusFilter} />

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="grid gap-4">
          {myRequests.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">No assigned requests</div>
          ) : (
            myRequests.map((r) => (
              <DisasterCard
                key={r.requestid}
                request={r}
                actions={
                  <div className="flex gap-2 flex-wrap">
                    {r.status === "Open" && (
                      <Button size="sm" variant="secondary" onClick={() => handleUpdateStatus(r.requestid, "InProgress")}>
                        Start Progress
                      </Button>
                    )}
                    {(r.status === "Open" || r.status === "InProgress") && (
                      <Button size="sm" onClick={() => handleUpdateStatus(r.requestid, "Resolved")} className="bg-success hover:bg-success/90 text-success-foreground">
                        Mark Resolved
                      </Button>
                    )}
                    {r.status !== "Closed" && r.status !== "Resolved" && (
                      <Button size="sm" variant="destructive" onClick={() => handleUpdateStatus(r.requestid, "Closed")}>
                        Close
                      </Button>
                    )}
                  </div>
                }
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AuthorityDashboard;
