import { Route } from "react-router-dom";
import JaksaPage from "../pages/jaksa/JaksaPage";
import JaksaDetail from "../pages/jaksa/JaksaDetail";
import JaksaForm from "../pages/jaksa/JaksaForm";
import useAuth from "../hooks/useAuth";

export default function JaksaRoutes() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <>
      <Route path="/jaksa" element={<JaksaPage />} />
      <Route path="/jaksa/:id" element={<JaksaDetail />} />

      {["admin", "operator"].includes(user?.role) && (
        <Route path="/jaksa/create" element={<JaksaForm />} />
      )}

      {user?.role === "admin" && (
        <Route path="/jaksa/edit/:id" element={<JaksaForm />} />
      )}
    </>
  );
}
