import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUser } from "../utils/auth";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  // 🔥 ambil user dari token
  useEffect(() => {
    const data = getUser();
    setUser(data);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 🔥 HEADER */}
      <div className="bg-green-800 text-white px-6 py-4 flex justify-between items-center shadow">
        {/* LEFT */}
        <div className="flex items-center gap-8">
          <h1
            onClick={() => navigate("/dashboard")}
            className="font-bold text-lg cursor-pointer"
          >
            SIPERKASA
          </h1>

          {/* MENU */}
          <div className="flex gap-6 text-sm font-medium">
            <button
              onClick={() => navigate("/dashboard")}
              className={`hover:text-yellow-300 ${
                isActive("/dashboard") && "text-yellow-300 underline"
              }`}
            >
              Dashboard
            </button>

            <button
              onClick={() => navigate("/spdp")}
              className={`hover:text-yellow-300 ${
                isActive("/spdp") && "text-yellow-300 underline"
              }`}
            >
              SPDP
            </button>

            <button
              onClick={() => navigate("/jaksa")}
              className={`hover:text-yellow-300 ${
                isActive("/jaksa") && "text-yellow-300 underline"
              }`}
            >
              Jaksa
            </button>

            <button
              onClick={() => navigate("/p16")}
              className={`hover:text-yellow-300 ${
                isActive("/p16") && "text-yellow-300 underline"
              }`}
            >
              P16
            </button>

            {/* 🔥 USER (ADMIN ONLY) */}
            {user?.role === "admin" && (
              <button
                onClick={() => navigate("/users")}
                className={`hover:text-yellow-300 ${
                  isActive("/users") && "text-yellow-300 underline"
                }`}
              >
                User
              </button>
            )}
          </div>
        </div>

        {/* RIGHT (USER) */}
        <div className="relative">
          <div
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 cursor-pointer"
          >
            {/* AVATAR */}
            <div className="w-8 h-8 bg-white text-green-800 rounded-full flex items-center justify-center font-bold">
              {user?.email?.charAt(0)?.toUpperCase() || "U"}
            </div>

            {/* 🔥 TEXT PREMIUM */}
            <div className="text-left leading-tight">
              <p className="text-sm">
                Halo{" "}
                <span className="font-semibold capitalize">{user?.role}</span>
              </p>
              <p className="text-xs text-gray-200 font-medium">
                {user?.name || "-"}
              </p>
            </div>
          </div>

          {/* DROPDOWN */}
          {open && (
            <div className="absolute right-0 mt-3 w-64 bg-white text-black rounded-2xl shadow-lg p-5">
              {/* 🔥 ROLE */}
              <p className="text-xs text-gray-500">Role</p>
              <p className="font-semibold capitalize mb-2">{user?.role}</p>

              {/* 🔥 NAMA */}
              <p className="text-xs text-gray-500">Nama</p>
              <p className="font-medium mb-2">{user?.name || "-"}</p>

              {/* 🔥 EMAIL */}
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm text-gray-600 mb-4">{user?.email}</p>

              {/* 🔥 LOGOUT */}
              <button
                onClick={handleLogout}
                className="w-full bg-green-800 text-white py-2 rounded-lg hover:bg-green-900 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 🔥 CONTENT */}
      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
}
