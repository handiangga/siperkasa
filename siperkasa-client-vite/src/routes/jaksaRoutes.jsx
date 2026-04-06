import { Route } from "react-router-dom";
import JaksaPage from "../pages/JaksaPage";
import JaksaDetail from "../pages/JaksaDetail";
import JaksaForm from "../pages/JaksaForm";

const jaksaRoutes = (
  <>
    <Route path="/jaksa" element={<JaksaPage />} />
    <Route path="/jaksa/:id" element={<JaksaDetail />} />
    <Route path="/jaksa/create" element={<JaksaForm />} />
    <Route path="/jaksa/edit/:id" element={<JaksaForm />} />
  </>
);

export default jaksaRoutes;
