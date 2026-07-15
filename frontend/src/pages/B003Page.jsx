import { useEffect, useRef } from "react";
import SearchPanel from "../components/SearchPanel";
import GridPanelB003 from "../components/GridPanelB003";
import { useSearchB003 } from "../hooks/useSearchB003";
import { useGridB003 } from "../hooks/useGridB003";

/** B003 화면 — 조회 패널 + 그리드 패널 조합 */
const B003Page = () => {
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
  } = useSearchB003();

  const {
    rowData,
    changeDataset,
    loading: gridLoading,
    searched,
    isEditing,
    saving,
    hasChanges,
    search,
    clearGrid,
    startEdit,
    cancelEdit,
    updateDetail,
    save,
  } = useGridB003();

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
    <div className="page b003-page">
      <h1 className="page-title">B003 - AG Grid 조회/수정 화면</h1>
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
        gridLoading={gridLoading || saving}
      />
      <GridPanelB003
        rowData={rowData}
        changeDataset={changeDataset}
        loading={gridLoading}
        searched={searched}
        isEditing={isEditing}
        saving={saving}
        hasChanges={hasChanges}
        onStartEdit={startEdit}
        onSave={save}
        onCancelEdit={cancelEdit}
        onDetailChange={updateDetail}
      />
    </div>
  );
};

export default B003Page;
