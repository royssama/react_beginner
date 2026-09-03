/**
 * 필터 등록소(registry)
 *
 * 화면의 각 필터가 마운트될 때 { key, label, type, value, namestr } 를 등록한다.
 * 저장 아이콘 클릭 시 등록된 것만 읽으므로 DOM 접근이 필요 없다.
 */
import { createContext, useContext, useMemo, useRef } from "react";

export const FilterCatchContext = createContext(null);

/**
 * Provider에 넣을 저장소 생성 (SearchPanel 등 필터 루트에서 1회 호출)
 * 값 자체는 ref로 들고 있어 리렌더를 유발하지 않는다.
 */
export const useFilterCatchStore = () => {
  const entriesRef = useRef(new Map());

  return useMemo(
    () => ({
      /** 필터 1개 등록 (entryRef.current 로 항상 최신값 조회) */
      register: (key, entryRef) => {
        entriesRef.current.set(key, entryRef);
      },
      /** 언마운트 시 해제 */
      unregister: (key) => {
        entriesRef.current.delete(key);
      },
      /** 등록 순서대로 현재 조건 목록 반환 */
      getConditions: () =>
        Array.from(entriesRef.current.values()).map((entryRef) => {
          const entry = entryRef.current;
          const rawCode = entry.value; // 저장/복원용 원본 코드
          return {
            key: entry.key,
            label: entry.label,
            type: entry.type,
            code: Array.isArray(rawCode) ? rawCode.join(", ") : rawCode ?? "",
            value: entry.namestr, // 화면 표시용 이름
          };
        }),
    }),
    []
  );
};

/** 필터 컴포넌트에서 저장소 접근 */
export const useFilterCatch = () => useContext(FilterCatchContext);
