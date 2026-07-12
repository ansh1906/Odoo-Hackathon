import axiosInstance from "./axiosInstance";

export const getAuditCycles = (params) => axiosInstance.get("/audits/", { params });
export const createAuditCycle = (payload) => axiosInstance.post("/audits/", payload);
export const updateAuditItem = (cycleId, itemId, payload) =>
  axiosInstance.patch(`/audits/${cycleId}/items/${itemId}/`, payload);
export const closeAuditCycle = (cycleId) => axiosInstance.patch(`/audits/${cycleId}/close/`);