import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUser } from "../../utils/auth";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
  };

  const isActive = (path) => location.pathname.startsWith(path);

  // 🔥 MENU DINAMIS
  const menus = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "SPDP", path: "/spdp" },
    { name: "P16", path: "/p16" },
    { name: "Jaksa", path: "/jaksa" },
  ];

  if (user?.role === "admin") {
    menus.push({ name: "User", path: "/users" });
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* NAVBAR */}
      <div className="bg-gradient-to-r from-green-900 to-green-700 text-white px-8 py-4 flex justify-between items-center shadow-lg">
        {/* LEFT */}
        <div className="flex items-center gap-10">
          <h1
            onClick={() => navigate("/dashboard")}
            className="font-bold text-xl cursor-pointer hover:text-yellow-300"
          >
            SIPERKASA
          </h1>

          <div className="flex gap-3 text-sm font-medium">
            {menus.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`px-4 py-2 rounded-lg transition ${
                  isActive(item.path)
                    ? "bg-yellow-400 text-green-900 font-semibold"
                    : "hover:bg-white/10"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 bg-white/10 px-3 py-2 rounded-lg hover:bg-white/20"
          >
            <div className="w-9 h-9 flex items-center justify-center rounded-full bg-yellow-400 text-green-900 font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            <div className="text-left text-sm leading-tight">
              <div className="font-semibold">Halo, {user?.name}</div>
              <div className="text-xs">{user?.role}</div>
            </div>
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-52 bg-white text-black rounded-xl shadow-lg overflow-hidden z-50">
              <div className="px-4 py-3 border-b">
                <div className="font-semibold">{user?.name}</div>
                <div className="text-gray-500 text-xs">{user?.role}</div>
                <div className="text-gray-500 text-xs">{user?.email}</div>
              </div>

              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/profile");
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Profil
              </button>

              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/change-password");
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Ganti Password
              </button>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
}
