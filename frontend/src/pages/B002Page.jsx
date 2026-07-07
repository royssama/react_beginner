import SearchPanel from "../components/SearchPanel";
import GridPanelB002 from "../components/GridPanelB002";
import { useSearch } from "../hooks/useSearch";
import { useGridB002 } from "../hooks/useGridB002";

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
  } = useSearch();

  const {
    rowData,
    loading: gridLoading,
    searched,
    isEditing,
    saving,
    search,
    clearGrid,
    startEdit,
    cancelEdit,
    updateDetail,
    save,
  } = useGridB002();

  const handleSearch = async () => {
    await search(getSearchParams());
  };

  const handleReset = async () => {
    await resetFilters();
    clearGrid();
  };

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
        gridLoading={gridLoading || saving}
      />
      <GridPanelB002
        rowData={rowData}
        loading={gridLoading}
        searched={searched}
        isEditing={isEditing}
        saving={saving}
        onStartEdit={startEdit}
        onSave={save}
        onCancelEdit={cancelEdit}
        onDetailChange={updateDetail}
      />
    </div>
  );
};

export default B002Page;
