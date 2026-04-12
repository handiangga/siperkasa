import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import DashboardRoutes from "./dashboardRoutes";

import Layout from "../components/layout/Layout";
import ProtectedRoute from "../components/layout/ProtectedRoute";

import ProfilePage from "../pages/profile/ProfilePage";
import ChangePasswordPage from "../pages/profile/ChangePasswordPage";

// pages langsung
import SpdpPage from "../pages/spdp/SpdpPage";
import SpdpCreate from "../pages/spdp/SpdpCreate";
import SpdpDetail from "../pages/spdp/SpdpDetail";
import SpdpEdit from "../pages/spdp/SpdpEdit";

import JaksaPage from "../pages/jaksa/JaksaPage";
import JaksaDetail from "../pages/jaksa/JaksaDetail";
import JaksaForm from "../pages/jaksa/JaksaForm";

import P16Page from "../pages/p16/P16Page";
import P16DetailPage from "../pages/p16/P16DetailPage";
import P16EditPage from "../pages/p16/P16EditPage";

import UserPage from "../pages/user/UserPage";
import UserForm from "../pages/user/UserForm";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardRoutes />} />

          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />

          {/* SPDP */}
          <Route path="/spdp" element={<SpdpPage />} />
          <Route path="/spdp/:id" element={<SpdpDetail />} />
          <Route path="/spdp/create" element={<SpdpCreate />} />
          <Route path="/spdp/edit/:id" element={<SpdpEdit />} />

          {/* JAKSA */}
          <Route path="/jaksa" element={<JaksaPage />} />
          <Route path="/jaksa/:id" element={<JaksaDetail />} />
          <Route path="/jaksa/create" element={<JaksaForm />} />
          <Route path="/jaksa/edit/:id" element={<JaksaForm />} />

          {/* P16 */}
          <Route path="/p16" element={<P16Page />} />
          <Route path="/p16/:id" element={<P16DetailPage />} />
          <Route path="/p16/edit/:id" element={<P16EditPage />} />

          {/* USERS */}
          <Route path="/users" element={<UserPage />} />
          <Route path="/users/create" element={<UserForm />} />
          <Route path="/users/edit/:id" element={<UserForm />} />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}
