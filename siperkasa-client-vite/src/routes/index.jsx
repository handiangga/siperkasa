import { Routes, Route, Navigate } from "react-router-dom";

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
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardRoutes />} />

          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />

          {/* 🔥 INI YANG BENAR */}
          {SpdpRoutes()}
          {JaksaRoutes()}
          {P16Routes()}
          {UserRoutes()}

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}
