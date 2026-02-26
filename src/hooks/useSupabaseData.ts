import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  useApp,
  type Zone,
  type CrisisType,
  type Request,
  type AuthorityAssignment,
  type UserHelp,
  type Authority,
  type RequestStatus,
  type AssignmentStatus,
} from "@/context/AppContext";
import { toast } from "sonner";

// ─── Reference data ──────────────────────────────────────────────────────────

export function useReferenceData() {
  const { setZones, setCrisisTypes } = useApp();

  useEffect(() => {
    const fetchZones = async () => {
      const { data, error } = await supabase.from("zone").select("*").order("zoneid");
      if (!error && data) setZones(data as Zone[]);
    };
    const fetchCrisisTypes = async () => {
      const { data, error } = await supabase.from("crisistype").select("*").order("crisistypeid");
      if (!error && data) setCrisisTypes(data as CrisisType[]);
    };
    fetchZones();
    fetchCrisisTypes();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}

// ─── Requests ────────────────────────────────────────────────────────────────

export function useRequests(filters?: {
  createdby?: number;
  zoneid?: number;
  status?: RequestStatus | null;
}) {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  // Stable primitive refs so useCallback doesn't re-create on every render
  const createdby = filters?.createdby;
  const zoneid    = filters?.zoneid;
  const status    = filters?.status;

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    let query = supabase.from("request").select("*").order("requestid", { ascending: false });

    if (createdby) query = query.eq("createdby", createdby);
    if (zoneid)    query = query.eq("zoneid", zoneid);
    if (status)    query = query.eq("status", status);

    const { data, error } = await query;
    if (error) {
      toast.error("Failed to fetch requests");
      console.error(error);
    } else {
      setRequests((data ?? []) as Request[]);
    }
    setLoading(false);
  }, [createdby, zoneid, status]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return { requests, loading, refetch: fetchRequests };
}

export async function createRequest(data: {
  crisistypeid: number;
  createdby: number;
  zoneid: number;
  title: string;
  description: string;
  severity: number;
}) {
  const { error } = await supabase.from("request").insert({
    ...data,
    status: "Open" as RequestStatus,
    startdatetime: new Date().toISOString(),
  });
  if (error) {
    toast.error("Failed to submit report");
    console.error(error);
    return false;
  }
  toast.success("Disaster reported successfully");
  return true;
}

export async function updateRequestStatus(requestid: number, status: RequestStatus) {
  const update: Record<string, unknown> = { status };
  if (status === "Resolved" || status === "Closed") {
    update.enddatetime = new Date().toISOString();
  }
  const { error } = await supabase
    .from("request")
    .update(update)
    .eq("requestid", requestid);
  if (error) {
    toast.error("Failed to update status");
    console.error(error);
    return false;
  }
  toast.success(`Status updated to ${status}`);
  return true;
}

// ─── Authority Assignments ────────────────────────────────────────────────────

export function useAssignments(filters?: { requestid?: number; authorityid?: number }) {
  const [assignments, setAssignments] = useState<AuthorityAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  const requestid   = filters?.requestid;
  const authorityid = filters?.authorityid;

  const fetchAssignments = useCallback(async () => {
    setLoading(true);
    let query = supabase.from("authorityassignment").select("*");

    if (requestid)   query = query.eq("requestid", requestid);
    if (authorityid) query = query.eq("authorityid", authorityid);

    const { data, error } = await query;
    if (!error) setAssignments((data ?? []) as AuthorityAssignment[]);
    setLoading(false);
  }, [requestid, authorityid]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  return { assignments, loading, refetch: fetchAssignments };
}

export async function createAssignment(data: {
  requestid: number;
  authorityid: number;
  notes?: string;
}) {
  const { error } = await supabase.from("authorityassignment").insert({
    ...data,
    status: "Assigned" as AssignmentStatus,
    assignedat: new Date().toISOString(),
  });
  if (error) {
    if (error.code === "23505") {
      toast.error("This authority is already assigned to this request");
    } else {
      toast.error("Failed to assign authority");
      console.error(error);
    }
    return false;
  }
  toast.success("Authority assigned successfully");
  return true;
}

export async function updateAssignmentStatus(
  requestid: number,
  authorityid: number,
  status: AssignmentStatus
) {
  const update: Record<string, unknown> = { status };
  if (status === "Completed") update.completedat = new Date().toISOString();

  const { error } = await supabase
    .from("authorityassignment")
    .update(update)
    .eq("requestid", requestid)
    .eq("authorityid", authorityid);
  if (error) {
    toast.error("Failed to update assignment");
    console.error(error);
    return false;
  }
  toast.success(`Assignment marked as ${status}`);
  return true;
}

// ─── User Help (Volunteering) ─────────────────────────────────────────────────

export function useUserHelp(filters?: { userid?: number; requestid?: number }) {
  const [helps, setHelps] = useState<UserHelp[]>([]);
  const [loading, setLoading] = useState(true);

  const userid    = filters?.userid;
  const requestid = filters?.requestid;

  const fetchHelps = useCallback(async () => {
    setLoading(true);
    let query = supabase.from("userhelp").select("*");

    if (userid)    query = query.eq("userid", userid);
    if (requestid) query = query.eq("requestid", requestid);

    const { data, error } = await query;
    if (!error) setHelps((data ?? []) as UserHelp[]);
    setLoading(false);
  }, [userid, requestid]);

  useEffect(() => {
    fetchHelps();
  }, [fetchHelps]);

  return { helps, loading, refetch: fetchHelps };
}

export async function volunteerForRequest(requestid: number, userid: number) {
  const { error } = await supabase.from("userhelp").insert({
    requestid,
    userid,
    status: "Active",
    joinedat: new Date().toISOString(),
  });
  if (error) {
    if (error.code === "23505") {
      toast.error("You have already volunteered for this request");
    } else {
      toast.error("Failed to volunteer");
      console.error(error);
    }
    return false;
  }
  toast.success("You're now volunteering on this request!");
  return true;
}

export async function withdrawVolunteer(requestid: number, userid: number) {
  const { error } = await supabase
    .from("userhelp")
    .update({ status: "Withdrawn", completedat: new Date().toISOString() })
    .eq("requestid", requestid)
    .eq("userid", userid);
  if (error) {
    toast.error("Failed to withdraw");
    console.error(error);
    return false;
  }
  toast.success("Withdrawn from request");
  return true;
}

// ─── Authorities ──────────────────────────────────────────────────────────────

export function useAuthorities() {
  const [authorities, setAuthorities] = useState<Authority[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAuthorities = useCallback(async () => {
    const { data, error } = await supabase.from("authority").select("*").order("authorityid");
    if (!error) setAuthorities((data ?? []) as Authority[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAuthorities();
  }, [fetchAuthorities]);

  return { authorities, loading, refetch: fetchAuthorities };
}

// ─── Login helpers ────────────────────────────────────────────────────────────

export async function fetchUsers() {
  const { data, error } = await supabase
    .from("User")
    .select("userid, fname, lname, zoneid, wishtovolunteer, level")
    .order("userid");
  if (error) {
    console.error(error);
    return [];
  }
  return data ?? [];
}

export async function fetchAuthoritiesForLogin() {
  const { data, error } = await supabase
    .from("authority")
    .select("authorityid, fname, lname, branchid, rank, email")
    .order("authorityid");
  if (error) {
    console.error(error);
    return [];
  }
  return data ?? [];
}
