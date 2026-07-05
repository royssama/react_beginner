import axiosUtil from "../utils/axiosUtil";
import { mapGridSearchRows } from "../utils/gridRowUtil";

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

/**
 * 그리드 목록 조회 (api/grid/search)
 * 응답 data 각 행 필드:
 *   company(회사), industry(업종), partner(협력업체), manager(담당자), location(위치)
 *   aa2022, aa2023, aa2024, bb2022, bb2023, bb2024
 */
export const fetchGridData = async (params) => {
  let searchData = params;
  const response = await axiosUtil.get("api/grid/search", searchData, {});
  const rows = mapGridSearchRows(response?.data ?? []);

  return {
    ...response,
    data: rows,
    totalCount: rows.length,
  };
};
