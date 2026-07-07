/**
 * useSearch - 조회 조건(필터) 상태 관리
 * 백엔드 API 없이 mockAuthData 목 옵션만 사용합니다.
 */
import { useState, useEffect, useCallback } from "react";
import {
  getMockDepartments,
  MOCK_SECTIONS,
  MOCK_CATEGORIES,
  MOCK_STATUSES,
  MOCK_TYPES,
} from "../data/mockAuthData";
import { getTodayWeekCode } from "../utils/weekUtil";

const createInitialFilters = () => ({
  week: getTodayWeekCode(),
  departmentCode: "",
  sectionCode: "",
  categoryCodes: [],
  statusCode: "",
  typeCodes: [],
});

export const useSearch = () => {
  const [filters, setFilters] = useState(createInitialFilters);
  const [departments, setDepartments] = useState([]);
  const [sections, setSections] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadDepartments = useCallback(async () => {
    const list = getMockDepartments();
    setDepartments(list);
    return list;
  }, []);

  const loadSections = useCallback(async () => {
    setSections(MOCK_SECTIONS);
    return MOCK_SECTIONS;
  }, []);

  const loadStaticOptions = useCallback(async () => {
    setCategories(MOCK_CATEGORIES);
    setStatuses(MOCK_STATUSES);
    setTypes(MOCK_TYPES);
    return { statuses: MOCK_STATUSES };
  }, []);

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

  const handleSectionChange = (sectionCode) => {
    setFilters((prev) => ({ ...prev, sectionCode }));
  };

  const handleCategoryChange = (categoryCodes) => {
    setFilters((prev) => ({ ...prev, categoryCodes }));
  };

  const handleStatusChange = (statusCode) => {
    setFilters((prev) => ({ ...prev, statusCode }));
  };

  const handleTypeChange = (typeCodes) => {
    setFilters((prev) => ({ ...prev, typeCodes }));
  };

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
