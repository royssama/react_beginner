import { useState, useCallback } from "react";
import { fetchGridData } from "../api/B001Api";

export const useGrid = () => {
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(null);

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
