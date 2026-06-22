import { dateToWeekCode, formatWeekDisplay, weekCodeToDateInput } from "../utils/weekUtil";

const SearchPanel = ({
  filters,
  departments,
  sections,
  categories,
  statuses,
  types,
  loading,
  onWeekChange,
  onDepartmentChange,
  onSectionChange,
  onCategoryChange,
  onStatusChange,
  onTypeChange,
  onSearch,
  onReset,
  gridLoading,
}) => {
  const handleDateChange = (e) => {
    const week = dateToWeekCode(e.target.value);
    onWeekChange(week);
  };

  const handleCategoryToggle = (code) => {
    const next = filters.categoryCodes.includes(code)
      ? filters.categoryCodes.filter((c) => c !== code)
      : [...filters.categoryCodes, code];
    onCategoryChange(next);
  };

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
        {/* 1번: 주차 달력 */}
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

        {/* 2번: 부서 셀렉트 */}
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

        {/* 3번: 팀 셀렉트 (전체 포함) */}
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

        {/* 4번: 카테고리 다중 선택 */}
        <div className="filter-item filter-item-wide">
          <label className="filter-label">4. 카테고리 (다중선택)</label>
          <select
            className="filter-select filter-multiselect"
            multiple
            value={filters.categoryCodes}
            onChange={(e) => {
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

        {/* 5번: 상태 라디오 */}
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

        {/* 6번: 유형 체크박스 */}
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
