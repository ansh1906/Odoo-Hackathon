import axiosInstance from "./axiosInstance";

export const allocateAsset = (assetId, payload) =>
  axiosInstance.post(`/assets/${assetId}/allocate/`, payload);

export const returnAsset = (assetId, payload) =>
  axiosInstance.post(`/assets/${assetId}/return/`, payload);

export const requestTransfer = (payload) => axiosInstance.post("/transfers/", payload);
export const approveTransfer = (id) => axiosInstance.patch(`/transfers/${id}/approve/`);