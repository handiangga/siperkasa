import { useState, useEffect } from "react";
import { getUser } from "../utils/auth";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const data = getUser();
      setUser(data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

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
