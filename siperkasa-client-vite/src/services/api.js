import axios from "axios";

const api = axios.create({
  baseURL: "https://siperkasa.onrender.com",
});

// 🔥 REQUEST INTERCEPTOR
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🔥 RESPONSE INTERCEPTOR (AUTO HANDLE ERROR)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const message = error.response.data?.message || "Terjadi kesalahan";

      // 🔥 kalau unauthorized → logout otomatis
      if (error.response.status === 401) {
        localStorage.removeItem("access_token");
        window.location.href = "/login";
      }

      return Promise.reject(message);
    }

    return Promise.reject("Server tidak terhubung");
  },
);

export default api;
