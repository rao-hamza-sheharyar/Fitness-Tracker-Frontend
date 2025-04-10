// src/axiosConfig.js
import axios from "axios";

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // 🔐 get token from browser
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // 🔥 attach token
  }
  return config;
})