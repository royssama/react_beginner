/**
 * api/grid/search 응답의 data 배열을 그리드 컬럼 구조로 변환
 * - 신규 API: company, industry, partner, manager, location, aa2022~bb2024
 * - 구 API(백엔드 미재시작): company/location만 있어도 나머지 컬럼 보완
 */
const COMPANY_META = {
  "aa회사": { industry: "제조업", partner: "(주)한국부품", manager: "김영업" },
  "bb회사": { industry: "유통업", partner: "(주)글로벌파트", manager: "이마케" },
  "cc회사": { industry: "IT서비스", partner: "(주)테크협력", manager: "박개발" },
  "dd회사": { industry: "제조업", partner: "(주)정밀기계", manager: "최생산" },
  "ee회사": { industry: "건설업", partner: "(주)토건협력", manager: "정현장" },
};

export const mapGridSearchRows = (rows) => {
  if (!Array.isArray(rows)) return [];

  return rows.map((row, index) => {
    const company = row.company ?? row.departmentName ?? "";
    const meta = COMPANY_META[company] ?? {};

    return {
      id: row.id ?? String(index + 1),
      week: row.week ?? "",
      company,
      industry: row.industry ?? meta.industry ?? "",
      partner: row.partner ?? meta.partner ?? "",
      manager: row.manager ?? meta.manager ?? "",
      location: row.location ?? row.sectionName ?? "",
      aa2022: row.aa2022 != null ? row.aa2022 : 0,
      aa2023: row.aa2023 != null ? row.aa2023 : 0,
      aa2024: row.aa2024 != null ? row.aa2024 : 0,
      bb2022: row.bb2022 != null ? row.bb2022 : 0,
      bb2023: row.bb2023 != null ? row.bb2023 : 0,
      bb2024: row.bb2024 != null ? row.bb2024 : 0,
    };
  });
};
