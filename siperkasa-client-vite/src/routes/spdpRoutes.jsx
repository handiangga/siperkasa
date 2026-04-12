import { Route } from "react-router-dom";
import SpdpPage from "../pages/spdp/SpdpPage";
import SpdpCreate from "../pages/spdp/SpdpCreate";
import SpdpDetail from "../pages/spdp/SpdpDetail";
import SpdpEdit from "../pages/spdp/SpdpEdit";
import useAuth from "../hooks/useAuth";

export default function SpdpRoutes() {
  const { user } = useAuth();

  return (
    <>
      {/* LIST */}
      <Route path="/spdp" element={<SpdpPage />} />

      {/* DETAIL */}
      <Route path="/spdp/:id" element={<SpdpDetail />} />

      {/* CREATE */}
      {["admin", "operator"].includes(user?.role) && (
        <Route path="/spdp/create" element={<SpdpCreate />} />
      )}

      {/* EDIT */}
      {user?.role === "admin" && (
        <Route path="/spdp/edit/:id" element={<SpdpEdit />} />
      )}
    </>
  );
}
