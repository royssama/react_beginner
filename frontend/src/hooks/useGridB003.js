/**
 * useGridB003 - B003 그리드 조회 + 변경분(changeDataset) 방식 저장
 *
 * B002와 다름:
 * - 셀 수정 시 setRowData를 호출하지 않음
 * - 변경된 세부행만 changeDataset에 쌓음
 * - 저장 시 changeDataset을 백엔드로 전송한 뒤 rowData에 반영
 */
import { useState, useCallback, useRef, useMemo } from "react";
import { fetchB003GridData, saveB003DetailChanges } from "../api/B003Api";

/** rowData 깊은 복사 */
const cloneRows = (rows) => JSON.parse(JSON.stringify(rows));

/** changeDataset 키: rowId + detail 인덱스 */
const changeKey = (rowId, detailIndex) => `${rowId}:${detailIndex}`;

/** changeDataset의 after 값을 rowData에 반영 */
const applyChangeDatasetToRows = (rows, dataset) => {
  const entries = Object.values(dataset);
  if (entries.length === 0) return rows;

  const byRow = new Map();
  entries.forEach((item) => {
    if (!byRow.has(item.rowId)) byRow.set(item.rowId, []);
    byRow.get(item.rowId).push(item);
  });

  return rows.map((row) => {
    const patches = byRow.get(row.id);
    if (!patches?.length) return row;

    const details = row.details.map((detail, index) => {
      const patch = patches.find((p) => p.detailIndex === index);
      if (!patch) return detail;
      return {
        ...detail,
        detailAuth: patch.after.detailAuth,
        detailUseYn: patch.after.detailUseYn,
      };
    });
    return { ...row, details };
  });
};

export const useGridB003 = () => {
  const [rowData, setRowData] = useState([]);
  /** 수정 중인 변경분만 보관 (저장 시 백엔드 전송용) */
  const [changeDataset, setChangeDataset] = useState({});
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const rowDataRef = useRef([]);

  /** 그리드 조회 — rowData만 세팅, changeDataset 초기화 */
  const search = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchB003GridData(params);
      const rows = response?.data ?? [];

      setRowData(rows);
      rowDataRef.current = rows;
      setChangeDataset({});
      setIsEditing(true);
      setSearched(true);
      return response;
    } catch (err) {
      setError(err?.message ?? "조회 중 오류가 발생했습니다.");
      setRowData([]);
      rowDataRef.current = [];
      setChangeDataset({});
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /** 그리드 데이터·조회 상태 초기화 */
  const clearGrid = useCallback(() => {
    setRowData([]);
    rowDataRef.current = [];
    setChangeDataset({});
    setSearched(false);
    setError(null);
    setIsEditing(false);
  }, []);

  /** 수정 모드 진입 */
  const startEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  /** 수정 취소 — changeDataset만 비우고 rowData는 유지 */
  const cancelEdit = useCallback(() => {
    setChangeDataset({});
    setIsEditing(false);
  }, []);

  /**
   * 펼침 테이블 셀 값 변경
   * rowData는 건드리지 않고 changeDataset에만 upsert
   * 원본과 같아지면 해당 항목은 changeDataset에서 제거
   */
  const updateDetail = useCallback((rowId, detailIndex, field, value) => {
    const row = rowDataRef.current.find((item) => item.id === rowId);
    const originalDetail = row?.details?.[detailIndex];
    if (!row || !originalDetail) return;

    const key = changeKey(rowId, detailIndex);

    setChangeDataset((prev) => {
      const existing = prev[key];
      const before = existing?.before ?? {
        detailAuth: originalDetail.detailAuth,
        detailUseYn: originalDetail.detailUseYn,
      };
      const after = {
        detailAuth: existing?.after?.detailAuth ?? originalDetail.detailAuth,
        detailUseYn: existing?.after?.detailUseYn ?? originalDetail.detailUseYn,
        [field]: value,
      };

      const unchanged =
        after.detailAuth === before.detailAuth &&
        after.detailUseYn === before.detailUseYn;

      if (unchanged) {
        if (!existing) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      }

      return {
        ...prev,
        [key]: {
          rowId: row.id,
          empNo: row.empNo,
          name: row.name,
          authName: row.authName,
          detailIndex,
          detailId: originalDetail.detailId,
          before,
          after,
        },
      };
    });
  }, []);

  /** changeDataset을 백엔드로 전송 후, 성공 시 rowData에 반영 */
  const save = useCallback(async () => {
    const changes = Object.values(changeDataset);

    if (changes.length === 0) {
      window.alert("변경된 내용이 없습니다.");
      return null;
    }

    setSaving(true);
    setError(null);
    try {
      const result = await saveB003DetailChanges(changes);
      const merged = applyChangeDatasetToRows(rowDataRef.current, changeDataset);
      setRowData(merged);
      rowDataRef.current = merged;
      setChangeDataset({});
      setIsEditing(false);
      window.alert(
        `저장 요청 완료: ${changes.length}건 (브라우저 콘솔에서 API payload 확인)`
      );
      return result;
    } catch (err) {
      setError(err?.message ?? "저장 중 오류가 발생했습니다.");
      throw err;
    } finally {
      setSaving(false);
    }
  }, [changeDataset]);

  const hasChanges = useMemo(
    () => Object.keys(changeDataset).length > 0,
    [changeDataset]
  );

  return {
    rowData,
    changeDataset,
    loading,
    searched,
    error,
    isEditing,
    saving,
    hasChanges,
    search,
    clearGrid,
    startEdit,
    cancelEdit,
    updateDetail,
    save,
  };
};
