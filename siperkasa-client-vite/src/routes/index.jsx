import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";

import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";

import spdpRoutes from "./spdpRoutes";
import jaksaRoutes from "./jaksaRoutes";
import p16Routes from "./p16Routes";

import userRoutes from "./userRoutes";

export default function AppRoutes() {
  return (
    <Routes>
      {/* LOGIN */}
      <Route path="/" element={<Login />} />

      {/* PROTECTED */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          {/* MODULE */}
          {spdpRoutes}
          {jaksaRoutes}
          {p16Routes}
          {userRoutes}
        </Route>
      </Route>
    </Routes>
  );
}
