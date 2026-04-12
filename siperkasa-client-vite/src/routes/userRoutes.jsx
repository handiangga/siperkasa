import { Route, Navigate } from "react-router-dom";
import { getUser } from "../utils/auth";

import UserPage from "../pages/user/UserPage";
import UserForm from "../pages/user/UserForm";

export default function UserRoutes() {
  const user = getUser();

  return [
    <Route
      key="users"
      path="/users"
      element={
        user?.role === "admin" ? <UserPage /> : <Navigate to="/dashboard" />
      }
    />,

    <Route
      key="users-create"
      path="/users/create"
      element={
        user?.role === "admin" ? <UserForm /> : <Navigate to="/dashboard" />
      }
    />,

    <Route
      key="users-edit"
      path="/users/edit/:id"
      element={
        user?.role === "admin" ? <UserForm /> : <Navigate to="/dashboard" />
      }
    />,
  ];
}
