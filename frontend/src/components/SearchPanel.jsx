/**
 * SearchPanel - B001 조회 조건 UI 컴포넌트
 * 6개 필터 + 조회/리셋 버튼을 렌더링합니다.
 * 상태(filters, 옵션 목록)는 부모(B001Page/useSearch)가 관리하고,
 * 이 컴포넌트는 사용자 입력을 onXxx 콜백으로 부모에 전달만 합니다.
 */
import { dateToWeekCode, formatWeekDisplay, weekCodeToDateInput } from "../utils/weekUtil";

const SearchPanel = ({
  filters, // 조회 조건 현재 값 (주차, 부서/팀/카테고리/상태/유형 코드)
  departments, // 2번 필터 부서 셀렉트 옵션 목록
  sections, // 3번 필터 팀 셀렉트 옵션 목록 (전체 포함)
  categories, // 4번 필터 카테고리 다중선택 옵션 목록
  statuses, // 5번 필터 상태 라디오 옵션 목록
  types, // 6번 필터 유형 체크박스 옵션 목록
  loading, // 필터 옵션 API 로딩 중 여부 (입력 비활성화용)
  onWeekChange, // 1번 주차 변경 시 부모(B001Page)에 알리는 콜백
  onDepartmentChange, // 2번 부서 변경 시 부모에 알리는 콜백
  onSectionChange, // 3번 팀 변경 시 부모에 알리는 콜백
  onCategoryChange, // 4번 카테고리 변경 시 부모에 알리는 콜백
  onStatusChange, // 5번 상태 변경 시 부모에 알리는 콜백
  onTypeChange, // 6번 유형 변경 시 부모에 알리는 콜백
  onSearch, // 조회 버튼 클릭 시 부모에 알리는 콜백
  onReset, // 리셋 버튼 클릭 시 부모에 알리는 콜백
  gridLoading, // 그리드 데이터 API 조회 중 여부 (버튼 비활성화용)
}) => {
  /** date input 변경 → 날짜를 주차코드(YYYYWW)로 변환 후 부모에 전달 */
  const handleDateChange = (e) => {
    const week = dateToWeekCode(e.target.value);
    onWeekChange(week);
  };

  /** 모바일용 카테고리 체크박스: 클릭 시 배열에 코드 추가/제거 */
  const handleCategoryToggle = (code) => {
    const next = filters.categoryCodes.includes(code)
      ? filters.categoryCodes.filter((c) => c !== code) // 이미 선택됨 → 제거
      : [...filters.categoryCodes, code]; // 미선택 → 추가
    onCategoryChange(next);
  };

  /** 유형 체크박스: 클릭 시 배열에 코드 추가/제거 */
  const handleTypeToggle = (code) => {
    const next = filters.typeCodes.includes(code)
      ? filters.typeCodes.filter((c) => c !== code)
      : [...filters.typeCodes, code];
    onTypeChange(next);
  };

  return (
    <div className="search-panel">
      <h2 className="panel-title">조회 조건</h2>

      <div className="filter-grid">
        {/* 1번: 주차 달력 — value는 week코드→날짜 문자열로 변환해 표시 */}
        <div className="filter-item">
          <label className="filter-label">1. 주차</label>
          <input
            type="date"
            className="filter-input"
            value={weekCodeToDateInput(filters.week)}
            onChange={handleDateChange}
            disabled={loading}
          />
          <span className="filter-hint">{formatWeekDisplay(filters.week)}</span>
        </div>

        {/* 2번: 부서 셀렉트 — departments 옵션을 map으로 렌더링 */}
        <div className="filter-item">
          <label className="filter-label">2. 부서</label>
          <select
            className="filter-select"
            value={filters.departmentCode}
            onChange={(e) => onDepartmentChange(e.target.value)}
            disabled={loading}
          >
            {departments.map((item) => (
              <option key={item.code} value={item.code}>
                {item.name} ({item.code})
              </option>
            ))}
          </select>
        </div>

        {/* 3번: 팀 셀렉트 — sections 첫 항목이 "전체(ALL)" */}
        <div className="filter-item">
          <label className="filter-label">3. 팀</label>
          <select
            className="filter-select"
            value={filters.sectionCode}
            onChange={(e) => onSectionChange(e.target.value)}
            disabled={loading}
          >
            {sections.map((item) => (
              <option key={item.code} value={item.code}>
                {item.name} ({item.code})
              </option>
            ))}
          </select>
        </div>

        {/* 4번: 카테고리 다중선택 — PC는 multiple select, 모바일은 아래 체크박스 */}
        <div className="filter-item filter-item-wide">
          <label className="filter-label">4. 카테고리 (다중선택)</label>
          <select
            className="filter-select filter-multiselect"
            multiple
            value={filters.categoryCodes}
            onChange={(e) => {
              // selectedOptions에서 선택된 value 코드 배열 추출
              const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
              onCategoryChange(selected);
            }}
            disabled={loading}
          >
            {categories.map((item) => (
              <option key={item.code} value={item.code}>
                {item.name} ({item.code})
              </option>
            ))}
          </select>
          {/* 모바일 화면용 대체 UI (CSS에서 작은 화면일 때만 표시) */}
          <div className="checkbox-fallback">
            {categories.map((item) => (
              <label key={item.code} className="inline-check">
                <input
                  type="checkbox"
                  checked={filters.categoryCodes.includes(item.code)}
                  onChange={() => handleCategoryToggle(item.code)}
                  disabled={loading}
                />
                {item.name}
              </label>
            ))}
          </div>
        </div>

        {/* 5번: 상태 라디오 — name="status"로 그룹화, 하나만 선택 */}
        <div className="filter-item">
          <label className="filter-label">5. 상태</label>
          <div className="radio-group">
            {statuses.map((item) => (
              <label key={item.code} className="radio-label">
                <input
                  type="radio"
                  name="status"
                  value={item.code}
                  checked={filters.statusCode === item.code}
                  onChange={(e) => onStatusChange(e.target.value)}
                  disabled={loading}
                />
                {item.name} ({item.code})
              </label>
            ))}
          </div>
        </div>

        {/* 6번: 유형 체크박스 — 여러 개 동시 선택 가능 */}
        <div className="filter-item filter-item-wide">
          <label className="filter-label">6. 유형</label>
          <div className="checkbox-group">
            {types.map((item) => (
              <label key={item.code} className="checkbox-label">
                <input
                  type="checkbox"
                  value={item.code}
                  checked={filters.typeCodes.includes(item.code)}
                  onChange={() => handleTypeToggle(item.code)}
                  disabled={loading}
                />
                {item.name} ({item.code})
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* 조회/리셋 버튼 — loading 또는 gridLoading 중에는 비활성화 */}
      <div className="button-row">
        <button
          type="button"
          className="btn btn-primary"
          onClick={onSearch}
          disabled={loading || gridLoading}
        >
          조회
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onReset}
          disabled={loading || gridLoading}
        >
          리셋
        </button>
        {(loading || gridLoading) && <span className="loading-text">처리 중...</span>}
      </div>
    </div>
  );
};

export default SearchPanel;
