/**
 * useGrid - AG Grid 목록 데이터 조회/초기화 커스텀 훅
 * B001Page에서 사용하며, GridPanel에 rowData·loading·searched를 전달합니다.
 */
import { useState, useCallback } from "react";
import { fetchGridData } from "../api/B001Api";

export const useGrid = () => {
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(null);

  /**
   * 그리드 데이터 조회 (조회 버튼 클릭 시 B001Page.handleSearch에서 호출)
   * @param {Object} params - getSearchParams()가 반환한 조회 조건 (week, departmentCode 등)
   */
  const search = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchGridData(params);
      setRowData(response?.data ?? []);
      setSearched(true);
      return response;
    } catch (err) {
      setError(err?.message ?? "조회 중 오류가 발생했습니다.");
      setRowData([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearGrid = useCallback(() => {
    setRowData([]);
    setSearched(false);
    setError(null);
  }, []);

  return {
    rowData,
    loading,
    searched,
    error,
    search,
    clearGrid,
  };
};
