import { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const GridPanel = ({ rowData, loading, searched }) => {
  const columnDefs = useMemo(
    () => [
      { field: "id", headerName: "ID", width: 80 },
      { field: "week", headerName: "주차", width: 100 },
      { field: "departmentName", headerName: "부서", width: 120 },
      { field: "sectionName", headerName: "팀", width: 140 },
      { field: "categoryName", headerName: "카테고리", width: 100 },
      { field: "statusName", headerName: "상태", width: 100 },
      { field: "typeName", headerName: "유형", width: 100 },
      { field: "title", headerName: "제목", flex: 1, minWidth: 200 },
      {
        field: "amount",
        headerName: "금액",
        width: 120,
        valueFormatter: (p) => (p.value != null ? p.value.toLocaleString() : ""),
      },
    ],
    []
  );

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      resizable: true,
      filter: true,
    }),
    []
  );

  return (
    <div className="grid-panel">
      <h2 className="panel-title">목록</h2>
      {!searched && !loading && (
        <p className="grid-placeholder">조회 버튼을 클릭하면 목록이 표시됩니다.</p>
      )}
      {loading && <p className="grid-placeholder">데이터를 조회하는 중...</p>}
      <div
        className="ag-theme-alpine grid-container"
        style={{ display: searched || loading ? "block" : "none" }}
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          domLayout="autoHeight"
          animateRows
          overlayNoRowsTemplate="<span>조회 결과가 없습니다.</span>"
        />
      </div>
      {searched && !loading && (
        <p className="grid-count">총 {rowData.length}건</p>
      )}
    </div>
  );
};

export default GridPanel;
