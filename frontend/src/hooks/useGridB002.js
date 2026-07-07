/**
 * useGridB002 - B002 그리드 조회 + 세부권한 테이블 수정/저장
 */
import { useState, useCallback, useRef } from "react";
import { MOCK_AUTH_EXCEL_ROWS, buildAuthGridRows } from "../data/mockAuthData";
import { saveB002DetailChanges } from "../api/B002Api";

const cloneRows = (rows) => JSON.parse(JSON.stringify(rows));

const collectChangedDetails = (currentRows, originalRows) => {
  const changes = [];
  const originalMap = new Map(originalRows.map((row) => [row.id, row]));

  currentRows.forEach((row) => {
    const original = originalMap.get(row.id);
    if (!original) return;

    row.details.forEach((detail, index) => {
      const originalDetail = original.details[index];
      if (!originalDetail) return;

      const detailAuthChanged = detail.detailAuth !== originalDetail.detailAuth;
      const useYnChanged = detail.detailUseYn !== originalDetail.detailUseYn;

      if (detailAuthChanged || useYnChanged) {
        changes.push({
          rowId: row.id,
          empNo: row.empNo,
          name: row.name,
          authName: row.authName,
          detailId: detail.detailId,
          before: {
            detailAuth: originalDetail.detailAuth,
            detailUseYn: originalDetail.detailUseYn,
          },
          after: {
            detailAuth: detail.detailAuth,
            detailUseYn: detail.detailUseYn,
          },
        });
      }
    });
  });

  return changes;
};

export const useGridB002 = () => {
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const originalRowDataRef = useRef([]);

  const search = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      let rows = buildAuthGridRows(MOCK_AUTH_EXCEL_ROWS);

      if (params?.departmentCode) {
        rows = rows.filter((row) => row.dept === params.departmentCode);
      }

      setRowData(rows);
      originalRowDataRef.current = cloneRows(rows);
      setIsEditing(false);
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
    setIsEditing(false);
    originalRowDataRef.current = [];
  }, []);

  const startEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const cancelEdit = useCallback(() => {
    setRowData(cloneRows(originalRowDataRef.current));
    setIsEditing(false);
  }, []);

  const updateDetail = useCallback((rowId, detailIndex, field, value) => {
    setRowData((prev) =>
      prev.map((row) => {
        if (row.id !== rowId) return row;
        const details = row.details.map((detail, index) =>
          index === detailIndex ? { ...detail, [field]: value } : detail
        );
        return { ...row, details };
      })
    );
  }, []);

  const save = useCallback(async () => {
    const changes = collectChangedDetails(rowData, originalRowDataRef.current);

    if (changes.length === 0) {
      window.alert("변경된 내용이 없습니다.");
      return null;
    }

    setSaving(true);
    setError(null);
    try {
      const result = await saveB002DetailChanges(changes);
      originalRowDataRef.current = cloneRows(rowData);
      setIsEditing(false);
      window.alert(`저장 요청 완료: ${changes.length}건 (브라우저 콘솔에서 API payload 확인)`);
      return result;
    } catch (err) {
      setError(err?.message ?? "저장 중 오류가 발생했습니다.");
      throw err;
    } finally {
      setSaving(false);
    }
  }, [rowData]);

  return {
    rowData,
    loading,
    searched,
    error,
    isEditing,
    saving,
    search,
    clearGrid,
    startEdit,
    cancelEdit,
    updateDetail,
    save,
  };
};
