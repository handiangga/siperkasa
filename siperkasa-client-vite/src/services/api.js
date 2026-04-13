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
    if (!error.response) {
      return Promise.reject("Server tidak terhubung");
    }

    const status = error.response.status;
    const message = error.response.data?.message || "Terjadi kesalahan";

    // 🔐 HANYA logout kalau 401 (token invalid)
    if (status === 401) {
      localStorage.removeItem("access_token");
      window.location.href = "/";
    }

    // ❗ 403 jangan logout (biar UI handle)
    if (status === 403) {
      console.warn("Forbidden:", message);
    }

    return Promise.reject(message);
  },
);

export default api;
