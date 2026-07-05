import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import styled from "styled-components";
import arrowImg from "./arrow.png";
const numberFormatter = (p) => (p.value != null ? p.value.toLocaleString() : "");

/** cellClassRules용 — API에 score 없으면 aa2024 값으로 대체 */
const getScore = (data) => data?.score ?? data?.aa2024 ?? 0;

const GridWrapper = styled.div`
width: 100%;
height: 100%;
// overflow: hidden;
// border: 1px solid #ccc;
// border-radius: 5px;
// padding: 10px;
// margin: 10px;
// box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
// background-color: #fff;
// position: relative;
// z-index: 1;
.row-red {
   // background:rgb(61, 111, 219);
} 
  .my-header {
   border:1px solid yellow
  }

  .my-header .ag-header-cell-label {
    justify-content: center;
    color: blue;
    font-weight: bold;
  }

  .bg-red{border:2px solid red!important}
  .bg-green{border:2px solid green!important}

  .bg-red {
    background: #ffdddd;
}

.bg-green {
    background: #ddffdd;
}
.table-cell-renderer{border:1px solid blue}
.table-cell-renderer td{border:1px solid blue}
.table-cell-renderer tr{border:1px solid blue}
.table-cell-renderer tbody{border:1px solid blue}
.table-cell-renderer thead{border:1px solid blue}
.table-cell-renderer th{border:1px solid blue}
.table-cell-renderer td{border:1px solid blue}
.table-cell-renderer tr{border:1px solid blue}
.table-cell-renderer tbody{border:1px solid blue}
.table-cell-renderer thead{border:1px solid blue}
.table-cell-renderer th{border:1px solid blue}

  /*
   * 펼친 행 셀만 overflow visible (옆 컬럼으로 테이블 넘침용)
   * ※ .ag-center-cols-viewport 에 overflow:visible 주면
   *    body 가로 스크롤이 깨져 헤더만 움직이고 행은 고정됨 → 절대 넣지 말 것
   */
  .ag-row.row-expanded {
    overflow: visible !important;
    z-index: 2;
  }

  .ag-row.row-expanded .ag-cell {
    overflow: visible !important;
  }

  .ag-cell.cell-expanded-overflow {
    overflow: visible !important;
  }

  /* 펼침 화살표 컬럼: 행이 커져도 상단 정렬 */
  .ag-cell.cell-arrow-top {
    align-items: flex-start !important;
  }
`;


function MyHeaderComponent() {}

MyHeaderComponent.prototype.init = function(params) {
    this.eGui = document.createElement('div');

    this.eGui.innerHTML = `
        <div class="my-header">
            <span>${params.displayName}</span>
            <div class="my-header-info">${params.text}</div>
        </div>
    `;
};

MyHeaderComponent.prototype.getGui = function() {
    return this.eGui;
};


const ROW_HEIGHT_COLLAPSED = 42;
/** 측정 전 펼침 상태 임시 높이 (곧 rowHeights로 대체됨) */
const ROW_HEIGHT_EXPANDED_FALLBACK = 80;
/** 셀 padding 등 여유 */
const ROW_HEIGHT_PADDING = 12;


// =============================================================================
// [펼침/접힘 전체 흐름 요약]
// ① columnDefs(expand 컬럼) → cellRenderer / headerComponent 등록          [E01~E06]
// ② AG Grid가 각 셀마다 getExpandCellParams(params) 호출 → props 생성    [B01~B05]
// ③ ArrowCellRenderer가 props 받아 화살표 렌더                            [A01~A12]
// ④ 화살표 클릭 → onToggle(rowId) → toggleRowExpand → expandedRowIds 갱신 [B06~B10]
// ⑤ expandedRowIds 변경 → useEffect → resetRowHeights / refreshCells      [G01]
// ⑥ 담당자 셀 TableCellRenderer도 같은 params로 isExpanded 확인 후 테이블 표시
// ⑦ 헤더는 getExpandHeaderParams → ArrowHeaderComponent → toggleAllRows   [D01~D07, C01~C10]
// =============================================================================

// A01 — 행(셀) 화살표 UI 컴포넌트. AG Grid가 각 행마다 한 번씩 호출해 렌더링함
const ArrowCellRenderer = ({ data, isExpanded, onToggle }) => {
  // A02 — 현재 행 데이터에서 id 추출 (펼침 상태를 구분하는 키)
  const rowId = data?.id;

  // A03 — 화살표 클릭 시 실행되는 함수
  const handleClick = (e) => {
    // A04 — 그리드 행 선택 등 부모 클릭 이벤트로 전파되지 않게 막음
    e.stopPropagation();
    // A05 — getExpandCellParams가 넘긴 onToggle(=toggleRowExpand) 호출 → [B06]으로 이동
    onToggle?.(rowId);
  };

  // A06 — 화살표 버튼 JSX 반환
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick} // A07 — 클릭 시 [A03] handleClick 실행
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick(e);
      }}
      style={{
        display: "flex",
        alignItems: "flex-start", // 행 높이 늘어나도 화살표는 상단 고정
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
          // A08 — isExpanded(true)면 화살표 180도 회전 (펼쳐진 상태 표시)
          //       isExpanded는 [B03]에서 expandedRowIds.has(id)로 계산된 값
          transform: isExpanded ? "rotate(180deg)" : "none",
          transition: "transform 0.2s",
        }}
      />
    </div>
  );
};



// C01 — 헤더(컬럼 맨 위) 화살표 UI. 전체 펼치기/전체 접기 담당
const ArrowHeaderComponent = ({ isAllExpanded, onToggleAll }) => {
  // C02 — 헤더 화살표 클릭 핸들러
  const handleClick = (e) => {
    e.stopPropagation();
    // C03 — getExpandHeaderParams가 넘긴 onToggleAll(=toggleAllRows) 호출 → [D04]로 이동
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
      // C04 — 툴팁: 전체가 펼쳐졌는지에 따라 문구 변경
      title={isAllExpanded ? "전체 접기" : "전체 펼치기"}
    >
      <img
        src={arrowImg}
        alt={isAllExpanded ? "전체 접기" : "전체 펼치기"}
        style={{
          width: 16,
          height: 16,
          display: "block",
          // C05 — isAllExpanded는 [D02]에서 계산. true면 전체 펼침 상태 → 화살표 위쪽
          transform: isAllExpanded ? "rotate(180deg)" : "none",
          transition: "transform 0.2s",
        }}
      />
    </div>
  );
};


/**
 * 권한이름 셀 — 펼침 시 details(세부권한) 테이블 렌더 + DOM 높이 측정
 * getExpandCellParams에서 isExpanded, onHeightChange를 받음 [B03, B05]
 * ※ 펼침 여부는 data.id 로 판단하므로 rowData에 id가 반드시 있어야 함
 */
const TableCellRenderer = ({ data, isExpanded, onHeightChange }) => {
  const containerRef = useRef(null);
  const details = data?.details ?? [];

  useEffect(() => {
    // T01 — 접힌 행이거나 id 없으면 측정 안 함
    if (!isExpanded || !data?.id) return;

    const measure = () => {
      const el = containerRef.current;
      if (!el) return;
      // T02 — 실제 렌더된 내용 높이 측정 → [B05] onHeightChange → rowHeights 저장
      const contentHeight = el.scrollHeight + ROW_HEIGHT_PADDING;
      onHeightChange?.(data.id, contentHeight);
    };

    measure();

    const observer = new ResizeObserver(measure);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [isExpanded, data, details.length, onHeightChange]);

  return (
    <div ref={containerRef} style={{ padding: "4px 0" }}>
      {/* 접힌 상태: 권한이름만 표시 */}
      <div>{data?.authName}</div>
      {/* T03 — isExpanded=true일 때만 세부권한 테이블 표시 */}
      {isExpanded && (
        <table
          className="table-cell-renderer"
          style={{ width: "600px", borderCollapse: "collapse", marginTop: 6 }}
        >
          <thead>
            <tr>
              <th>세부권한정보</th>
              <th>사용여부</th>
            </tr>
          </thead>
          <tbody>
            {details.map((item, index) => (
              <tr key={`${data.id}-${index}`}>
                <td>{item.detailAuth}</td>
                <td>{item.detailUseYn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};




const GridPanel = ({ rowData, loading, searched }) => {
  // H01 — true: 조회 직후 전체 펼침 / false: 조회 직후 전체 접힘 → [H02] useEffect에서 사용
  const [showAll, setShowAll] = useState(true);
  const gridRef = useRef(null);
  // S01 — 현재 펼쳐진 행 id 목록 (Set). 예: Set {"1", "3", "5"}
  const [expandedRowIds, setExpandedRowIds] = useState(() => new Set());
  // S02 — 펼친 행별 측정 높이(px). 예: { "1": 120, "3": 98 }
  const [rowHeights, setRowHeights] = useState({});

  // B06 — 행 화살표 클릭 시 호출되는 핵심 함수 (A05에서 onToggle으로 연결됨)
  const toggleRowExpand = useCallback((rowId) => {
    if (!rowId) return;
    setExpandedRowIds((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) {
        // B07 — 이미 펼쳐진 행이면 접기: id 제거 + 높이 캐시 삭제
        next.delete(rowId);
        setRowHeights((heights) => {
          const { [rowId]: _, ...rest } = heights;
          return rest;
        });
      } else {
        // B08 — 접힌 행이면 펼치기: id 추가
        next.add(rowId);
      }
      return next;
    });
    // B09 — state 변경 후 [G01] useEffect가 실행되어 그리드 갱신
  }, []);

  // D05 — 전체 펼치기: rowData의 모든 id를 expandedRowIds에 넣음
  const expandAllRows = useCallback(() => {
    const ids = rowData.map((row) => row?.id).filter(Boolean);
    setExpandedRowIds(new Set(ids));
  }, [rowData]);

  // D06 — 전체 접기: expandedRowIds·rowHeights 모두 비움
  const collapseAllRows = useCallback(() => {
    setExpandedRowIds(new Set());
    setRowHeights({});
  }, []);

  // D04 — 헤더 화살표 클릭 시 호출 (C03에서 onToggleAll로 연결됨)
  const toggleAllRows = useCallback(() => {
    const ids = rowData.map((row) => row?.id).filter(Boolean);
    if (ids.length === 0) return;

    const allExpanded = ids.every((id) => expandedRowIds.has(id));
    if (allExpanded) collapseAllRows(); // D06
    else expandAllRows();               // D05
  }, [rowData, expandedRowIds, expandAllRows, collapseAllRows]);

  // D02 — 모든 행이 펼쳐졌는지 여부 (헤더 화살표 방향 결정용)
  const isAllExpanded = useMemo(() => {
    const ids = rowData.map((row) => row?.id).filter(Boolean);
    return ids.length > 0 && ids.every((id) => expandedRowIds.has(id));
  }, [rowData, expandedRowIds]);

  /** TableCellRenderer가 측정한 높이를 state에 저장 */
  const handleRowHeightChange = useCallback((rowId, height) => {
    setRowHeights((prev) => {
      if (prev[rowId] === height) return prev;
      return { ...prev, [rowId]: height };
    });
  }, []);

  // B01 — 셀 렌더러(ArrowCellRenderer, TableCellRenderer)에 넘길 props 생성 함수
  //       AG Grid가 각 셀을 그릴 때마다 params(행 정보)를 넣어 호출함
  const getExpandCellParams = useCallback(
    (params) => ({
      // B02 — AG Grid가 넘긴 현재 행 데이터 (company, manager, id 등)
      // B03 — 이 행이 펼쳐졌는지: expandedRowIds Set에 id가 있으면 true
      isExpanded: expandedRowIds.has(params.data?.id),
      // B04 — 행 화살표 클릭 시 실행할 함수 → [B06] toggleRowExpand
      onToggle: toggleRowExpand,
      // B05 — 담당자 셀(TableCellRenderer)에서 높이 측정 후 호출
      onHeightChange: handleRowHeightChange,
    }),
    [expandedRowIds, toggleRowExpand, handleRowHeightChange]
  );

  // D01 — 헤더 컴포넌트(ArrowHeaderComponent)에 넘길 props
  const getExpandHeaderParams = useMemo(
    () => ({
      // D02 — 전체 펼침 여부 (위 isAllExpanded)
      isAllExpanded,
      // D03 — 헤더 화살표 클릭 시 실행 → [D04] toggleAllRows
      onToggleAll: toggleAllRows,
    }),
    [isAllExpanded, toggleAllRows]
  );

  // G01 — expandedRowIds가 바뀔 때마다 그리드에 반영
  useEffect(() => {
    const api = gridRef.current?.api;
    if (!api) return;
    api.resetRowHeights();      // G02 — getRowHeight 다시 계산
    api.refreshCells({ force: true }); // G03 — ArrowCellRenderer·TableCellRenderer 재렌더
    api.refreshHeader();        // G04 — ArrowHeaderComponent 재렌더
  }, [expandedRowIds]);

  // G05 — rowHeights(측정 높이) 변경 시 행 높이만 재계산
  useEffect(() => {
    gridRef.current?.api?.resetRowHeights();
  }, [rowHeights]);

  // H02 — 조회(rowData 변경) 시 showAll 값에 따라 초기 펼침 상태 결정
  useEffect(() => {
    if (!rowData?.length) {
      setExpandedRowIds(new Set());
      setRowHeights({});
      return;
    }

    if (showAll) {
      // H03 — showAll=true → 조회 직후 전체 펼침
      const ids = rowData.map((row) => row?.id).filter(Boolean);
      setExpandedRowIds(new Set(ids));
    } else {
      // H04 — showAll=false → 조회 직후 전체 접힘
      setExpandedRowIds(new Set());
      setRowHeights({});
    }
  }, [rowData, showAll]);

  const columnDefs = useMemo(
    () => [
      { 
        // headerComponent: MyHeaderComponent,
        // headerComponentParams: {
        //   text: "추가값"
        // },
        headerClass: "my-header",
        field: "name", 
        headerName: "이름", 
        width: 110, 
        //pinned: "left" 
      },
      { 
        headerClass: "my-header",
        field: "empNo", 
        headerName: "사번", 
        width: 110 ,
        cellStyle: (params) => {
          if (getScore(params.data) >= 80) {
            return {
              backgroundColor: "#d4edda",
              color: "#155724"
            };
          }
    
          return {
            backgroundColor: "#f8d7da",
            color: "#721c24"
          };
        }
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
        // E01 — 각 행 셀에 그릴 React 컴포넌트 지정 → [A01] ArrowCellRenderer
        cellRenderer: ArrowCellRenderer,
        // E02 — 셀 렌더 시 props 생성 함수 호출 → [B01] getExpandCellParams
        cellRendererParams: getExpandCellParams,
        // E03 — 컬럼 헤더에 그릴 React 컴포넌트 → [C01] ArrowHeaderComponent
        headerComponent: ArrowHeaderComponent,
        // E04 — 헤더 렌더 시 props 연결 → [D01] getExpandHeaderParams
        headerComponentParams: getExpandHeaderParams,
      },
      {
        field: "authName",
        headerName: "권한이름",
        width: 400,
        // E05 — 담당자 셀도 같은 getExpandCellParams 사용 (isExpanded로 테이블 표시 여부 결정)
        cellRenderer: TableCellRenderer,
        cellRendererParams: getExpandCellParams,
        cellClassRules: {
          // E06 — 펼친 행의 담당자 셀에 overflow visible 클래스 부여
          "cell-expanded-overflow": (params) => expandedRowIds.has(params.data?.id),
        },
      },
      { 
        field: "authGrant", 
        headerName: "권한부여", 
        width: 150 ,
       
      },
      { 
        field: "useYn", 
        headerName: "사용여부", 
        width: 150 ,
       
      },
      // {
      //   headerName: "aaGroup",
      //   children: [
      //     { field: "aa2022", headerName: "2022", width: 95, valueFormatter: numberFormatter },
      //     { field: "aa2023", headerName: "2023", width: 95, valueFormatter: numberFormatter },
      //     { field: "aa2024", headerName: "2024", width: 95, valueFormatter: numberFormatter },
      //   ],
      // },
      // {
      //   headerName: "bbGroup",
      //   children: [
      //     { field: "bb2022", headerName: "2022", width: 105, valueFormatter: numberFormatter },
      //     { field: "bb2023", headerName: "2023", width: 105, valueFormatter: numberFormatter },
      //     { field: "bb2024", headerName: "2024", width: 105, valueFormatter: numberFormatter },
      //   ],
      // },
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
      // R01 — 펼친 행에 row-expanded 클래스 → GridWrapper CSS overflow:visible 적용
      "row-expanded": (params) => expandedRowIds.has(params.data?.id),
    }),
    [expandedRowIds]
  );

  // R02 — 행 높이: 접힘=42px, 펼침=측정값(rowHeights) 또는 임시 80px
  const getRowHeight = useCallback(
    (params) => {
      const id = params.data?.id;
      if (!expandedRowIds.has(id)) return ROW_HEIGHT_COLLAPSED;
      return rowHeights[id] ?? ROW_HEIGHT_EXPANDED_FALLBACK;
    },
    [expandedRowIds, rowHeights]
  );

  return (
    <div className="grid-panel">
      <h2 className="panel-title">목록</h2>
      {!searched && !loading && (
        <p className="grid-placeholder">조회 버튼을 클릭하면 목록이 표시됩니다.</p>
      )}
      {loading && <p className="grid-placeholder">데이터를 조회하는 중...</p>}
      <div
        className="ag-theme-alpine grid-container grid-container-scroll"
        style={{ display: searched || loading ? "block" : "none" }}
      >
        <>
        <GridWrapper>
          <AgGridReact
            ref={gridRef}
            key="b001-company-grid-v2"
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
        </>
      </div>
      {searched && !loading && (
        <p className="grid-count">총 {rowData.length}건</p>
      )}
    </div>
  );
};

export default GridPanel;
