import axios from "axios";

const api = axios.create({
  baseURL: "https://siperkasa.onrender.com",
});

// 🔥 REQUEST
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token && token !== "undefined") {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🔥 RESPONSE
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // ❌ NETWORK ERROR
    if (!error.response) {
      return Promise.reject("Server tidak terhubung");
    }

    const status = error.response.status;
    const message = error.response.data?.message || "Terjadi kesalahan";

    // 🔐 AUTO LOGOUT (lebih aman)
    if (status === 401 || status === 403) {
      localStorage.removeItem("access_token");

      // 🔥 JANGAN ke /login (karena route kamu "/")
      window.location.href = "/";
    }

    return Promise.reject(message);
  },
);

export default api;
