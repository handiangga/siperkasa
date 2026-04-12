import { Route, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

import UserPage from "../pages/user/UserPage";
import UserForm from "../pages/user/UserForm";

export default function UserRoutes() {
  const { user, loading } = useAuth();
  if (loading) return null;

  return (
    <>
      <Route
        path="/users"
        element={
          user?.role === "admin" ? <UserPage /> : <Navigate to="/dashboard" />
        }
      />

      <Route
        path="/users/create"
        element={
          user?.role === "admin" ? <UserForm /> : <Navigate to="/dashboard" />
        }
      />

      <Route
        path="/users/edit/:id"
        element={
          user?.role === "admin" ? <UserForm /> : <Navigate to="/dashboard" />
        }
      />
    </>
  );
}
