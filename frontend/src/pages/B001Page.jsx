import SearchPanel from "../components/SearchPanel";
import GridPanel from "../components/GridPanel";
import { useSearch } from "../hooks/useSearch";
import { useGrid } from "../hooks/useGrid";

const B001Page = () => {
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

  const { rowData, loading: gridLoading, searched, search, clearGrid } = useGrid();

  const handleSearch = async () => {
    await search(getSearchParams());
  };

  const handleReset = async () => {
    await resetFilters();
    clearGrid();
  };

  return (
    <div className="page b001-page">
      <h1 className="page-title">B001 - AG Grid 조회 화면</h1>
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
        gridLoading={gridLoading}
      />
      <GridPanel rowData={rowData} loading={gridLoading} searched={searched} />
    </div>
  );
};

export default B001Page;
