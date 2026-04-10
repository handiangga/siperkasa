import { Route } from "react-router-dom";
import JaksaPage from "../pages/jaksa/JaksaPage";
import JaksaDetail from "../pages/jaksa/JaksaDetail";
import JaksaForm from "../pages/jaksa/JaksaForm";
import useAuth from "../hooks/useAuth";

export default function JaksaRoutes() {
  const { user } = useAuth();

  return (
    <>
      {/* 🔥 VIEW (admin, kajari, operator) */}
      {["admin", "kajari", "operator"].includes(user?.role) && (
        <>
          <Route path="/jaksa" element={<JaksaPage />} />
          <Route path="/jaksa/:id" element={<JaksaDetail />} />
        </>
      )}

      {/* 🔥 CREATE & EDIT (admin only) */}
      {user?.role === "admin" && (
        <>
          <Route path="/jaksa/create" element={<JaksaForm />} />
          <Route path="/jaksa/edit/:id" element={<JaksaForm />} />
        </>
      )}
    </>
  );
}
