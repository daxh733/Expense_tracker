import axios from "axios";

const API = axios.create({
  baseURL: "https://expensetracker-production-93c6.up.railway.app",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("access");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
