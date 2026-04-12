import { Route, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

import SpdpPage from "../pages/spdp/SpdpPage";
import SpdpCreate from "../pages/spdp/SpdpCreate";
import SpdpDetail from "../pages/spdp/SpdpDetail";
import SpdpEdit from "../pages/spdp/SpdpEdit";

export default function SpdpRoutes() {
  const { user, loading } = useAuth();
  if (loading) return null;

  return (
    <>
      <Route path="/spdp" element={<SpdpPage />} />
      <Route path="/spdp/:id" element={<SpdpDetail />} />

      <Route
        path="/spdp/create"
        element={
          ["admin", "operator"].includes(user?.role) ? (
            <SpdpCreate />
          ) : (
            <Navigate to="/dashboard" />
          )
        }
      />

      <Route
        path="/spdp/edit/:id"
        element={
          user?.role === "admin" ? <SpdpEdit /> : <Navigate to="/dashboard" />
        }
      />
    </>
  );
}
