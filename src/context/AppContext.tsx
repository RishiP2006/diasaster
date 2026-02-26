import React, { createContext, useContext, useState, ReactNode } from "react";

export type Role = "CITIZEN" | "ADMIN" | "AUTHORITY" | "VOLUNTEER";

// Matches DB request_status enum: Open, InProgress, Resolved, Closed
export type RequestStatus = "Open" | "InProgress" | "Resolved" | "Closed";

// Matches DB assignment_status enum: Assigned, InProgress, Completed, Withdrawn
export type AssignmentStatus = "Assigned" | "InProgress" | "Completed" | "Withdrawn";

// Matches DB userhelp_status enum: Active, Completed, Withdrawn
export type UserhelpStatus = "Active" | "Completed" | "Withdrawn";

// Matches DB authority_availability enum
export type AuthorityAvailability = "AVAILABLE" | "ONDUTY" | "OFFLINE";

// Represents the logged-in user (could be from User table or authority table)
export interface AppUser {
  id: number;
  fname: string;
  lname: string;
  role: Role;
  zoneid?: number;
  source: "user" | "authority"; // which table they came from
}

// Matches DB zone table
export interface Zone {
  zoneid: number;
  zonename: string;
  location?: string;
  state?: string;
  numresidents?: number;
  risklevel?: number;
}

// Matches DB crisistype table
export interface CrisisType {
  crisistypeid: number;
  typename: string;
  defaultseverity?: number;
  defaultdescription?: string;
}

// Matches DB request table
export interface Request {
  requestid: number;
  crisistypeid?: number;
  createdby?: number;
  zoneid?: number;
  title: string;
  description?: string;
  severity?: number;
  status: RequestStatus;
  numvolunteerneeded?: number;
  startdatetime?: string;
  enddatetime?: string;
  // Joined data
  creator_name?: string;
  zone_name?: string;
  crisis_type_name?: string;
}

// Matches DB authorityassignment table
export interface AuthorityAssignment {
  requestid: number;
  authorityid: number;
  assignedat?: string;
  status?: AssignmentStatus;
  notes?: string;
  completedat?: string;
  // Joined
  authority_name?: string;
}

// Matches DB userhelp table
export interface UserHelp {
  requestid: number;
  userid: number;
  joinedat?: string;
  completedat?: string;
  status?: UserhelpStatus;
  // Joined
  user_name?: string;
  request_title?: string;
}

// Matches DB authority table
export interface Authority {
  authorityid: number;
  branchid?: number;
  fname: string;
  lname: string;
  rank?: string;
  badgenumber?: string;
  contactnumber?: string;
  email?: string;
  availabilitystatus?: AuthorityAvailability;
}

// Matches DB department table
export interface Department {
  deptid: number;
  deptname: string;
  description?: string;
  contactnumber?: string;
  email?: string;
  depthead?: number;
}

// Matches DB deptbranch table
export interface DeptBranch {
  branchid: number;
  deptid?: number;
  zoneid?: number;
  branchname: string;
  contactnumber?: string;
  email?: string;
  branchhead?: string;
}

interface AppContextType {
  currentUser: AppUser | null;
  setCurrentUser: (user: AppUser | null) => void;
  zones: Zone[];
  setZones: React.Dispatch<React.SetStateAction<Zone[]>>;
  crisisTypes: CrisisType[];
  setCrisisTypes: React.Dispatch<React.SetStateAction<CrisisType[]>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [zones, setZones] = useState<Zone[]>([]);
  const [crisisTypes, setCrisisTypes] = useState<CrisisType[]>([]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        zones,
        setZones,
        crisisTypes,
        setCrisisTypes,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
