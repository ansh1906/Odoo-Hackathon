import axiosInstance from "./axiosInstance";

export const login = (email, password) =>
  axiosInstance.post("/account/login/", { email, password });

export const register = (username, email, password) =>
  axiosInstance.post("/account/register/", { username, email, password });

export const getCurrentUser = () => axiosInstance.get("/account/me");

export const logout = async () => {
  const refreshToken = localStorage.getItem("refresh_token");
  await axiosInstance.post("/account/logout/", {
    refresh: refreshToken,
  });
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};
