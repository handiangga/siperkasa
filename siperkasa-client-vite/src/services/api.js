import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3300",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token"); // 🔥 FIX

  if (token) {
    config.headers.Authorization = "Bearer " + token; // 🔥 FIX
  }

  return config;
});

export default api;
