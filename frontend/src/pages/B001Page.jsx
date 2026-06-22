import SearchPanel from "../components/SearchPanel";
import GridPanel from "../components/GridPanel";
import { useSearch } from "../hooks/useSearch";
import { useGrid } from "../hooks/useGrid";

const B001Page = () => {
  const {
    filters, // 조회 조건 현재 값 (주차, 부서/팀/카테고리/상태/유형 코드)
    departments, // 2번 필터 부서 셀렉트 옵션 목록
    sections, // 3번 필터 팀 셀렉트 옵션 목록 (전체 포함)
    categories, // 4번 필터 카테고리 다중선택 옵션 목록
    statuses, // 5번 필터 상태 라디오 옵션 목록
    types, // 6번 필터 유형 체크박스 옵션 목록
    loading, // 필터 옵션 API 로딩 중 여부
    handleWeekChange, // 1번 주차 달력 변경 핸들러
    handleDepartmentChange, // 2번 부서 셀렉트 변경 핸들러
    handleSectionChange, // 3번 팀 셀렉트 변경 핸들러
    handleCategoryChange, // 4번 카테고리 다중선택 변경 핸들러
    handleStatusChange, // 5번 상태 라디오 변경 핸들러
    handleTypeChange, // 6번 유형 체크박스 변경 핸들러
    resetFilters, // 조회 조건 초기값으로 리셋
    getSearchParams, // API 조회용 파라미터 객체 반환
  } = useSearch();

  const { rowData, loading: gridLoading, searched, search, clearGrid } = useGrid();

  const handleSearch = async () => {
    await search(getSearchParams());
  };

  // 리셋 버튼 클릭 시 실행: 1) 조회조건 초기화 → 2) 그리드 데이터 비우기
  const handleReset = async () => {
    await resetFilters(); // useSearch: 오늘 주차·첫 번째 옵션으로 필터 복원 + API 재조회
    clearGrid(); // useGrid: rowData 비우고 searched=false → "조회 버튼을 클릭하면..." 안내 표시
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
