import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import styled from "styled-components";
import arrowImg from "./arrow.png";
import { getDetailAuthOptions } from "../data/mockAuthData";

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

const ArrowCellRenderer = ({ data, isExpanded, onToggle }) => {
  const rowId = data?.id;

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

const ArrowHeaderComponent = ({ isAllExpanded, onToggleAll }) => {
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

/** B002 — 펼침 테이블 수정용 (세부권한=셀렉트, 사용여부=체크박스) */
const EditableTableCellRenderer = ({
  data,
  isExpanded,
  isEditing,
  detailAuthOptions,
  onHeightChange,
  onDetailChange,
}) => {
  const containerRef = useRef(null);
  const details = data?.details ?? [];

  useEffect(() => {
    if (!isExpanded || !data?.id) return;

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

  const stopGridEvent = (e) => {
    e.stopPropagation();
  };

  return (
    <div ref={containerRef} style={{ padding: "4px 0" }} onMouseDown={stopGridEvent}>
      <div>{data?.authName}</div>
      {isExpanded && (
        <table
          className="table-cell-renderer"
          style={{ width: "600px", borderCollapse: "collapse", marginTop: 6 ,    background: "#eee"}}
          onClick={stopGridEvent}
          onMouseDown={stopGridEvent}
        >
          <thead>
            <tr>
              <th style={{ width: "72%" }}>세부권한정보</th>
              <th style={{ width: "28%" }}>사용여부</th>
            </tr>
          </thead>
          <tbody>
            {details.map((item, index) => (
              <tr key={item.detailId ?? `${data.id}-${index}`}>
                <td>
                  <select
                    className="detail-select"
                    value={item.detailAuth}
                    disabled={!isEditing}
                    onMouseDown={stopGridEvent}
                    onClick={stopGridEvent}
                    onChange={(e) =>
                      onDetailChange?.(data.id, index, "detailAuth", e.target.value)
                    }
                  >
                    {detailAuthOptions.map((opt) => (
                      <option key={opt.code} value={opt.code}>
                        {opt.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td style={{ textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={item.detailUseYn === "Y"}
                    disabled={!isEditing}
                    onMouseDown={stopGridEvent}
                    onClick={stopGridEvent}
                    onChange={(e) =>
                      onDetailChange?.(
                        data.id,
                        index,
                        "detailUseYn",
                        e.target.checked ? "Y" : "N"
                      )
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const GridPanelB002 = ({
  rowData,
  loading,
  searched,
  isEditing,
  saving,
  onStartEdit,
  onSave,
  onCancelEdit,
  onDetailChange,
}) => {
  const [showAll] = useState(true);
  const gridRef = useRef(null);
  const [expandedRowIds, setExpandedRowIds] = useState(() => new Set());
  const [rowHeights, setRowHeights] = useState({});
  const detailAuthOptions = useMemo(() => getDetailAuthOptions(), []);

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

  const expandAllRows = useCallback(() => {
    const ids = rowData.map((row) => row?.id).filter(Boolean);
    setExpandedRowIds(new Set(ids));
  }, [rowData]);

  const collapseAllRows = useCallback(() => {
    setExpandedRowIds(new Set());
    setRowHeights({});
  }, []);

  const toggleAllRows = useCallback(() => {
    const ids = rowData.map((row) => row?.id).filter(Boolean);
    if (ids.length === 0) return;
    const allExpanded = ids.every((id) => expandedRowIds.has(id));
    if (allExpanded) collapseAllRows();
    else expandAllRows();
  }, [rowData, expandedRowIds, expandAllRows, collapseAllRows]);

  const isAllExpanded = useMemo(() => {
    const ids = rowData.map((row) => row?.id).filter(Boolean);
    return ids.length > 0 && ids.every((id) => expandedRowIds.has(id));
  }, [rowData, expandedRowIds]);

  const handleRowHeightChange = useCallback((rowId, height) => {
    setRowHeights((prev) => {
      if (prev[rowId] === height) return prev;
      return { ...prev, [rowId]: height };
    });
  }, []);

  const getExpandCellParams = useCallback(
    (params) => ({
      isExpanded: expandedRowIds.has(params.data?.id),
      isEditing,
      detailAuthOptions,
      onToggle: toggleRowExpand,
      onHeightChange: handleRowHeightChange,
      onDetailChange,
    }),
    [
      expandedRowIds,
      isEditing,
      detailAuthOptions,
      toggleRowExpand,
      handleRowHeightChange,
      onDetailChange,
    ]
  );

  const getExpandHeaderParams = useMemo(
    () => ({
      isAllExpanded,
      onToggleAll: toggleAllRows,
    }),
    [isAllExpanded, toggleAllRows]
  );

  useEffect(() => {
    const api = gridRef.current?.api;
    if (!api) return;
    api.resetRowHeights();
    api.refreshCells({ force: true });
    api.refreshHeader();
  }, [expandedRowIds, isEditing]);

  useEffect(() => {
    gridRef.current?.api?.resetRowHeights();
  }, [rowHeights]);

  useEffect(() => {
    if (!rowData?.length) {
      setExpandedRowIds(new Set());
      setRowHeights({});
      return;
    }

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
                disabled={saving}
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
            key="b002-auth-grid"
            rowData={rowData}
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

export default GridPanelB002;
