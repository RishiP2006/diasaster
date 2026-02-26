export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      authority: {
        Row: {
          authorityid: number
          availabilitystatus:
            | Database["public"]["Enums"]["authority_availability"]
            | null
          badgenumber: string | null
          branchid: number | null
          contactnumber: string | null
          email: string | null
          fname: string
          lname: string
          passwordhash: string
          rank: string | null
        }
        Insert: {
          authorityid?: number
          availabilitystatus?:
            | Database["public"]["Enums"]["authority_availability"]
            | null
          badgenumber?: string | null
          branchid?: number | null
          contactnumber?: string | null
          email?: string | null
          fname: string
          lname: string
          passwordhash: string
          rank?: string | null
        }
        Update: {
          authorityid?: number
          availabilitystatus?:
            | Database["public"]["Enums"]["authority_availability"]
            | null
          badgenumber?: string | null
          branchid?: number | null
          contactnumber?: string | null
          email?: string | null
          fname?: string
          lname?: string
          passwordhash?: string
          rank?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "authority_branchid_fkey"
            columns: ["branchid"]
            isOneToOne: false
            referencedRelation: "deptbranch"
            referencedColumns: ["branchid"]
          },
        ]
      }
      authorityassignment: {
        Row: {
          assignedat: string | null
          authorityid: number
          completedat: string | null
          notes: string | null
          requestid: number
          status: Database["public"]["Enums"]["assignment_status"] | null
        }
        Insert: {
          assignedat?: string | null
          authorityid: number
          completedat?: string | null
          notes?: string | null
          requestid: number
          status?: Database["public"]["Enums"]["assignment_status"] | null
        }
        Update: {
          assignedat?: string | null
          authorityid?: number
          completedat?: string | null
          notes?: string | null
          requestid?: number
          status?: Database["public"]["Enums"]["assignment_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "authorityassignment_authorityid_fkey"
            columns: ["authorityid"]
            isOneToOne: false
            referencedRelation: "authority"
            referencedColumns: ["authorityid"]
          },
          {
            foreignKeyName: "authorityassignment_requestid_fkey"
            columns: ["requestid"]
            isOneToOne: false
            referencedRelation: "request"
            referencedColumns: ["requestid"]
          },
        ]
      }
      crisistype: {
        Row: {
          crisistypeid: number
          defaultdescription: string | null
          defaultseverity: number | null
          typename: string
        }
        Insert: {
          crisistypeid?: number
          defaultdescription?: string | null
          defaultseverity?: number | null
          typename: string
        }
        Update: {
          crisistypeid?: number
          defaultdescription?: string | null
          defaultseverity?: number | null
          typename?: string
        }
        Relationships: []
      }
      department: {
        Row: {
          contactnumber: string | null
          depthead: number | null
          deptid: number
          deptname: string
          description: string | null
          email: string | null
        }
        Insert: {
          contactnumber?: string | null
          depthead?: number | null
          deptid?: number
          deptname: string
          description?: string | null
          email?: string | null
        }
        Update: {
          contactnumber?: string | null
          depthead?: number | null
          deptid?: number
          deptname?: string
          description?: string | null
          email?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_dept_head"
            columns: ["depthead"]
            isOneToOne: false
            referencedRelation: "authority"
            referencedColumns: ["authorityid"]
          },
        ]
      }
      deptbranch: {
        Row: {
          branchhead: string | null
          branchid: number
          branchname: string
          contactnumber: string | null
          deptid: number | null
          email: string | null
          zoneid: number | null
        }
        Insert: {
          branchhead?: string | null
          branchid?: number
          branchname: string
          contactnumber?: string | null
          deptid?: number | null
          email?: string | null
          zoneid?: number | null
        }
        Update: {
          branchhead?: string | null
          branchid?: number
          branchname?: string
          contactnumber?: string | null
          deptid?: number | null
          email?: string | null
          zoneid?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "deptbranch_deptid_fkey"
            columns: ["deptid"]
            isOneToOne: false
            referencedRelation: "department"
            referencedColumns: ["deptid"]
          },
          {
            foreignKeyName: "deptbranch_zoneid_fkey"
            columns: ["zoneid"]
            isOneToOne: false
            referencedRelation: "zone"
            referencedColumns: ["zoneid"]
          },
        ]
      }
      depthandlecrisistype: {
        Row: {
          crisistypeid: number
          deptid: number
        }
        Insert: {
          crisistypeid: number
          deptid: number
        }
        Update: {
          crisistypeid?: number
          deptid?: number
        }
        Relationships: [
          {
            foreignKeyName: "depthandlecrisistype_crisistypeid_fkey"
            columns: ["crisistypeid"]
            isOneToOne: false
            referencedRelation: "crisistype"
            referencedColumns: ["crisistypeid"]
          },
          {
            foreignKeyName: "depthandlecrisistype_deptid_fkey"
            columns: ["deptid"]
            isOneToOne: false
            referencedRelation: "department"
            referencedColumns: ["deptid"]
          },
        ]
      }
      family: {
        Row: {
          createdat: string | null
          createdby: number | null
          cumulativelevel: number | null
          familyid: number
          familyname: string
          nummembers: number | null
        }
        Insert: {
          createdat?: string | null
          createdby?: number | null
          cumulativelevel?: number | null
          familyid?: number
          familyname: string
          nummembers?: number | null
        }
        Update: {
          createdat?: string | null
          createdby?: number | null
          cumulativelevel?: number | null
          familyid?: number
          familyname?: string
          nummembers?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_family_createdby"
            columns: ["createdby"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["userid"]
          },
        ]
      }
      request: {
        Row: {
          createdby: number | null
          crisistypeid: number | null
          description: string | null
          enddatetime: string | null
          numvolunteerneeded: number | null
          requestid: number
          severity: number | null
          startdatetime: string | null
          status: Database["public"]["Enums"]["request_status"] | null
          title: string
          zoneid: number | null
        }
        Insert: {
          createdby?: number | null
          crisistypeid?: number | null
          description?: string | null
          enddatetime?: string | null
          numvolunteerneeded?: number | null
          requestid?: number
          severity?: number | null
          startdatetime?: string | null
          status?: Database["public"]["Enums"]["request_status"] | null
          title: string
          zoneid?: number | null
        }
        Update: {
          createdby?: number | null
          crisistypeid?: number | null
          description?: string | null
          enddatetime?: string | null
          numvolunteerneeded?: number | null
          requestid?: number
          severity?: number | null
          startdatetime?: string | null
          status?: Database["public"]["Enums"]["request_status"] | null
          title?: string
          zoneid?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "request_createdby_fkey"
            columns: ["createdby"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["userid"]
          },
          {
            foreignKeyName: "request_crisistypeid_fkey"
            columns: ["crisistypeid"]
            isOneToOne: false
            referencedRelation: "crisistype"
            referencedColumns: ["crisistypeid"]
          },
          {
            foreignKeyName: "request_zoneid_fkey"
            columns: ["zoneid"]
            isOneToOne: false
            referencedRelation: "zone"
            referencedColumns: ["zoneid"]
          },
        ]
      }
      User: {
        Row: {
          aadharno: string | null
          familyid: number | null
          fname: string
          level: number | null
          lname: string | null
          passwordhash: string
          phone: string | null
          registrationdate: string | null
          userid: number
          wishtovolunteer: boolean | null
          zoneid: number | null
        }
        Insert: {
          aadharno?: string | null
          familyid?: number | null
          fname: string
          level?: number | null
          lname?: string | null
          passwordhash: string
          phone?: string | null
          registrationdate?: string | null
          userid?: number
          wishtovolunteer?: boolean | null
          zoneid?: number | null
        }
        Update: {
          aadharno?: string | null
          familyid?: number | null
          fname?: string
          level?: number | null
          lname?: string | null
          passwordhash?: string
          phone?: string | null
          registrationdate?: string | null
          userid?: number
          wishtovolunteer?: boolean | null
          zoneid?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "User_familyid_fkey"
            columns: ["familyid"]
            isOneToOne: false
            referencedRelation: "family"
            referencedColumns: ["familyid"]
          },
          {
            foreignKeyName: "User_zoneid_fkey"
            columns: ["zoneid"]
            isOneToOne: false
            referencedRelation: "zone"
            referencedColumns: ["zoneid"]
          },
        ]
      }
      userhelp: {
        Row: {
          completedat: string | null
          joinedat: string | null
          requestid: number
          status: Database["public"]["Enums"]["userhelp_status"] | null
          userid: number
        }
        Insert: {
          completedat?: string | null
          joinedat?: string | null
          requestid: number
          status?: Database["public"]["Enums"]["userhelp_status"] | null
          userid: number
        }
        Update: {
          completedat?: string | null
          joinedat?: string | null
          requestid?: number
          status?: Database["public"]["Enums"]["userhelp_status"] | null
          userid?: number
        }
        Relationships: [
          {
            foreignKeyName: "userhelp_requestid_fkey"
            columns: ["requestid"]
            isOneToOne: false
            referencedRelation: "request"
            referencedColumns: ["requestid"]
          },
          {
            foreignKeyName: "userhelp_userid_fkey"
            columns: ["userid"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["userid"]
          },
        ]
      }
      zone: {
        Row: {
          location: string | null
          numresidents: number | null
          risklevel: number | null
          state: string | null
          zoneid: number
          zonename: string
        }
        Insert: {
          location?: string | null
          numresidents?: number | null
          risklevel?: number | null
          state?: string | null
          zoneid?: number
          zonename: string
        }
        Update: {
          location?: string | null
          numresidents?: number | null
          risklevel?: number | null
          state?: string | null
          zoneid?: number
          zonename?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      assignment_status: "Assigned" | "InProgress" | "Completed" | "Withdrawn"
      authority_availability: "AVAILABLE" | "ONDUTY" | "OFFLINE"
      request_status: "Open" | "InProgress" | "Resolved" | "Closed"
      userhelp_status: "Active" | "Completed" | "Withdrawn"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      assignment_status: ["Assigned", "InProgress", "Completed", "Withdrawn"],
      authority_availability: ["AVAILABLE", "ONDUTY", "OFFLINE"],
      request_status: ["Open", "InProgress", "Resolved", "Closed"],
      userhelp_status: ["Active", "Completed", "Withdrawn"],
    },
  },
} as const
