import { getUser } from "../utils/auth";

export default function useAuth() {
  const user = getUser();

  return {
    user,
    role: user?.role,
    isAdmin: user?.role === "admin",
    isKajari: user?.role === "kajari",
    isOperator: user?.role === "operator",
    isJaksa: user?.role === "jaksa",
  };
}
