import { Route } from "react-router-dom";
import UserPage from "../pages/user/UserPage";
import UserForm from "../pages/user/UserForm";
import useAuth from "../hooks/useAuth";

export default function UserRoutes() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <>
      <Route path="/users" element={<UserPage />} />

      {user?.role === "admin" && (
        <Route path="/users/create" element={<UserForm />} />
      )}

      {user?.role === "admin" && (
        <Route path="/users/edit/:id" element={<UserForm />} />
      )}
    </>
  );
}
