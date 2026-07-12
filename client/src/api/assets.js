import axiosInstance from "./axiosInstance";

// AssetListAPIView is mounted at /asset/manage on the Django server.
export const getAssets = (params) =>
  axiosInstance.get("/asset/manage/", { params });

export const createAsset = (payload) =>
  axiosInstance.post("/asset/manage/create/", payload);
