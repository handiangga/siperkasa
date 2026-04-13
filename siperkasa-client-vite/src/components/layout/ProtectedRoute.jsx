import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProtectedRoute() {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const t = localStorage.getItem("access_token");
    setToken(t);
    setLoading(false);
  }, []);

  // 🔥 tahan dulu biar gak redirect prematur
  if (loading) return null;

  // ❌ belum login
  if (!token || token === "undefined") {
    return <Navigate to="/" replace />;
  }

  // ✅ aman
  return <Outlet />;
}
