import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3300",
});

// 🔥 AUTO BAWA TOKEN
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.access_token = token;
  }

  return config;
});

export default api;
