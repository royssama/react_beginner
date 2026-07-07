/**
 * 엑셀 권한 목 데이터 (백엔드 없이 프론트만으로 동작)
 */
export const MOCK_AUTH_EXCEL_ROWS = [
  { name: "박희용", empNo: "X0001", dept: "개발", authName: "수요", authGrant: "Y", useYn: "Y", detailAuth: "수요예측", detailUseYn: "Y" },
  { name: "박희용", empNo: "X0001", dept: "개발", authName: "수요", authGrant: "Y", useYn: "Y", detailAuth: "수요평가", detailUseYn: "Y" },
  { name: "박희용", empNo: "X0001", dept: "개발", authName: "수요", authGrant: "Y", useYn: "Y", detailAuth: "수요통계", detailUseYn: "Y" },
  { name: "박희용", empNo: "X0001", dept: "개발", authName: "수요", authGrant: "Y", useYn: "Y", detailAuth: "수요수행", detailUseYn: "Y" },
  { name: "박희용", empNo: "X0001", dept: "개발", authName: "수요", authGrant: "Y", useYn: "Y", detailAuth: "수요이력", detailUseYn: "Y" },
  { name: "박희용", empNo: "X0001", dept: "개발", authName: "생산", authGrant: "Y", useYn: "Y", detailAuth: "생산예측", detailUseYn: "Y" },
  { name: "박희용", empNo: "X0001", dept: "개발", authName: "생산", authGrant: "Y", useYn: "Y", detailAuth: "생산평가", detailUseYn: "Y" },
  { name: "박희용", empNo: "X0001", dept: "개발", authName: "생산", authGrant: "Y", useYn: "Y", detailAuth: "생산통계", detailUseYn: "Y" },
  { name: "김기준", empNo: "X0002", dept: "개발", authName: "공급", authGrant: "Y", useYn: "Y", detailAuth: "공급통계", detailUseYn: "Y" },
  { name: "김기준", empNo: "X0002", dept: "개발", authName: "공급", authGrant: "Y", useYn: "Y", detailAuth: "공급수행", detailUseYn: "Y" },
  { name: "김기준", empNo: "X0002", dept: "개발", authName: "공급", authGrant: "Y", useYn: "Y", detailAuth: "공급이력", detailUseYn: "Y" },
  { name: "김기준", empNo: "X0002", dept: "개발", authName: "예측", authGrant: "Y", useYn: "Y", detailAuth: "예측실행", detailUseYn: "Y" },
  { name: "김기준", empNo: "X0002", dept: "개발", authName: "예측", authGrant: "Y", useYn: "Y", detailAuth: "예측평가", detailUseYn: "Y" },
  { name: "김기준", empNo: "X0002", dept: "개발", authName: "예측", authGrant: "Y", useYn: "Y", detailAuth: "예측통계", detailUseYn: "Y" },
  { name: "구본기", empNo: "X0003", dept: "계획", authName: "기획", authGrant: "Y", useYn: "Y", detailAuth: "기획통계", detailUseYn: "Y" },
  { name: "구본기", empNo: "X0003", dept: "계획", authName: "기획", authGrant: "Y", useYn: "Y", detailAuth: "기획수행", detailUseYn: "Y" },
  { name: "구본기", empNo: "X0003", dept: "계획", authName: "기획", authGrant: "Y", useYn: "Y", detailAuth: "기획이력", detailUseYn: "Y" },
  { name: "김재남", empNo: "X0004", dept: "생산", authName: "실행", authGrant: "Y", useYn: "Y", detailAuth: "실행통계", detailUseYn: "Y" },
  { name: "김재남", empNo: "X0004", dept: "생산", authName: "실행", authGrant: "Y", useYn: "Y", detailAuth: "실행수행", detailUseYn: "Y" },
  { name: "김재남", empNo: "X0004", dept: "생산", authName: "실행", authGrant: "Y", useYn: "Y", detailAuth: "실행이력", detailUseYn: "Y" },
  { name: "정덕희", empNo: "X0005", dept: "조달", authName: "배송", authGrant: "Y", useYn: "Y", detailAuth: "배송통계", detailUseYn: "Y" },
  { name: "정덕희", empNo: "X0005", dept: "조달", authName: "배송", authGrant: "Y", useYn: "Y", detailAuth: "배송수행", detailUseYn: "Y" },
  { name: "정덕희", empNo: "X0005", dept: "조달", authName: "배송", authGrant: "Y", useYn: "Y", detailAuth: "배송이력", detailUseYn: "Y" },
];

/** 엑셀 행 → 그리드 행 (사번+권한이름 단위, details 배열 포함) */
export const buildAuthGridRows = (rows = MOCK_AUTH_EXCEL_ROWS) => {
  const grouped = new Map();

  rows.forEach((row) => {
    const id = `${row.empNo}-${row.authName}`;
    if (!grouped.has(id)) {
      grouped.set(id, {
        id,
        name: row.name,
        empNo: row.empNo,
        dept: row.dept,
        authName: row.authName,
        authGrant: row.authGrant,
        useYn: row.useYn,
        details: [],
      });
    }
    grouped.get(id).details.push({
      detailId: `${id}-${row.detailAuth}`,
      detailAuth: row.detailAuth,
      detailUseYn: row.detailUseYn,
    });
  });

  return Array.from(grouped.values());
};

/** 조회조건 필터용 — 엑셀 데이터에서 부서 목록 추출 */
export const getMockDepartments = () => {
  const depts = [...new Set(MOCK_AUTH_EXCEL_ROWS.map((row) => row.dept))];
  return depts.map((dept) => ({ code: dept, name: dept }));
};

export const MOCK_SECTIONS = [{ code: "ALL", name: "전체" }];

export const MOCK_CATEGORIES = [
  { code: "C01", name: "일반" },
  { code: "C02", name: "긴급" },
];

export const MOCK_STATUSES = [
  { code: "Y", name: "사용" },
  { code: "N", name: "미사용" },
];

export const MOCK_TYPES = [
  { code: "T01", name: "유형A" },
  { code: "T02", name: "유형B" },
];

/** 세부권한정보 셀렉트 옵션 */
export const getDetailAuthOptions = () => {
  const auths = [...new Set(MOCK_AUTH_EXCEL_ROWS.map((row) => row.detailAuth))];
  return auths.map((auth) => ({ code: auth, name: auth }));
};
