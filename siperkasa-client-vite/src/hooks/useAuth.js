import { useState, useEffect } from "react";
import { getUser } from "../utils/auth";

export default function useAuth() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    try {
      const data = getUser();
      setUser(data || null);
    } catch (err) {
      setUser(null);
    }
  }, []);

  const loading = user === undefined;

  // 🔥 NORMALISASI ROLE (INI KUNCI)
  const role = user?.role?.toLowerCase().trim();

  return {
    user,
    loading,
    role,
    isAuth: !!user,
    isAdmin: role === "admin",
    isKajari: role === "kajari",
    isOperator: role === "operator",
    isJaksa: role === "jaksa",
  };
}
