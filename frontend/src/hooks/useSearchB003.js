/**
 * B003 전용 조회 조건 훅 — 부서 목록은 Oracle API에서 로드
 */
import { useState, useEffect, useCallback } from "react";
import { fetchB003Departments } from "../api/B003Api";
import { getTodayWeekCode } from "../utils/weekUtil";

const B003_SECTIONS = [{ code: "ALL", name: "전체" }];
const B003_CATEGORIES = [
  { code: "C01", name: "일반" },
  { code: "C02", name: "긴급" },
];
const B003_STATUSES = [
  { code: "Y", name: "사용" },
  { code: "N", name: "미사용" },
];
const B003_TYPES = [
  { code: "T01", name: "유형A" },
  { code: "T02", name: "유형B" },
];

/** B003 검색 조건 초기값 생성 */
const createInitialFilters = () => ({
  week: getTodayWeekCode(),
  departmentCode: "",
  sectionCode: "",
  categoryCodes: [],
  statusCode: "",
  typeCodes: [],
});

export const useSearchB003 = () => {
  const [filters, setFilters] = useState(createInitialFilters);
  const [departments, setDepartments] = useState([]);
  const [sections, setSections] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  /** 부서 목록 API 조회 (Oracle B003용 부서 API) */
  const loadDepartments = useCallback(async () => {
    const res = await fetchB003Departments();
    const list = res?.data ?? [];
    setDepartments(list);
    return list;
  }, []);

  /** 섹션 옵션 로드 */
  const loadSections = useCallback(async () => {
    setSections(B003_SECTIONS);
    return B003_SECTIONS;
  }, []);

  /** 카테고리·상태·유형 정적 옵션 로드 */
  const loadStaticOptions = useCallback(async () => {
    setCategories(B003_CATEGORIES);
    setStatuses(B003_STATUSES);
    setTypes(B003_TYPES);
    return { statuses: B003_STATUSES };
  }, []);

  /** 마운트 시 부서·옵션 초기화 및 기본 검색 조건 설정 */
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const week = getTodayWeekCode();
        const deptList = await loadDepartments();
        const firstDept = deptList[0]?.code ?? "";
        const sectionList = await loadSections();
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
    init();
  }, [loadDepartments, loadSections, loadStaticOptions]);

  /** 주차 변경 — 부서·섹션 재설정 */
  const handleWeekChange = async (week) => {
    setLoading(true);
    try {
      const deptList = await loadDepartments();
      const firstDept = deptList[0]?.code ?? "";
      const sectionList = await loadSections();
      setFilters((prev) => ({
        ...prev,
        week,
        departmentCode: firstDept,
        sectionCode: sectionList[0]?.code ?? "",
      }));
    } finally {
      setLoading(false);
    }
  };

  /** 부서 변경 — 섹션 재설정 */
  const handleDepartmentChange = async (departmentCode) => {
    setLoading(true);
    try {
      const sectionList = await loadSections();
      setFilters((prev) => ({
        ...prev,
        departmentCode,
        sectionCode: sectionList[0]?.code ?? "",
      }));
    } finally {
      setLoading(false);
    }
  };

  /** 섹션 변경 */
  const handleSectionChange = (sectionCode) => {
    setFilters((prev) => ({ ...prev, sectionCode }));
  };

  /** 카테고리(복수) 변경 */
  const handleCategoryChange = (categoryCodes) => {
    setFilters((prev) => ({ ...prev, categoryCodes }));
  };

  /** 사용여부 변경 */
  const handleStatusChange = (statusCode) => {
    setFilters((prev) => ({ ...prev, statusCode }));
  };

  /** 유형(복수) 변경 */
  const handleTypeChange = (typeCodes) => {
    setFilters((prev) => ({ ...prev, typeCodes }));
  };

  /** 검색 조건 초기화 */
  const resetFilters = async () => {
    setLoading(true);
    try {
      const week = getTodayWeekCode();
      const deptList = await loadDepartments();
      const firstDept = deptList[0]?.code ?? "";
      const sectionList = await loadSections();
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

  /** API 조회용 검색 파라미터 객체 반환 */
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
