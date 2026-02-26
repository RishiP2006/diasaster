import { useState, useEffect } from "react";
import { useApp, type AppUser } from "@/context/AppContext";
import { fetchUsers, fetchAuthoritiesForLogin } from "@/hooks/useSupabaseData";
import { Shield, User, Radio, Heart, Loader2 } from "lucide-react";
import type { Role } from "@/context/AppContext";

const roleConfig: Record<Role, { icon: React.ElementType; label: string; color: string }> = {
  CITIZEN: { icon: User, label: "Citizen", color: "bg-info text-info-foreground" },
  ADMIN: { icon: Shield, label: "Admin", color: "bg-primary text-primary-foreground" },
  AUTHORITY: { icon: Radio, label: "Authority", color: "bg-warning text-warning-foreground" },
  VOLUNTEER: { icon: Heart, label: "Volunteer", color: "bg-success text-success-foreground" },
};

const LoginPage = () => {
  const { setCurrentUser } = useApp();
  const [availableUsers, setAvailableUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [users, authorities] = await Promise.all([
        fetchUsers(),
        fetchAuthoritiesForLogin(),
      ]);

      const mapped: AppUser[] = [];

      // Map DB users
      for (const u of users) {
        let role: Role = "CITIZEN";
        if ((u as any).level && (u as any).level >= 5) role = "ADMIN";
        else if ((u as any).wishtovolunteer) role = "VOLUNTEER";

        mapped.push({
          id: u.userid,
          fname: u.fname,
          lname: u.lname ?? "",
          role,
          zoneid: u.zoneid ?? undefined,
          source: "user",
        });
      }

      // Map authorities
      for (const a of authorities) {
        mapped.push({
          id: a.authorityid,
          fname: a.fname,
          lname: a.lname ?? "",
          role: "AUTHORITY",
          source: "authority",
        });
      }

      // If no users in DB, show demo users
      if (mapped.length === 0) {
        mapped.push(
          { id: 1, fname: "Alice", lname: "Citizen", role: "CITIZEN", source: "user" },
          { id: 2, fname: "Admin", lname: "Ops", role: "ADMIN", source: "user" },
          { id: 3, fname: "Zone 1", lname: "Authority", role: "AUTHORITY", zoneid: 1, source: "authority" },
          { id: 4, fname: "Bob", lname: "Volunteer", role: "VOLUNTEER", source: "user" },
        );
      }

      setAvailableUsers(mapped);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center glow-red">
              <Radio className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold font-mono tracking-tight text-foreground">
              DISASTERHQ
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Disaster Management & Response System
          </p>
        </div>

        <div className="glass-card rounded-lg p-6">
          <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-6">
            Select User to Continue
          </h2>

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid gap-3 max-h-96 overflow-y-auto">
              {availableUsers.map((user) => {
                const cfg = roleConfig[user.role];
                const Icon = cfg.icon;
                return (
                  <button
                    key={`${user.source}-${user.id}`}
                    onClick={() => setCurrentUser(user)}
                    className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary border border-border/50 hover:border-border transition-all group text-left"
                  >
                    <div className={`w-10 h-10 rounded-md ${cfg.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-foreground group-hover:text-foreground/90">
                        {user.fname} {user.lname}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {cfg.label} {user.zoneid ? `· Zone ${user.zoneid}` : ""}
                      </div>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground px-2 py-1 bg-muted rounded">
                      {user.role}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
