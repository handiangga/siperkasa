import { Route } from "react-router-dom";
import SpdpPage from "../pages/SpdpPage";
import SpdpCreate from "../pages/SpdpCreate";
import SpdpDetail from "../pages/SpdpDetail";
import SpdpEdit from "../pages/SpdpEdit";

const spdpRoutes = (
  <>
    <Route path="/spdp" element={<SpdpPage />} />
    <Route path="/spdp/create" element={<SpdpCreate />} />
    <Route path="/spdp/:id" element={<SpdpDetail />} />
    <Route path="/spdp/edit/:id" element={<SpdpEdit />} />
  </>
);

export default spdpRoutes;
