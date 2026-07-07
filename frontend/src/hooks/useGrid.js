/**
 * useGrid - AG Grid 목록 데이터 조회/초기화 커스텀 훅
 * 백엔드 없이 MOCK_AUTH_EXCEL_ROWS 목 데이터만 사용합니다.
 */
import { useState, useCallback } from "react";
import { MOCK_AUTH_EXCEL_ROWS, buildAuthGridRows } from "../data/mockAuthData";

export { MOCK_AUTH_EXCEL_ROWS } from "../data/mockAuthData";

export const useGrid = () => {
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(null);

  /**
   * 조회 버튼 클릭 시 목 데이터를 그리드 형태로 변환해 표시
   * @param {Object} params - 부서(departmentCode) 등 조회 조건 (선택)
   */
  const search = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      let rows = buildAuthGridRows(MOCK_AUTH_EXCEL_ROWS);

      // 부서 필터 (departmentCode = 부서명)
      if (params?.departmentCode) {
        rows = rows.filter((row) => row.dept === params.departmentCode);
      }

      setRowData(rows);
      setSearched(true);
      return { data: rows, totalCount: rows.length };
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
