import DashboardKajari from "../pages/dashboard/dashboardKajari";
import DashboardJaksa from "../pages/dashboard/dashboardJaksa";
import useAuth from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

export default function DashboardRoutes() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" replace />;

  if (user.role === "jaksa") return <DashboardJaksa />;

  return <DashboardKajari />;
}
