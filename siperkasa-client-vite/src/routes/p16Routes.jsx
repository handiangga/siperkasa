import { Route } from "react-router-dom";
import P16Page from "../pages/P16Page";
import P16EditPage from "../pages/P16EditPage";
import P16DetailPage from "../pages/P16DetailPage.jsx";

const p16Routes = (
  <>
    <Route path="/p16" element={<P16Page />} />
    <Route path="/p16/edit/:id" element={<P16EditPage />} />
    <Route path="/p16/:id" element={<P16DetailPage />} />
  </>
);

export default p16Routes;
