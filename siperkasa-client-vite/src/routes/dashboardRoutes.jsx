import DashboardKajari from "../pages/dashboard/dashboardKajari";
import DashboardJaksa from "../pages/dashboard/dashboardJaksa";
import { getUser } from "../utils/auth";

export default function DashboardRoutes() {
  const user = getUser();

  if (user?.role === "jaksa") {
    return <DashboardJaksa />;
  }

  return <DashboardKajari />;
}
