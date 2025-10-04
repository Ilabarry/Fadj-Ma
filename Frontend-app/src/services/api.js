import axios from "axios";

const api = axios.create({
  // baseURL: "http://127.0.0.1:8000/api", 
  // headers: {
  //   "Content-Type": "application/json",
  //   Accept: "application/json",
  // },

  baseURL: "https://amused-magic.up.railway.app/api", // ton backend Railway
  withCredentials: true, // 🔑 essentiel pour que le cookie Laravel soit envoyé
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Ajouter automatiquement le token si présent
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;