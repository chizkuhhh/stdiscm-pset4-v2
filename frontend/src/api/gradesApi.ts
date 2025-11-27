import axios from "axios";

export const gradesApi = axios.create({
  baseURL: "http://localhost:4003",
});

gradesApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
