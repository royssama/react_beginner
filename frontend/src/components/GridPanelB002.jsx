import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import styled from "styled-components";
import arrowImg from "./arrow.png";
import DetailSelectModal from "./DetailSelectModal";

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

/** B002 — 펼침 테이블 (DETAIL_ID/NM 클릭 시 모달) */
const EditableTableCellRenderer = ({
  data,
  isExpanded,
  isEditing,
  onHeightChange,
  onDetailChange,
  onOpenDetailModal,
}) => {
  const containerRef = useRef(null);
  const details = data?.details ?? [];

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

  /** DETAIL_ID/NM 클릭 시 세부권한 선택 모달 오픈 */
  const handleDetailCellClick = (e) => {
    stopGridEvent(e);
    onOpenDetailModal?.(data);
  };

  return (
    <div ref={containerRef} style={{ padding: "4px 0" }} onMouseDown={stopGridEvent}>
      <div
        role="button"
        tabIndex={0}
        className={isExpanded ? "detail-cell-link-wrap" : undefined}
        onMouseDown={isExpanded ? stopGridEvent : undefined}
        onClick={isExpanded ? handleDetailCellClick : undefined}
        onKeyDown={
          isExpanded
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") handleDetailCellClick(e);
              }
            : undefined
        }
      >
        {data?.authName}
      </div>
      {isExpanded && (
        <table
          className="table-cell-renderer"
          style={{ width: "720px", borderCollapse: "collapse", marginTop: 6, background: "#eee" }}
          onClick={stopGridEvent}
          onMouseDown={stopGridEvent}
        >
          <thead>
            <tr>
              <th style={{ width: "18%" }}>DETAIL_ID</th>
              <th style={{ width: "28%" }}>DETAIL_NM</th>
              <th style={{ width: "34%" }}>DETAIL_AUTH</th>
              <th style={{ width: "20%" }}>DETAIL_USE_YN</th>
            </tr>
          </thead>
          <tbody>
            {details.map((item, index) => (
              <tr key={item.detailId ?? `${data.id}-${index}`}>
                <td>
                  <button
                    type="button"
                    className="detail-cell-link"
                    onMouseDown={stopGridEvent}
                    onClick={handleDetailCellClick}
                  >
                    {item.detailId ?? ""}
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className="detail-cell-link"
                    onMouseDown={stopGridEvent}
                    onClick={handleDetailCellClick}
                  >
                    {item.detailNm ?? ""}
                  </button>
                </td>
                <td>{item.detailAuth ?? ""}</td>
                <td style={{ textAlign: "center" }}>
                  {isEditing ? (
                    <input
                      type="checkbox"
                      checked={item.detailUseYn === "Y"}
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
                  ) : (
                    item.detailUseYn ?? ""
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

/** B002 그리드 패널 — 펼침 테이블, 세부권한 모달, 저장 */
const GridPanelB002 = ({
  rowData,
  loading,
  searched,
  isEditing,
  saving,
  syncing,
  preserveViewOnDetailSync = true,
  onStartEdit,
  onSave,
  onCancelEdit,
  onDetailChange,
  onSyncRowDetails,
}) => {
  const [showAll] = useState(true);
  const gridRef = useRef(null);
  const [expandedRowIds, setExpandedRowIds] = useState(() => new Set());
  const [rowHeights, setRowHeights] = useState({});
  const [modalRow, setModalRow] = useState(null);

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

  /** 세부권한 선택 모달 열기 */
  const handleOpenDetailModal = useCallback((row) => {
    if (!row) return;
    setModalRow(row);
  }, []);

  /** 세부권한 선택 모달 닫기 */
  const handleCloseDetailModal = useCallback(() => {
    if (syncing) return;
    setModalRow(null);
  }, [syncing]);

  const pendingScrollRestoreRef = useRef(null);
  const rowIdSignatureRef = useRef("");

  /** AG Grid 세로 스크롤 영역 DOM 조회 */
  const getBodyViewport = useCallback(() => {
    const api = gridRef.current?.api;
    return (
      api?.gridBodyCtrl?.eBodyViewport ??
      gridRef.current?.eGridDiv?.querySelector(".ag-body-viewport") ??
      null
    );
  }, []);

  /** 저장된 스크롤 위치·행 인덱스로 그리드 뷰 복원 */
  const restoreGridView = useCallback(() => {
    const pending = pendingScrollRestoreRef.current;
    if (!pending) return;

    const api = gridRef.current?.api;
    if (!api) return;

    if (pending.rowIndex >= 0) {
      api.ensureIndexVisible(pending.rowIndex, pending.position ?? "middle");
    }

    const viewport = pending.viewport ?? getBodyViewport();
    if (viewport && pending.scrollTop != null) {
      viewport.scrollTop = pending.scrollTop;
    }

    pendingScrollRestoreRef.current = null;
  }, [getBodyViewport]);

  /** 현재 스크롤 위치와 대상 row 인덱스 스냅샷 저장 */
  const captureGridView = useCallback(
    (rowId) => {
      const api = gridRef.current?.api;
      if (!api) return null;

      const viewport = getBodyViewport();
      let rowIndex = -1;
      api.forEachNode((node) => {
        if (node.data?.id === rowId) {
          rowIndex = node.rowIndex ?? -1;
        }
      });

      return {
        rowIndex,
        scrollTop: viewport?.scrollTop ?? 0,
        viewport,
        position: "middle",
      };
    },
    [getBodyViewport]
  );

  /**
   * 모달 확인 — t2 동기화 API 호출
   * preserveViewOnDetailSync=true 이면 펼침·스크롤 유지
   */
  const handleConfirmDetailModal = useCallback(
    async (row, selectedDetails) => {
      const snapshot = preserveViewOnDetailSync ? captureGridView(row.id) : null;
      try {
        await onSyncRowDetails?.(row, selectedDetails);
        setModalRow(null);

        if (preserveViewOnDetailSync) {
          setExpandedRowIds((prev) => {
            const next = new Set(prev);
            next.add(row.id);
            return next;
          });
          setRowHeights((prev) => {
            const next = { ...prev };
            delete next[row.id];
            return next;
          });

          if (snapshot) {
            pendingScrollRestoreRef.current = snapshot;
          }

          requestAnimationFrame(() => {
            requestAnimationFrame(() => restoreGridView());
          });
        } else {
          gridRef.current?.api?.resetRowHeights();
          gridRef.current?.api?.refreshCells({ force: true });
        }
      } catch (err) {
        window.alert(err?.message ?? "세부권한 저장에 실패했습니다.");
      }
    },
    [onSyncRowDetails, captureGridView, restoreGridView, preserveViewOnDetailSync]
  );

  /** 펼침 셀 렌더러에 전달할 공통 params */
  const getExpandCellParams = useCallback(
    (params) => ({
      isExpanded: expandedRowIds.has(params.data?.id),
      isEditing,
      onToggle: toggleRowExpand,
      onHeightChange: handleRowHeightChange,
      onDetailChange,
      onOpenDetailModal: handleOpenDetailModal,
    }),
    [
      expandedRowIds,
      isEditing,
      toggleRowExpand,
      handleRowHeightChange,
      onDetailChange,
      handleOpenDetailModal,
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

  /** row 높이 변경 시 AG Grid 높이 재계산 (옵션 켜면 스크롤 복원) */
  useEffect(() => {
    gridRef.current?.api?.resetRowHeights();
    if (preserveViewOnDetailSync && pendingScrollRestoreRef.current) {
      requestAnimationFrame(() => restoreGridView());
    }
  }, [rowHeights, restoreGridView, preserveViewOnDetailSync]);

  /** 조회 데이터 변경 시 초기 펼침 상태 설정 */
  useEffect(() => {
    if (!rowData?.length) {
      setExpandedRowIds(new Set());
      setRowHeights({});
      rowIdSignatureRef.current = "";
      return;
    }

    if (preserveViewOnDetailSync) {
      const signature = rowData
        .map((row) => row?.id)
        .filter(Boolean)
        .join("|");
      if (signature === rowIdSignatureRef.current) {
        return;
      }
      rowIdSignatureRef.current = signature;
    }

    if (showAll) {
      const ids = rowData.map((row) => row?.id).filter(Boolean);
      setExpandedRowIds(new Set(ids));
    } else {
      setExpandedRowIds(new Set());
      setRowHeights({});
    }
  }, [rowData, showAll, preserveViewOnDetailSync]);

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

      <DetailSelectModal
        open={!!modalRow}
        row={modalRow}
        saving={syncing}
        onClose={handleCloseDetailModal}
        onConfirm={handleConfirmDetailModal}
      />
    </div>
  );
};

export default GridPanelB002;
