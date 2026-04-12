import { Route, Navigate } from "react-router-dom";
import { getUser } from "../utils/auth";

import JaksaPage from "../pages/jaksa/JaksaPage";
import JaksaDetail from "../pages/jaksa/JaksaDetail";
import JaksaForm from "../pages/jaksa/JaksaForm";

export default function JaksaRoutes() {
  const user = getUser();

  return [
    <Route key="jaksa" path="/jaksa" element={<JaksaPage />} />,
    <Route key="jaksa-detail" path="/jaksa/:id" element={<JaksaDetail />} />,

    <Route
      key="jaksa-create"
      path="/jaksa/create"
      element={
        ["admin", "operator"].includes(user?.role) ? (
          <JaksaForm />
        ) : (
          <Navigate to="/dashboard" />
        )
      }
    />,

    <Route
      key="jaksa-edit"
      path="/jaksa/edit/:id"
      element={
        user?.role === "admin" ? <JaksaForm /> : <Navigate to="/dashboard" />
      }
    />,
  ];
}
