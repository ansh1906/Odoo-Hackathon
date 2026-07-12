import axiosInstance from "./axiosInstance";

export const getMaintenanceRequests = (params) => axiosInstance.get("/maintenance/", { params });
export const raiseMaintenanceRequest = (payload) => axiosInstance.post("/maintenance/", payload);
export const approveMaintenance = (id) => axiosInstance.patch(`/maintenance/${id}/approve/`);
export const rejectMaintenance = (id) => axiosInstance.patch(`/maintenance/${id}/reject/`);
export const resolveMaintenance = (id, payload) =>
  axiosInstance.patch(`/maintenance/${id}/resolve/`, payload);