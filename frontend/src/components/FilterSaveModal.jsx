/**
 * 공통 조회 조건 저장 모달 — 스캔 결과(라벨/값) 미리보기
 * conditions 를 어디서 모았는지(DOM/등록소)는 모달이 알 필요 없다.
 */
const FilterSaveModal = ({
  open,
  conditions = [],
  title = "조회 조건 저장",
  subtitle = "현재 입력·선택된 조건을 확인합니다.",
  onClose,
}) => {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content filter-save-modal"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <p className="modal-subtitle">{subtitle}</p>
        </div>

        <div className="modal-body">
          {conditions.length === 0 ? (
            <p className="modal-empty">스캔된 조건이 없습니다.</p>
          ) : (
            <ul className="filter-preview-list">
              {conditions.map((item) => (
                <li key={item.key} className="filter-preview-item">
                  <span className="filter-preview-label">
                    {item.label}
                    {item.type && <em className="filter-preview-type">{item.type}</em>}
                  </span>
                  <span className="filter-preview-value">
                    {item.value}
                    {item.code ? (
                      <em className="filter-preview-code">코드: {item.code}</em>
                    ) : null}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterSaveModal;
