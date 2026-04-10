export function getUser() {
  const token = localStorage.getItem("access_token"); // 🔥 FIX

  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch (err) {
    return null;
  }
}
