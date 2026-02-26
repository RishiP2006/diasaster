import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useApp, type Zone, type CrisisType, type Request, type AuthorityAssignment, type UserHelp, type Authority, type RequestStatus, type AssignmentStatus } from "@/context/AppContext";
import { toast } from "sonner";

// Fetch reference data (zones, crisis types) on mount
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
  }, [setZones, setCrisisTypes]);
}

// Fetch requests with optional filters
export function useRequests(filters?: {
  createdby?: number;
  zoneid?: number;
  status?: RequestStatus | null;
}) {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    let query = supabase.from("request").select("*").order("requestid", { ascending: false });

    if (filters?.createdby) query = query.eq("createdby", filters.createdby);
    if (filters?.zoneid) query = query.eq("zoneid", filters.zoneid);
    if (filters?.status) query = query.eq("status", filters.status);

    const { data, error } = await query;
    if (error) {
      toast.error("Failed to fetch requests");
      console.error(error);
    } else {
      setRequests((data ?? []) as Request[]);
    }
    setLoading(false);
  }, [filters?.createdby, filters?.zoneid, filters?.status]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return { requests, loading, refetch: fetchRequests };
}

// Create a new request
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
  });
  if (error) {
    toast.error("Failed to submit report");
    console.error(error);
    return false;
  }
  toast.success("Disaster reported successfully");
  return true;
}

// Update request status
export async function updateRequestStatus(requestid: number, status: RequestStatus) {
  const { error } = await supabase
    .from("request")
    .update({ status })
    .eq("requestid", requestid);
  if (error) {
    toast.error("Failed to update status");
    console.error(error);
    return false;
  }
  toast.success(`Status updated to ${status}`);
  return true;
}

// Fetch authority assignments for a request or authority
export function useAssignments(filters?: { requestid?: number; authorityid?: number }) {
  const [assignments, setAssignments] = useState<AuthorityAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAssignments = useCallback(async () => {
    setLoading(true);
    let query = supabase.from("authorityassignment").select("*");

    if (filters?.requestid) query = query.eq("requestid", filters.requestid);
    if (filters?.authorityid) query = query.eq("authorityid", filters.authorityid);

    const { data, error } = await query;
    if (!error) setAssignments((data ?? []) as AuthorityAssignment[]);
    setLoading(false);
  }, [filters?.requestid, filters?.authorityid]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  return { assignments, loading, refetch: fetchAssignments };
}

// Create an authority assignment
export async function createAssignment(data: {
  requestid: number;
  authorityid: number;
  notes?: string;
}) {
  const { error } = await supabase.from("authorityassignment").insert({
    ...data,
    status: "Assigned" as AssignmentStatus,
  });
  if (error) {
    toast.error("Failed to assign authority");
    console.error(error);
    return false;
  }
  toast.success("Authority assigned");
  return true;
}

// Update assignment status
export async function updateAssignmentStatus(
  requestid: number,
  authorityid: number,
  status: AssignmentStatus
) {
  const { error } = await supabase
    .from("authorityassignment")
    .update({ status, ...(status === "Completed" ? { completedat: new Date().toISOString() } : {}) })
    .eq("requestid", requestid)
    .eq("authorityid", authorityid);
  if (error) {
    toast.error("Failed to update assignment");
    console.error(error);
    return false;
  }
  toast.success(`Assignment ${status}`);
  return true;
}

// Fetch user help entries
export function useUserHelp(filters?: { userid?: number; requestid?: number }) {
  const [helps, setHelps] = useState<UserHelp[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHelps = useCallback(async () => {
    setLoading(true);
    let query = supabase.from("userhelp").select("*");

    if (filters?.userid) query = query.eq("userid", filters.userid);
    if (filters?.requestid) query = query.eq("requestid", filters.requestid);

    const { data, error } = await query;
    if (!error) setHelps((data ?? []) as UserHelp[]);
    setLoading(false);
  }, [filters?.userid, filters?.requestid]);

  useEffect(() => {
    fetchHelps();
  }, [fetchHelps]);

  return { helps, loading, refetch: fetchHelps };
}

// Volunteer to help on a request
export async function volunteerForRequest(requestid: number, userid: number) {
  const { error } = await supabase.from("userhelp").insert({
    requestid,
    userid,
    status: "Active",
  });
  if (error) {
    if (error.code === "23505") {
      toast.error("Already volunteered for this request");
    } else {
      toast.error("Failed to volunteer");
      console.error(error);
    }
    return false;
  }
  toast.success("Volunteered successfully!");
  return true;
}

// Fetch authorities
export function useAuthorities() {
  const [authorities, setAuthorities] = useState<Authority[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase.from("authority").select("*").order("authorityid");
      if (!error) setAuthorities((data ?? []) as Authority[]);
      setLoading(false);
    };
    fetch();
  }, []);

  return { authorities, loading };
}

// Fetch all users from User table
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

// Fetch all authorities for login
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
