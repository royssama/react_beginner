import { useEffect, useMemo, useState } from "react";
import { fetchB002DetailList } from "../api/B002Api";

/** DETAIL_AUTH 기준 체크 키 생성 */
const detailKey = (detailAuth) => detailAuth ?? "";

/** 세부권한 선택 모달 — DETAIL_LIST 체크박스 목록 */
const DetailSelectModal = ({ open, row, saving, onClose, onConfirm }) => {
  const [detailList, setDetailList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkedKeys, setCheckedKeys] = useState(() => new Set());

  /** 모달 오픈 시 DETAIL_LIST(t3) 목록 API 조회 */
  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchB002DetailList();
        if (!cancelled) {
          setDetailList(res?.data ?? []);
        }
      } catch (e) {
        console.warn("DETAIL_LIST 조회 실패", e);
        if (!cancelled) {
          setDetailList([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [open]);

  /** 모달 오픈 시 현재 row의 t2 DETAIL_AUTH 기준 체크 상태 초기화 */
  useEffect(() => {
    if (!open || !row) return;

    const keys = new Set();
    (row.details ?? []).forEach((detail) => {
      const auth = detail.detailAuth;
      if (!auth) return;
      keys.add(detailKey(auth));
    });

    setCheckedKeys(keys);
  }, [open, row]);

  /** DETAIL_AUTH 정렬된 목록 */
  const sortedList = useMemo(
    () =>
      [...detailList].sort((a, b) =>
        (a.detailAuth ?? "").localeCompare(b.detailAuth ?? "", "ko")
      ),
    [detailList]
  );

  /** 체크박스 토글 — DETAIL_AUTH 기준 */
  const toggleItem = (item) => {
    const key = detailKey(item.detailAuth);
    setCheckedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  /** 확인 — 체크된 항목을 부모 onConfirm으로 전달 */
  const handleConfirm = () => {
    const selectedDetails = sortedList.filter((item) =>
      checkedKeys.has(detailKey(item.detailAuth))
    );
    onConfirm?.(row, selectedDetails);
  };

  if (!open || !row) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content detail-select-modal"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 className="modal-title">세부권한 선택</h3>
          <p className="modal-subtitle">
            {row.name} ({row.empNo}) · {row.authName}
          </p>
        </div>

        <div className="modal-body">
          {loading && <p className="modal-loading">목록을 불러오는 중...</p>}
          {!loading && sortedList.length === 0 && (
            <p className="modal-empty">DETAIL_LIST에 등록된 항목이 없습니다.</p>
          )}
          {!loading && sortedList.length > 0 && (
            <ul className="detail-check-list">
              {sortedList.map((item) => {
                const key = detailKey(item.detailAuth);
                const checked = checkedKeys.has(key);
                return (
                  <li key={key}>
                    <label className="detail-check-item">
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={saving}
                        onChange={() => toggleItem(item)}
                      />
                      <span className="detail-check-auth">{item.detailAuth}</span>
                      <span className="detail-check-nm">{item.detailNm}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={saving}
          >
            취소
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleConfirm}
            disabled={saving || loading}
          >
            {saving ? "저장 중..." : "확인"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailSelectModal;
