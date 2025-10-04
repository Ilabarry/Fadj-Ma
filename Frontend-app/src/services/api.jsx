import axios from "axios";

const api = axios.create({
  baseURL: "https://fadj-ma-production.up.railway.app", // ton backend Railway
  withCredentials: true, // essentiel pour Sanctum / cookies
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Interceptor pour ajouter automatiquement le token si présent
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
