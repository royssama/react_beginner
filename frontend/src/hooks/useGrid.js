/**
 * useGrid - AG Grid 목록 데이터 조회/초기화 커스텀 훅
 * B001Page에서 사용하며, GridPanel에 rowData·loading·searched를 전달합니다.
 */
import { useState, useCallback } from "react";
import { fetchGridData } from "../api/B001Api";

export const useGrid = () => {
  const [rowData, setRowData] = useState([]); // 그리드에 표시할 행 데이터 배열
  const [loading, setLoading] = useState(false); // 그리드 API 조회 중 여부
  const [searched, setSearched] = useState(false); // 조회 버튼을 한 번이라도 눌렀는지 (false면 안내 문구 표시)
  const [error, setError] = useState(null); // 조회 실패 시 에러 메시지

  /**
   * 그리드 데이터 조회 (조회 버튼 클릭 시 B001Page.handleSearch에서 호출)
   * @param {Object} params - getSearchParams()가 반환한 조회 조건 (week, departmentCode 등)
   */
  const search = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchGridData(params); // api/grid/search 호출
      setRowData(response?.data ?? []);
      setSearched(true); // 조회 완료 → GridPanel에서 그리드 표시
      return response;
    } catch (err) {
      setError(err?.message ?? "조회 중 오류가 발생했습니다.");
      setRowData([]);
      throw err;
    } finally {
      setLoading(false); // 성공/실패 관계없이 로딩 종료
    }
  }, []);

  /**
   * 그리드 초기화 (리셋 버튼 클릭 시 B001Page.handleReset에서 호출)
   * 데이터를 비우고 화면을 최초 로드 상태로 되돌림
   */
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
