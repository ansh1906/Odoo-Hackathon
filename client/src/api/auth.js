import axiosInstance from "./axiosInstance";

export const login = (email, password) =>
  axiosInstance.post("/account/login/", { email, password });

export const register = (name, email, password) =>
  axiosInstance.post("/account/register/", { username, email, password });

export const getCurrentUser = () => axiosInstance.get("/me/");