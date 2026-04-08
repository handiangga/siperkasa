import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUser } from "../utils/auth";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

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
      {/* 🔥 NAVBAR */}
      <div className="bg-gradient-to-r from-green-900 to-green-700 text-white px-8 py-4 flex justify-between items-center shadow-lg">
        {/* LEFT */}
        <div className="flex items-center gap-10">
          <h1
            onClick={() => navigate("/dashboard")}
            className="font-bold text-xl tracking-wide cursor-pointer hover:text-yellow-300 transition"
          >
            SIPERKASA
          </h1>

          {/* MENU */}
          <div className="flex gap-3 text-sm font-medium">
            {[
              { name: "Dashboard", path: "/dashboard" },
              { name: "SPDP", path: "/spdp" },
              { name: "P16", path: "/p16" },
              { name: "Jaksa", path: "/jaksa" },
            ].map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`px-4 py-2 rounded-lg transition-all duration-200
                  ${
                    isActive(item.path)
                      ? "bg-yellow-400 text-green-900 font-semibold shadow"
                      : "hover:bg-white/10"
                  }`}
              >
                {item.name}
              </button>
            ))}

            {/* ADMIN ONLY */}
            {user?.role === "admin" && (
              <button
                onClick={() => navigate("/users")}
                className={`px-4 py-2 rounded-lg transition-all
                  ${
                    isActive("/users")
                      ? "bg-yellow-400 text-green-900 font-semibold shadow"
                      : "hover:bg-white/10"
                  }`}
              >
                User
              </button>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative">
          <div
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 cursor-pointer hover:bg-white/10 px-3 py-2 rounded-lg transition"
          >
            {/* AVATAR */}
            <div className="w-9 h-9 bg-yellow-400 text-green-900 rounded-full flex items-center justify-center font-bold shadow">
              {user?.email?.charAt(0)?.toUpperCase() || "U"}
            </div>

            {/* TEXT */}
            <div className="text-left">
              <p className="text-sm font-semibold capitalize">
                Halo, {user?.name}
              </p>
              <p className="text-xs text-gray-200">{user?.role || "-"}</p>
            </div>
          </div>

          {/* DROPDOWN */}
          {open && (
            <div className="absolute right-0 mt-3 w-64 bg-white text-black rounded-xl shadow-2xl p-5 border border-gray-100 animate-fadeIn">
              <div className="mb-4">
                <p className="text-xs text-gray-400">Role</p>
                <p className="font-semibold capitalize">{user?.role}</p>
              </div>

              <div className="mb-4">
                <p className="text-xs text-gray-400">Nama</p>
                <p className="font-medium">{user?.name || "-"}</p>
              </div>

              <div className="mb-4">
                <p className="text-xs text-gray-400">Email</p>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>

              <button
                onClick={handleLogout}
                className="w-full bg-gradient-to-r from-green-800 to-green-700 text-white py-2 rounded-lg hover:opacity-90 transition font-medium"
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
