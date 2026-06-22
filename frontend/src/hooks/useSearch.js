import { useState, useEffect, useCallback } from "react";
import {
  fetchGridDepartments,
  fetchGridSections,
  fetchGridCategories,
  fetchGridStatuses,
  fetchGridTypes,
} from "../api/B001Api";
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

  const loadDepartments = useCallback(async (week) => {
    const res = await fetchGridDepartments({ week });
    const list = res?.data ?? [];
    setDepartments(list);
    return list;
  }, []);

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
      statuses: statusRes?.data ?? [],
    };
  }, []);

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
      const deptList = await loadDepartments(week);
      const firstDept = deptList[0]?.code ?? "";
      const sectionList = firstDept ? await loadSections(week, firstDept) : [];

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
