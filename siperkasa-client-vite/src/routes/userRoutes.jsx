import { Route } from "react-router-dom";
import UserPage from "../pages/user/UserPage";
import UserForm from "../pages/user/UserForm";
import useAuth from "../hooks/useAuth";

export default function UserRoutes() {
  const { user } = useAuth();

  if (user?.role !== "admin") return null;

  return (
    <>
      {/* 🔥 EDIT */}
      <Route path="/users/edit/:id" element={<UserForm />} />

      {/* CREATE */}
      <Route path="/users/create" element={<UserForm />} />

      {/* LIST */}
      <Route path="/users" element={<UserPage />} />
    </>
  );
}
