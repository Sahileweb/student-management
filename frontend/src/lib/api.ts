import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem("adminToken");
  const studentToken = localStorage.getItem("studentToken");

  const role = localStorage.getItem("role");

  if (role === "admin" && adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  }

  if (role === "student" && studentToken) {
    config.headers.Authorization = `Bearer ${studentToken}`;
  }

  return config;
});


export default api;
