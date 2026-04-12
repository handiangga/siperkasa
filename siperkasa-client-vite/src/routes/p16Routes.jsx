import { Route, Navigate } from "react-router-dom";
import { getUser } from "../utils/auth";

import P16Page from "../pages/p16/P16Page";
import P16DetailPage from "../pages/p16/P16DetailPage";
import P16EditPage from "../pages/p16/P16EditPage";

export default function P16Routes() {
  const user = getUser();

  return [
    <Route key="p16" path="/p16" element={<P16Page />} />,
    <Route key="p16-detail" path="/p16/:id" element={<P16DetailPage />} />,

    <Route
      key="p16-edit"
      path="/p16/edit/:id"
      element={
        ["admin", "operator"].includes(user?.role) ? (
          <P16EditPage />
        ) : (
          <Navigate to="/dashboard" />
        )
      }
    />,
  ];
}
