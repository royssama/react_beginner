/**
 * useSearch - 조회 조건(필터) 상태 및 옵션 API 관리 커스텀 훅
 * 6개 필터의 값(filters)과 셀렉트/라디오/체크박스 옵션 목록을 관리합니다.
 * B001Page → SearchPanel로 state와 핸들러를 전달합니다.
 */
import { useState, useEffect, useCallback } from "react";
import {
  fetchGridDepartments,
  fetchGridSections,
  fetchGridCategories,
  fetchGridStatuses,
  fetchGridTypes,
} from "../api/B001Api";
import { getTodayWeekCode } from "../utils/weekUtil";

/** 화면 최초 로드 시 filters 기본값 생성 (이후 useEffect에서 API 결과로 덮어씀) */
const createInitialFilters = () => ({
  week: getTodayWeekCode(), // 1번: 주차 코드 (예: 202625)
  departmentCode: "", // 2번: 부서 코드
  sectionCode: "", // 3번: 팀 코드
  categoryCodes: [], // 4번: 카테고리 코드 배열 (다중선택)
  statusCode: "", // 5번: 상태 코드
  typeCodes: [], // 6번: 유형 코드 배열 (체크박스)
});

export const useSearch = () => {
  // ── 상태(state) ──
  const [filters, setFilters] = useState(createInitialFilters); // 사용자가 선택한 조회 조건
  const [departments, setDepartments] = useState([]); // 2번 필터 옵션
  const [sections, setSections] = useState([]); // 3번 필터 옵션
  const [categories, setCategories] = useState([]); // 4번 필터 옵션
  const [statuses, setStatuses] = useState([]); // 5번 필터 옵션
  const [types, setTypes] = useState([]); // 6번 필터 옵션
  const [loading, setLoading] = useState(false); // 필터 옵션 API 로딩 중 (입력/버튼 비활성화용)

  /** 2번 필터: 주차(week) 기준으로 부서 목록 API 조회 */
  const loadDepartments = useCallback(async (week) => {
    const res = await fetchGridDepartments({ week });
    const list = res?.data ?? [];
    setDepartments(list);
    return list; // 호출한 쪽에서 첫 번째 항목 자동선택에 사용
  }, []);

  /** 3번 필터: 주차 + 부서코드 기준으로 팀 목록 API 조회 (첫 항목 "전체" 포함) */
  const loadSections = useCallback(async (week, departmentCode) => {
    if (!week || !departmentCode) {
      setSections([]);
      return [];
    }
    const res = await fetchGridSections({ week, departmentCode });
    const list = res?.data ?? [];
    setSections(list);
    return list;
  }, []);

  /** 4·5·6번 필터: 카테고리/상태/유형 옵션을 Promise.all로 동시 조회 */
  const loadStaticOptions = useCallback(async () => {
    const [categoryRes, statusRes, typeRes] = await Promise.all([
      fetchGridCategories(),
      fetchGridStatuses(),
      fetchGridTypes(),
    ]);
    setCategories(categoryRes?.data ?? []);
    setStatuses(statusRes?.data ?? []);
    setTypes(typeRes?.data ?? []);
    return {
      statuses: statusRes?.data ?? [], // resetFilters에서 statusCode 자동선택에 사용
    };
  }, []);

  /**
   * 화면 최초 마운트 시 1회 실행
   * 오늘 주차 + 각 필터 옵션 API 조회 후 첫 번째 항목 자동 선택
   */
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const week = getTodayWeekCode();
        const deptList = await loadDepartments(week);
        const firstDept = deptList[0]?.code ?? "";
        const sectionList = firstDept ? await loadSections(week, firstDept) : [];
        const { statuses: statusList } = await loadStaticOptions();

        setFilters({
          week,
          departmentCode: firstDept,
          sectionCode: sectionList[0]?.code ?? "", // 보통 "ALL"(전체)
          categoryCodes: [],
          statusCode: statusList[0]?.code ?? "",
          typeCodes: [],
        });
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [loadDepartments, loadSections, loadStaticOptions]);

  /** 1번 필터 변경: 주차 바뀌면 부서·팀 목록을 다시 조회하고 첫 항목 자동 선택 */
  const handleWeekChange = async (week) => {
    setLoading(true);
    try {
      const deptList = await loadDepartments(week);
      const firstDept = deptList[0]?.code ?? "";
      const sectionList = firstDept ? await loadSections(week, firstDept) : [];

      setFilters((prev) => ({
        ...prev, // 카테고리·상태·유형 등 나머지 필터는 유지
        week,
        departmentCode: firstDept,
        sectionCode: sectionList[0]?.code ?? "",
      }));
    } finally {
      setLoading(false);
    }
  };

  /** 2번 필터 변경: 부서 바뀌면 팀 목록을 다시 조회하고 첫 항목(전체) 자동 선택 */
  const handleDepartmentChange = async (departmentCode) => {
    setLoading(true);
    try {
      const sectionList = await loadSections(filters.week, departmentCode);
      setFilters((prev) => ({
        ...prev,
        departmentCode,
        sectionCode: sectionList[0]?.code ?? "",
      }));
    } finally {
      setLoading(false);
    }
  };

  /** 3번 필터 변경: 팀 코드만 filters에 반영 (API 재조회 없음) */
  const handleSectionChange = (sectionCode) => {
    setFilters((prev) => ({ ...prev, sectionCode }));
  };

  /** 4번 필터 변경: 선택된 카테고리 코드 배열을 filters에 반영 */
  const handleCategoryChange = (categoryCodes) => {
    setFilters((prev) => ({ ...prev, categoryCodes }));
  };

  /** 5번 필터 변경: 상태 라디오 선택 코드를 filters에 반영 */
  const handleStatusChange = (statusCode) => {
    setFilters((prev) => ({ ...prev, statusCode }));
  };

  /** 6번 필터 변경: 선택된 유형 코드 배열을 filters에 반영 */
  const handleTypeChange = (typeCodes) => {
    setFilters((prev) => ({ ...prev, typeCodes }));
  };

  /**
   * 리셋: 화면 최초 로드와 동일하게 조회 조건을 되돌림
   * async 함수 → B001Page에서 await resetFilters()로 완료까지 대기
   */
  const resetFilters = async () => {
    setLoading(true);
    try {
      const week = getTodayWeekCode();
      const deptList = await loadDepartments(week);
      const firstDept = deptList[0]?.code ?? "";
      const sectionList = firstDept ? await loadSections(week, firstDept) : [];
      const { statuses: statusList } = await loadStaticOptions();

      setFilters({
        week,
        departmentCode: firstDept,
        sectionCode: sectionList[0]?.code ?? "",
        categoryCodes: [],
        statusCode: statusList[0]?.code ?? "",
        typeCodes: [],
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * 조회 버튼 클릭 시 useGrid.search()에 넘길 API 파라미터 생성
   * 배열 필터는 서버가 받는 CSV 문자열로 변환 (예: "C01,C02")
   */
  const getSearchParams = () => ({
    week: filters.week,
    departmentCode: filters.departmentCode,
    sectionCode: filters.sectionCode,
    categoryCodes: filters.categoryCodes.join(","),
    statusCode: filters.statusCode,
    typeCodes: filters.typeCodes.join(","),
  });

  return {
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
  };
};
