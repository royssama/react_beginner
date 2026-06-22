import axiosUtil from "../utils/axiosUtil";

export const fetchGridDepartments = async (params) => {
  let searchData = params;
  const response = await axiosUtil.get("api/grid/options/departments", searchData, {});
  return response;
};

export const fetchGridSections = async (params) => {
  let searchData = params;
  const response = await axiosUtil.get("api/grid/options/sections", searchData, {});
  return response;
};

export const fetchGridCategories = async () => {
  const response = await axiosUtil.get("api/grid/options/categories", {}, {});
  return response;
};

export const fetchGridStatuses = async () => {
  const response = await axiosUtil.get("api/grid/options/statuses", {}, {});
  return response;
};

export const fetchGridTypes = async () => {
  const response = await axiosUtil.get("api/grid/options/types", {}, {});
  return response;
};

export const fetchGridData = async (params) => {
  let searchData = params;
  const response = await axiosUtil.get("api/grid/search", searchData, {});
  return response;
};
