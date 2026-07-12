import axiosInstance from "./axiosInstance";

// Departments
export const getDepartments = () =>
  axiosInstance.get("orgstructure/departments/");

export const createDepartment = (data) =>
  axiosInstance.post("orgstructure/departments/", data);

export const updateDepartment = (id, data) =>
  axiosInstance.patch(`orgstructure/departments/${id}/`, data);

export const deleteDepartment = (id) =>
  axiosInstance.delete(`orgstructure/departments/${id}/`);

// Asset Categories
export const getAssetCategories = () =>
  axiosInstance.get("orgstructure/asset-categories/");

// Employees
export const getEmployees = () =>
  axiosInstance.get("orgstructure/employees/");