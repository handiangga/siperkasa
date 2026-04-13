import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading from "../common/Loading";

export default function ProtectedRoute() {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(undefined); // 🔥 penting (bukan null)

  useEffect(() => {
    const t = localStorage.getItem("access_token");

    // 🔥 sanitize token
    if (!t || t === "undefined" || t === "null") {
      setToken(null);
    } else {
      setToken(t);
    }

    setLoading(false);
  }, []);

  // 🔥 tahan sampai selesai cek token
  if (loading || token === undefined) {
    return <Loading />;
  }

  // ❌ belum login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // ✅ aman
  return <Outlet />;
}
