import { getUser } from "../utils/auth";

export default function useAuth() {
  let user = null;

  try {
    user = getUser();
  } catch (err) {
    user = null;
  }

  return {
    user,
    role: user?.role || null,
    isAuth: !!user,
    isAdmin: user?.role === "admin",
    isKajari: user?.role === "kajari",
    isOperator: user?.role === "operator",
    isJaksa: user?.role === "jaksa",
  };
}
