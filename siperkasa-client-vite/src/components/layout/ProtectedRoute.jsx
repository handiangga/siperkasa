import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading from "../common/Loading"; // 🔥 tambahin

export default function ProtectedRoute() {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const t = localStorage.getItem("access_token");
    setToken(t);
    setLoading(false);
  }, []);

  // 🔥 kasih loading biar smooth
  if (loading) return <Loading />;

  // ❌ belum login
  if (!token || token === "undefined" || token === "null") {
    return <Navigate to="/" replace />;
  }

  // ✅ aman
  return <Outlet />;
}
