import { useEffect, useRef } from "react";
import SearchPanel from "../components/SearchPanel";
import GridPanelB002 from "../components/GridPanelB002";
import { useSearchB002 } from "../hooks/useSearchB002";
import { useGridB002 } from "../hooks/useGridB002";
import { B002_GRID_OPTIONS } from "../config/b002GridOptions";

/** B002 화면 — 조회 패널 + 그리드 패널 조합 */
const B002Page = () => {
  const {
    filters,
    departments,
    sections,
    categories,
    statuses,
    types,
    loading,
    handleWeekChange,
    handleDepartmentChange,
    handleSectionChange,
    handleCategoryChange,
    handleStatusChange,
    handleTypeChange,
    resetFilters,
    getSearchParams,
  } = useSearchB002();

  const {
    rowData,
    loading: gridLoading,
    searched,
    isEditing,
    saving,
    syncing,
    search,
    clearGrid,
    startEdit,
    cancelEdit,
    updateDetail,
    syncRowDetails,
    save,
  } = useGridB002();

  /** 조회 버튼 — 검색 조건으로 그리드 데이터 조회 */
  const handleSearch = async () => {
    await search(getSearchParams());
  };

  /** 초기화 버튼 — 검색 조건·그리드 데이터 초기화 */
  const handleReset = async () => {
    await resetFilters();
    clearGrid();
  };

  const initialSearchDone = useRef(false);

  /** 최초 진입 시 부서 로드 완료 후 자동 조회 (1회) */
  useEffect(() => {
    if (loading || !filters.departmentCode || initialSearchDone.current) return;
    initialSearchDone.current = true;
    search(getSearchParams());
  }, [loading, filters.departmentCode, search, getSearchParams]);

  return (
    <div className="page b002-page">
      <h1 className="page-title">B002 - AG Grid 조회/수정 화면</h1>
      <SearchPanel
        filters={filters}
        departments={departments}
        sections={sections}
        categories={categories}
        statuses={statuses}
        types={types}
        loading={loading}
        onWeekChange={handleWeekChange}
        onDepartmentChange={handleDepartmentChange}
        onSectionChange={handleSectionChange}
        onCategoryChange={handleCategoryChange}
        onStatusChange={handleStatusChange}
        onTypeChange={handleTypeChange}
        onSearch={handleSearch}
        onReset={handleReset}
        gridLoading={gridLoading || saving || syncing}
      />
      <GridPanelB002
        rowData={rowData}
        loading={gridLoading}
        searched={searched}
        isEditing={isEditing}
        saving={saving}
        syncing={syncing}
        preserveViewOnDetailSync={B002_GRID_OPTIONS.preserveViewOnDetailSync}
        onStartEdit={startEdit}
        onSave={save}
        onCancelEdit={cancelEdit}
        onDetailChange={updateDetail}
        onSyncRowDetails={syncRowDetails}
      />
    </div>
  );
};

export default B002Page;
