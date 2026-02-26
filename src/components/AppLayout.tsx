import { useApp } from "@/context/AppContext";
import { Radio, LogOut, Shield, User, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, setCurrentUser } = useApp();

  const roleIcon = {
    CITIZEN: User,
    ADMIN: Shield,
    AUTHORITY: Radio,
    VOLUNTEER: Heart,
  };
  const Icon = currentUser ? roleIcon[currentUser.role] : User;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
              <Radio className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-mono font-bold text-foreground tracking-tight">DISASTERHQ</span>
          </div>

          {currentUser && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm">
                <Icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground font-medium">{currentUser.fname} {currentUser.lname}</span>
                <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                  {currentUser.role}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setCurrentUser(null)} className="text-muted-foreground hover:text-foreground">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
};

export default AppLayout;
