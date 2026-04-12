import DashboardKajari from "../pages/dashboard/dashboardKajari";
import DashboardJaksa from "../pages/dashboard/dashboardJaksa";
import useAuth from "../hooks/useAuth";

export default function DashboardRoutes() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user?.role === "jaksa") {
    return <DashboardJaksa />;
  }

  return <DashboardKajari />;
}
