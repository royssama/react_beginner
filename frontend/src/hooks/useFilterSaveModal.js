/**
 * 공통 조회조건 저장 모달 훅
 *
 * 저장 아이콘 클릭 시 containerRef DOM 을 스캔한다.
 * 화면별 fieldDefs / filters 매핑은 필요 없다.
 */
import { useCallback, useState } from "react";
import { scanFilterConditionsFromDom } from "../utils/filterSaveUtil";

/**
 * @param {React.RefObject<HTMLElement | null>} containerRef - 필터가 들어 있는 루트
 */
export const useFilterSaveModal = (containerRef) => {
  const [open, setOpen] = useState(false);
  const [conditions, setConditions] = useState([]);


  /** 저장 아이콘 클릭 — 그 시점 화면을 스캔 후 모달 오픈 */
  const openSaveModal = useCallback(() => {
    const scanned = scanFilterConditionsFromDom(containerRef?.current ?? null);
    setConditions(scanned);
    setOpen(true);
  }, [containerRef]);

  const closeSaveModal = useCallback(() => {
    setOpen(false);
  }, []);

  return {
    open,
    conditions,
    openSaveModal,
    closeSaveModal,
  };
};
