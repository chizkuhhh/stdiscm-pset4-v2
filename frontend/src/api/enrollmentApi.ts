import axios from "axios";

export const enrollmentApi = axios.create({
  baseURL: "http://localhost:4004/enroll",
});

enrollmentApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});