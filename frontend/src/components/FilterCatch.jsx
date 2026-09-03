/**
 * FilterCatch - 필터 1칸 래퍼
 *
 * type / value / options 를 JSX에서 받아 namestr(표시 이름)을 만들고
 * 등록소에 스스로 등록한다. (조회 조건 저장2 방식)
 *
 * 기존 DOM 스캔(조회 조건 저장1)도 계속 쓸 수 있도록
 * data-filter-catch / data-filter-key 마크업은 그대로 유지한다.
 */
import { useEffect, useRef } from "react";
import { useFilterCatch } from "../contexts/FilterCatchContext";
import { resolveNameStr } from "../utils/filterValueUtil";

const FilterCatch = ({
  filterKey, // filters 객체의 키 (예: sectionCode)
  label, // 모달에 표시할 이름 (예: 팀)
  type, // week | select | multiselect | radio | checkbox | text
  value, // 현재 코드 값
  options = [], // 코드→이름 변환용 옵션 목록
  namestr, // 직접 지정하고 싶을 때 (없으면 type으로 계산)
  className = "",
  children,
}) => {
  const store = useFilterCatch();
  const display = namestr ?? resolveNameStr(type, value, options);

  // 최신 값을 ref에 담아두고, 등록은 마운트 시 1회만 한다
  const entryRef = useRef(null);
  entryRef.current = { key: filterKey, label, type, value, namestr: display };

  useEffect(() => {
    if (!store) return undefined;
    store.register(filterKey, entryRef);
    return () => store.unregister(filterKey);
  }, [store, filterKey]);

  return (
    <div
      className={`filter-item ${className}`.trim()}
      data-filter-catch="on"
      data-filter-key={filterKey}
    >
      {children}
    </div>
  );
};

export default FilterCatch;
