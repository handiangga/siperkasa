import { Route } from "react-router-dom";
import P16Page from "../pages/p16/P16Page";
import P16EditPage from "../pages/p16/P16EditPage";
import P16DetailPage from "../pages/p16/P16DetailPage";
import useAuth from "../hooks/useAuth"; // 🔥 WAJIB

export default function P16Routes() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <>
      {/* 🔥 EDIT */}
      {["admin", "operator"].includes(user.role) && (
        <Route path="/p16/edit/:id" element={<P16EditPage />} />
      )}

      {/* 🔥 DETAIL */}
      <Route path="/p16/:id" element={<P16DetailPage />} />

      {/* 🔥 LIST */}
      <Route path="/p16" element={<P16Page />} />
    </>
  );
}
