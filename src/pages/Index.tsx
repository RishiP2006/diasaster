import { useApp } from "@/context/AppContext";
import { useReferenceData } from "@/hooks/useSupabaseData";
import AppLayout from "@/components/AppLayout";
import LoginPage from "@/pages/LoginPage";
import CitizenDashboard from "@/pages/CitizenDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import AuthorityDashboard from "@/pages/AuthorityDashboard";
import VolunteerDashboard from "@/pages/VolunteerDashboard";

const Index = () => {
  const { currentUser } = useApp();
  useReferenceData();

  if (!currentUser) return <LoginPage />;

  const dashboards = {
    CITIZEN: <CitizenDashboard />,
    ADMIN: <AdminDashboard />,
    AUTHORITY: <AuthorityDashboard />,
    VOLUNTEER: <VolunteerDashboard />,
  };

  return <AppLayout>{dashboards[currentUser.role]}</AppLayout>;
};

export default Index;
