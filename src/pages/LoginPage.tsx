import { useState, useEffect } from "react";
import { useApp, type AppUser } from "@/context/AppContext";
import { fetchUsers, fetchAuthoritiesForLogin } from "@/hooks/useSupabaseData";
import { Shield, User, Radio, Heart, Loader2, AlertCircle } from "lucide-react";
import type { Role } from "@/context/AppContext";

const roleConfig: Record<Role, { icon: React.ElementType; label: string; color: string; description: string }> = {
  CITIZEN:   { icon: User,   label: "Citizen",   color: "bg-info text-info-foreground",       description: "Report disasters & view the public feed" },
  ADMIN:     { icon: Shield, label: "Admin",     color: "bg-primary text-primary-foreground", description: "Manage all requests, assign responders" },
  AUTHORITY: { icon: Radio,  label: "Responder", color: "bg-warning text-warning-foreground", description: "Handle assigned incidents, update status" },
  VOLUNTEER: { icon: Heart,  label: "Volunteer", color: "bg-success text-success-foreground", description: "Browse active requests, offer help" },
};

const ROLE_ORDER: Role[] = ["ADMIN", "AUTHORITY", "VOLUNTEER", "CITIZEN"];

const LoginPage = () => {
  const { setCurrentUser } = useApp();
  const [availableUsers, setAvailableUsers] = useState<AppUser[]>([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState<string | null>(null);
  const [selectedRole, setSelectedRole]     = useState<Role | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [users, authorities] = await Promise.all([
          fetchUsers(),
          fetchAuthoritiesForLogin(),
        ]);

        const mapped: AppUser[] = [];

        for (const u of users) {
          let role: Role = "CITIZEN";
          if ((u as any).level >= 5)          role = "ADMIN";
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

        for (const a of authorities) {
          mapped.push({
            id: a.authorityid,
            fname: a.fname,
            lname: a.lname ?? "",
            role: "AUTHORITY",
            source: "authority",
          });
        }

        // Fallback demo users if DB is empty
        if (mapped.length === 0) {
          mapped.push(
            { id: 1, fname: "Sarah",  lname: "Chen",     role: "ADMIN",     source: "user",      zoneid: 3 },
            { id: 1, fname: "Marcus", lname: "Torres",   role: "AUTHORITY", source: "authority"           },
            { id: 3, fname: "Kenji",  lname: "Yamamoto", role: "VOLUNTEER", source: "user"                },
            { id: 7, fname: "James",  lname: "Martinez", role: "CITIZEN",   source: "user",      zoneid: 1 },
          );
        }

        setAvailableUsers(mapped);
      } catch (e) {
        setError("Could not connect to database. Using demo mode.");
        setAvailableUsers([
          { id: 1, fname: "Sarah",  lname: "Chen",     role: "ADMIN",     source: "user",      zoneid: 3 },
          { id: 1, fname: "Marcus", lname: "Torres",   role: "AUTHORITY", source: "authority"           },
          { id: 3, fname: "Kenji",  lname: "Yamamoto", role: "VOLUNTEER", source: "user"                },
          { id: 7, fname: "James",  lname: "Martinez", role: "CITIZEN",   source: "user",      zoneid: 1 },
        ]);
      }
      setLoading(false);
    };
    load();
  }, []);

  const byRole = ROLE_ORDER.reduce<Record<Role, AppUser[]>>(
    (acc, r) => {
      acc[r] = availableUsers.filter((u) => u.role === r);
      return acc;
    },
    { ADMIN: [], AUTHORITY: [], VOLUNTEER: [], CITIZEN: [] }
  );

  const displayedUsers = selectedRole ? byRole[selectedRole] : [];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center glow-red">
              <Radio className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold font-mono tracking-tight text-foreground">
              DISASTERHQ
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Disaster Management &amp; Community Response System
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-warning/10 border border-warning/30 text-warning text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="glass-card rounded-lg p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-mono">Loading users…</span>
            </div>
          ) : !selectedRole ? (
            /* ── Step 1: pick role ── */
            <>
              <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">
                Select Your Role
              </h2>
              <div className="grid gap-3">
                {ROLE_ORDER.map((role) => {
                  const cfg  = roleConfig[role];
                  const Icon = cfg.icon;
                  const count = byRole[role].length;
                  return (
                    <button
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      disabled={count === 0}
                      className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary border border-border/50 hover:border-border transition-all text-left disabled:opacity-40 disabled:cursor-not-allowed group"
                    >
                      <div className={`w-10 h-10 rounded-md ${cfg.color} flex items-center justify-center shrink-0`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-foreground">{cfg.label}</div>
                        <div className="text-xs text-muted-foreground truncate">{cfg.description}</div>
                      </div>
                      <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded shrink-0">
                        {count} user{count !== 1 ? "s" : ""}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            /* ── Step 2: pick user ── */
            <>
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={() => setSelectedRole(null)}
                  className="text-xs text-muted-foreground hover:text-foreground font-mono transition-colors"
                >
                  ← Back
                </button>
                <span className="text-xs text-muted-foreground">/</span>
                <span className="text-xs font-mono text-foreground">{roleConfig[selectedRole].label}</span>
              </div>
              <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">
                Select User
              </h2>
              <div className="grid gap-3 max-h-80 overflow-y-auto">
                {displayedUsers.map((user) => {
                  const cfg  = roleConfig[user.role];
                  const Icon = cfg.icon;
                  return (
                    <button
                      key={`${user.source}-${user.id}`}
                      onClick={() => setCurrentUser(user)}
                      className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary border border-border/50 hover:border-border transition-all group text-left"
                    >
                      <div className={`w-9 h-9 rounded-md ${cfg.color} flex items-center justify-center shrink-0`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-foreground text-sm">
                          {user.fname} {user.lname}
                        </div>
                        {user.zoneid && (
                          <div className="text-xs text-muted-foreground">Zone {user.zoneid}</div>
                        )}
                      </div>
                      <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded shrink-0">
                        #{user.id}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Demo mode — click any user to enter their dashboard
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
