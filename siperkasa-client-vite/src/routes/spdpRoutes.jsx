import { Route, Navigate } from "react-router-dom";
import { getUser } from "../utils/auth";

import SpdpPage from "../pages/spdp/SpdpPage";
import SpdpCreate from "../pages/spdp/SpdpCreate";
import SpdpDetail from "../pages/spdp/SpdpDetail";
import SpdpEdit from "../pages/spdp/SpdpEdit";

export default function SpdpRoutes() {
  const user = getUser();

  return [
    // ✅ LIST
    <Route key="spdp" path="/spdp" element={<SpdpPage />} />,

    // ✅ CREATE (HARUS DI ATAS DETAIL)
    <Route
      key="spdp-create"
      path="/spdp/create"
      element={
        ["admin", "operator"].includes(user?.role) ? (
          <SpdpCreate />
        ) : (
          <Navigate to="/dashboard" replace />
        )
      }
    />,

    // ✅ EDIT (HARUS DI ATAS DETAIL)
    <Route
      key="spdp-edit"
      path="/spdp/edit/:id"
      element={
        user?.role === "admin" ? (
          <SpdpEdit />
        ) : (
          <Navigate to="/dashboard" replace />
        )
      }
    />,

    // ✅ DETAIL (PALING BAWAH BIAR GAK NANGKEP SEMUA)
    <Route key="spdp-detail" path="/spdp/:id" element={<SpdpDetail />} />,
  ];
}
