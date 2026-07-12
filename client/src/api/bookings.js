import axiosInstance from "./axiosInstance";

export const getBookings = (params) => axiosInstance.get("/bookings/", { params });
export const createBooking = (payload) => axiosInstance.post("/bookings/", payload);
export const cancelBooking = (id) => axiosInstance.patch(`/bookings/${id}/cancel/`);