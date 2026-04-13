import { useState, useEffect } from "react";
import { getUser } from "../utils/auth";

export default function useAuth() {
  const [user, setUser] = useState(undefined); // 🔥 BUKAN null

  useEffect(() => {
    try {
      const data = getUser();
      setUser(data || null);
    } catch (err) {
      setUser(null);
    }
  }, []);

  const loading = user === undefined; // 🔥 derive loading

  return {
    user,
    loading,
    role: user?.role || null,
    isAuth: !!user,
    isAdmin: user?.role === "admin",
    isKajari: user?.role === "kajari",
    isOperator: user?.role === "operator",
    isJaksa: user?.role === "jaksa",
  };
}
