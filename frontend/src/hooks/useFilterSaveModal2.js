/**
 * 조회조건 저장 모달 훅 (2안 - 등록소 기반)
 *
 * DOM을 읽지 않고, FilterCatch가 등록해 둔 type/namestr 을 그대로 가져온다.
 */
import { useCallback, useState } from "react";

/**
 * @param {{ getConditions: () => Array }} store - useFilterCatchStore() 결과
 */
export const useFilterSaveModal2 = (store) => {
  const [open, setOpen] = useState(false);
  const [conditions, setConditions] = useState([]);

  /** 저장2 아이콘 클릭 — 등록된 필터를 그 시점 값으로 읽어온다 */
  const openSaveModal = useCallback(() => {
    setConditions(store?.getConditions() ?? []);
    setOpen(true);
  }, [store]);

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
