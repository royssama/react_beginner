import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import styled from "styled-components";
import arrowImg from "./arrow.png";
import { B003_GRID_OPTIONS } from "../config/b003GridOptions";
import { getCookieBoolean, setCookie } from "../utils/cookieUtil";

/** 점수 필드 추출 (cellStyle 조건용) */
const getScore = (data) => data?.score ?? data?.aa2024 ?? 0;

const GridWrapper = styled.div`
  width: 100%;
  height: 100%;
.ag-theme-alpine .ag-cell-focus {
  border: none !important;
  outline: none !important;
}
/* 그리드 wrapper 포커스 outline 제거 */
.ag-theme-alpine .ag-root-wrapper:focus {
  outline: none;
}
  .my-header {
    border: 1px solid yellow;
  }

.ag-ltr .ag-cell-focus:not(.ag-cell-range-selected):focus-within, .ag-ltr .ag-context-menu-open .ag-cell-focus:not(.ag-cell-range-selected), .ag-ltr .ag-full-width-row.ag-row-focus:focus .ag-cell-wrapper.ag-row-group, .ag-ltr .ag-cell-range-single-cell, .ag-ltr .ag-cell-range-single-cell.ag-cell-range-handle, .ag-rtl .ag-cell-focus:not(.ag-cell-range-selected):focus-within, .ag-rtl .ag-context-menu-open .ag-cell-focus:not(.ag-cell-range-selected), .ag-rtl .ag-full-width-row.ag-row-focus:focus .ag-cell-wrapper.ag-row-group, .ag-rtl .ag-cell-range-single-cell, .ag-rtl .ag-cell-range-single-cell.ag-cell-range-handle
{border: none !important;
  outline: none !important;}


  .my-header .ag-header-cell-label {
    justify-content: center;
    color: blue;
    font-weight: bold;
  }

  .bg-red {
    border: 2px solid red !important;
    background: #ffdddd;
  }

  .bg-green {
    border: 2px solid green !important;
    background: #ddffdd;
  }

  .table-cell-renderer,
  .table-cell-renderer td,
  .table-cell-renderer th {
    border: 1px solid blue;
  }

  .ag-row.row-expanded {
    overflow: visible !important;
    z-index: 2;
  }

  .ag-row.row-expanded .ag-cell {
    overflow: visible !important;
  }

  .ag-cell.cell-expanded-overflow {
    overflow: visible !important;
    position: relative;
    z-index: 3;
  }

  /* 펼침 테이블이 옆 컬럼 위로 넘칠 때 클릭이 가로채지지 않도록 */
  .ag-row.row-expanded .ag-cell.cell-blocked-by-expand {
    pointer-events: none;
  }

  .ag-cell.cell-arrow-top {
    align-items: flex-start !important;
  }

  .detail-select {
    width: 100%;
    min-width: 140px;
    padding: 2px 4px;
  }
`;

const ROW_HEIGHT_COLLAPSED = 42;
const ROW_HEIGHT_EXPANDED_FALLBACK = 80;
const ROW_HEIGHT_PADDING = 12;

/** 행 펼침/접기 화살표 셀 렌더러 */
const ArrowCellRenderer = ({ data, isExpanded, onToggle }) => {
  const rowId = data?.id;

  /** 화살표 클릭 시 해당 row 펼침 토글 */
  const handleClick = (e) => {
    e.stopPropagation();
    onToggle?.(rowId);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick(e);
      }}
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        height: "100%",
        paddingTop: 10,
        cursor: "pointer",
      }}
    >
      <img
        src={arrowImg}
        alt={isExpanded ? "접기" : "펼치기"}
        style={{
          width: 16,
          height: 16,
          display: "block",
          transform: isExpanded ? "rotate(180deg)" : "none",
          transition: "transform 0.2s",
        }}
      />
    </div>
  );
};

/** 헤더 전체 펼침/접기 화살표 */
const ArrowHeaderComponent = ({ isAllExpanded, onToggleAll }) => {
  /** 헤더 화살표 클릭 시 전체 row 펼침/접기 */
  const handleClick = (e) => {
    e.stopPropagation();
    onToggleAll?.();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick(e);
      }}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        cursor: "pointer",
      }}
      title={isAllExpanded ? "전체 접기" : "전체 펼치기"}
    >
      <img
        src={arrowImg}
        alt={isAllExpanded ? "전체 접기" : "전체 펼치기"}
        style={{
          width: 16,
          height: 16,
          display: "block",
          transform: isAllExpanded ? "rotate(180deg)" : "none",
          transition: "transform 0.2s",
        }}
      />
    </div>
  );
};

/** B003 — 펼침 테이블 (표시값 = rowData + changeDataset 병합, 입력은 로컬 state) */
const DetailAuthInput = ({ value, onCommit, stopGridEvent }) => {
  const [text, setText] = useState(value ?? "");
  useEffect(() => {
    setText(value ?? "");
  }, [value]);
  return (
    <input
      type="text"
      className="detail-select"
      value={text}
      onMouseDown={stopGridEvent}
      onClick={stopGridEvent}
      onChange={(e) => {
        const next = e.target.value;
        setText(next);
        onCommit?.(next);
      }}
    />
  );
};

/** 체크박스도 로컬 state 사용 (AG Grid 셀이 changeDataset만으로는 다시 안 그려짐) */
const DetailUseYnCheckbox = ({ checked, onCommit, stopGridEvent }) => {
  const [on, setOn] = useState(!!checked);
  useEffect(() => {
    setOn(!!checked);
  }, [checked]);
  return (
    <input
      type="checkbox"
      checked={on}
      onMouseDown={stopGridEvent}
      onClick={stopGridEvent}
      onChange={(e) => {
        const next = e.target.checked;
        setOn(next);
        onCommit?.(next ? "Y" : "N");
      }}
    />
  );
};

const EditableTableCellRenderer = ({
  data,
  isExpanded,
  isEditing,
  onHeightChange,
  onDetailChange,
  getChangeDataset,
  changeDataset: changeDatasetProp,
}) => {
  const containerRef = useRef(null);
  const details = data?.details ?? [];
  const changeDataset =
    (typeof getChangeDataset === "function" ? getChangeDataset() : null) ??
    changeDatasetProp ??
    {};

  /** 원본 detail + changeDataset.after 병합 */
  const getDisplayDetail = (item, index) => {
    const key = String(data.id) + ":" + String(index);
    const change = changeDataset?.[key];
    if (!change) return item;
    return {
      ...item,
      detailAuth: change.after.detailAuth,
      detailUseYn: change.after.detailUseYn,
    };
  };

  useEffect(() => {
    if (!isExpanded || !data?.id) return;

    /** 펼침 테이블 높이 측정 후 AG Grid row 높이 갱신 */
    const measure = () => {
      const el = containerRef.current;
      if (!el) return;
      onHeightChange?.(data.id, el.scrollHeight + ROW_HEIGHT_PADDING);
    };

    measure();
    const observer = new ResizeObserver(measure);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isExpanded, data, details, isEditing, onHeightChange]);

  /** AG Grid 이벤트 전파 차단 (셀 클릭/편집 충돌 방지) */
  const stopGridEvent = (e) => {
    e.stopPropagation();
  };

  return (
    <div ref={containerRef} style={{ padding: "4px 0" }} onMouseDown={stopGridEvent}>
      <div>{data?.authName}</div>
      {isExpanded && (
        <table
          className="table-cell-renderer"
          style={{ width: "720px", borderCollapse: "collapse", marginTop: 6, background: "#eee" }}
          onClick={stopGridEvent}
          onMouseDown={stopGridEvent}
        >
          <thead>
            <tr>
              <th style={{ width: "10%" }}>DETAIL_USE_YN</th>
              <th style={{ width: "18%" }}>DETAIL_ID</th>
              <th style={{ width: "28%" }}>DETAIL_NM</th>
              <th style={{ width: "34%" }}>DETAIL_AUTH</th>
            </tr>
          </thead>
          <tbody>
            {details.map((item, index) => {
              const display = getDisplayDetail(item, index);
              return (
                <tr key={String(data.id) + "-" + String(index) + "-" + String(item.detailId ?? "")}>
                  <td style={{ textAlign: "center" }}>
                    {isEditing ? (
                      <DetailUseYnCheckbox
                        checked={display.detailUseYn === "Y"}
                        stopGridEvent={stopGridEvent}
                        onCommit={(next) =>
                          onDetailChange?.(data.id, index, "detailUseYn", next)
                        }
                      />
                    ) : (
                      display.detailUseYn ?? ""
                    )}
                  </td>
                  <td>{display.detailId ?? ""}</td>
                  <td>{display.detailNm ?? ""}</td>
                  <td>
                    {isEditing ? (
                      <DetailAuthInput
                        value={display.detailAuth ?? ""}
                        stopGridEvent={stopGridEvent}
                        onCommit={(next) =>
                          onDetailChange?.(data.id, index, "detailAuth", next)
                        }
                      />
                    ) : (
                      display.detailAuth ?? ""
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

/** B003 그리드 패널 — changeDataset 기반 수정/저장 */
const GridPanelB003 = ({
  rowData,
  changeDataset = {},
  loading,
  searched,
  isEditing,
  saving,
  hasChanges = false,
  onStartEdit,
  onSave,
  onCancelEdit,
  onDetailChange,
}) => {
  const changeDatasetRef = useRef(changeDataset);
  changeDatasetRef.current = changeDataset;
  const [showAll, setShowAll] = useState(() =>
    getCookieBoolean(B003_GRID_OPTIONS.alwaysExpandCookieKey, true)
  );
  const gridRef = useRef(null);
  const [expandedRowIds, setExpandedRowIds] = useState(() => new Set());
  const [rowHeights, setRowHeights] = useState({});
  const rowIdSignatureRef = useRef("");

  /** 항상 펼치기 토글 — 전체 펼침/접기 + 쿠키 저장 */
  const handleAlwaysExpandToggle = useCallback(
    (checked) => {
      setShowAll(checked);
      setCookie(B003_GRID_OPTIONS.alwaysExpandCookieKey, checked ? "true" : "false");

      if (checked) {
        const ids = rowData.map((row) => row?.id).filter(Boolean);
        setExpandedRowIds(new Set(ids));
      } else {
        setExpandedRowIds(new Set());
        setRowHeights({});
      }
    },
    [rowData]
  );

  /** 단일 row 펼침/접기 토글 */
  const toggleRowExpand = useCallback((rowId) => {
    if (!rowId) return;
    setExpandedRowIds((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) {
        next.delete(rowId);
        setRowHeights((heights) => {
          const { [rowId]: _, ...rest } = heights;
          return rest;
        });
      } else {
        next.add(rowId);
      }
      return next;
    });
  }, []);

  /** 전체 row 펼침 */
  const expandAllRows = useCallback(() => {
    const ids = rowData.map((row) => row?.id).filter(Boolean);
    setExpandedRowIds(new Set(ids));
  }, [rowData]);

  /** 전체 row 접기 */
  const collapseAllRows = useCallback(() => {
    setExpandedRowIds(new Set());
    setRowHeights({});
  }, []);

  /** 헤더 화살표 — 전체 펼침/접기 토글 */
  const toggleAllRows = useCallback(() => {
    const ids = rowData.map((row) => row?.id).filter(Boolean);
    if (ids.length === 0) return;
    const allExpanded = ids.every((id) => expandedRowIds.has(id));
    if (allExpanded) collapseAllRows();
    else expandAllRows();
  }, [rowData, expandedRowIds, expandAllRows, collapseAllRows]);

  /** 모든 row가 펼쳐졌는지 여부 */
  const isAllExpanded = useMemo(() => {
    const ids = rowData.map((row) => row?.id).filter(Boolean);
    return ids.length > 0 && ids.every((id) => expandedRowIds.has(id));
  }, [rowData, expandedRowIds]);

  /** 펼침 테이블 높이 변경 시 row별 높이 상태 저장 */
  const handleRowHeightChange = useCallback((rowId, height) => {
    setRowHeights((prev) => {
      if (prev[rowId] === height) return prev;
      return { ...prev, [rowId]: height };
    });
  }, []);

  /** 펼침 셀 렌더러에 전달할 공통 params */
  const getExpandCellParams = useCallback(
    (params) => ({
      isExpanded: expandedRowIds.has(params.data?.id),
      isEditing,
      onToggle: toggleRowExpand,
      onHeightChange: handleRowHeightChange,
      onDetailChange,
      getChangeDataset: () => changeDatasetRef.current,
    }),
    [
      expandedRowIds,
      isEditing,
      toggleRowExpand,
      handleRowHeightChange,
      onDetailChange,
    ]
  );

  /** 헤더 전체 펼침 컴포넌트 params */
  const getExpandHeaderParams = useMemo(
    () => ({
      isAllExpanded,
      onToggleAll: toggleAllRows,
    }),
    [isAllExpanded, toggleAllRows]
  );

  /** 펼침 상태·수정 모드 변경 시 그리드 높이/셀 갱신 */
  useEffect(() => {
    const api = gridRef.current?.api;
    if (!api) return;
    api.resetRowHeights();
    api.refreshCells({ force: true });
    api.refreshHeader();
  }, [expandedRowIds, isEditing]);

  /** row 높이 변경 시 AG Grid 높이 재계산 */
  useEffect(() => {
    gridRef.current?.api?.resetRowHeights();
  }, [rowHeights]);

  /** 조회 데이터 변경 시 초기 펼침 상태 설정 (체크박스만 바뀌면 펼침 유지) */
  useEffect(() => {
    if (!rowData?.length) {
      setExpandedRowIds(new Set());
      setRowHeights({});
      rowIdSignatureRef.current = "";
      return;
    }

    const signature = rowData
      .map((row) => row?.id)
      .filter(Boolean)
      .join("|");
    if (signature === rowIdSignatureRef.current) {
      return;
    }
    rowIdSignatureRef.current = signature;

    if (showAll) {
      const ids = rowData.map((row) => row?.id).filter(Boolean);
      setExpandedRowIds(new Set(ids));
    } else {
      setExpandedRowIds(new Set());
      setRowHeights({});
    }
  }, [rowData, showAll]);

  const columnDefs = useMemo(
    () => [
      {
        headerClass: "my-header",
        field: "name",
        headerName: "이름",
        width: 110,
      },
      {
        headerClass: "my-header",
        field: "empNo",
        headerName: "사번",
        width: 110,
        cellStyle: (params) => {
          if (getScore(params.data) >= 80) {
            return { backgroundColor: "#d4edda", color: "#155724" };
          }
          return { backgroundColor: "#f8d7da", color: "#721c24" };
        },
      },
      {
        field: "dept",
        headerName: "부서",
        width: 150,
        cellClassRules: {
          "bg-red": (params) => getScore(params.data) < 60,
          "bg-green": (params) => getScore(params.data) >= 60,
        },
      },
      {
        colId: "expand",
        headerName: "",
        maxWidth: 50,
        sortable: false,
        filter: false,
        resizable: false,
        cellClass: "cell-arrow-top",
        cellStyle: { display: "flex", alignItems: "flex-start" },
        cellRenderer: ArrowCellRenderer,
        cellRendererParams: getExpandCellParams,
        headerComponent: ArrowHeaderComponent,
        headerComponentParams: getExpandHeaderParams,
      },
      {
        field: "authName",
        headerName: "권한이름",
        width: 400,
        cellRenderer: EditableTableCellRenderer,
        cellRendererParams: getExpandCellParams,
        cellClassRules: {
          "cell-expanded-overflow": (params) => expandedRowIds.has(params.data?.id),
        },
      },
      {
    
        field: "authGrant",
        headerName: "권한부여",
        width: 150,
       
      },
      {
     
        field: "useYn",
        headerName: "사용여부",
        width: 150,
       
      },
    ],
    [getExpandCellParams, getExpandHeaderParams, expandedRowIds]
  );

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      resizable: true,
      filter: true,
      minWidth: 80,
    }),
    []
  );

  const rowClassRules = useMemo(
    () => ({
      "row-expanded": (params) => expandedRowIds.has(params.data?.id),
    }),
    [expandedRowIds]
  );

  /** AG Grid 동적 row 높이 계산 */
  const getRowHeight = useCallback(
    (params) => {
      const id = params.data?.id;
      if (!expandedRowIds.has(id)) return ROW_HEIGHT_COLLAPSED;
      return rowHeights[id] ?? ROW_HEIGHT_EXPANDED_FALLBACK;
    },
    [expandedRowIds, rowHeights]
  );

  const canEdit = searched && rowData.length > 0 && !loading;

  return (
    <div className="grid-panel">
      <div className="grid-panel-header">
        <h2 className="panel-title">목록</h2>
        <div className="grid-panel-actions">
          <label className="always-expand-toggle">
            <input
              type="checkbox"
              checked={showAll}
              onChange={(e) => handleAlwaysExpandToggle(e.target.checked)}
              disabled={!searched || loading || rowData.length === 0}
            />
            <span>항상 펼치기</span>
          </label>
          {!isEditing ? (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onStartEdit}
              disabled={!canEdit || saving}
            >
              수정하기
            </button>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-primary"
                onClick={onSave}
                disabled={saving || !hasChanges}
              >
                {saving ? "저장 중..." : "저장"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCancelEdit}
                disabled={saving}
              >
                취소
              </button>
            </>
          )}
        </div>
      </div>

      {!searched && !loading && (
        <p className="grid-placeholder">조회 버튼을 클릭하면 목록이 표시됩니다.</p>
      )}
      {loading && <p className="grid-placeholder">데이터를 조회하는 중...</p>}

      <div
        className="ag-theme-alpine grid-container grid-container-scroll"
        style={{ display: searched || loading ? "block" : "none" }}
      >
        <GridWrapper>
          <AgGridReact
            ref={gridRef}
            key="b003-auth-grid"
            rowData={rowData}
            getRowId={(params) => String(params.data?.id ?? "")}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            rowClassRules={rowClassRules}
            getRowHeight={getRowHeight}
            domLayout="normal"
            animateRows
            alwaysShowHorizontalScroll
            overlayNoRowsTemplate="<span>조회 결과가 없습니다.</span>"
          />
        </GridWrapper>
      </div>

      {searched && !loading && (
        <p className="grid-count">총 {rowData.length}건</p>
      )}
    </div>
  );
};

export default GridPanelB003;
