import { Route } from "react-router-dom";
import UserPage from "../pages/user/UserPage";
import UserForm from "../pages/user/UserForm";
import useAuth from "../hooks/useAuth";

export default function UserRoutes() {
  const { user } = useAuth();

  return (
    <>
      {/* LIST */}
      <Route path="/users" element={<UserPage />} />

      {/* CREATE */}
      {user?.role === "admin" && (
        <Route path="/users/create" element={<UserForm />} />
      )}

      {/* EDIT */}
      {user?.role === "admin" && (
        <Route path="/users/edit/:id" element={<UserForm />} />
      )}
    </>
  );
}
