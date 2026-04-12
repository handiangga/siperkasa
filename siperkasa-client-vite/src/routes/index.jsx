import { Routes, Route, Navigate } from "react-router-dom";
import { getUser } from "../utils/auth";

import Login from "../pages/auth/Login";
import DashboardRoutes from "./dashboardRoutes";

import Layout from "../components/layout/Layout";
import ProtectedRoute from "../components/layout/ProtectedRoute";

import ProfilePage from "../pages/profile/ProfilePage";
import ChangePasswordPage from "../pages/profile/ChangePasswordPage";

import SpdpRoutes from "./spdpRoutes";
import JaksaRoutes from "./jaksaRoutes";
import P16Routes from "./p16Routes";
import UserRoutes from "./userRoutes";

export default function AppRoutes() {
  const user = getUser();

  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardRoutes />} />

          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />

          {/* 🔥 FIX FINAL */}
          {SpdpRoutes(user)}
          {JaksaRoutes(user)}
          {P16Routes(user)}
          {UserRoutes(user)}

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}
