/**
 * DB 플랫 행 → 그리드 행 (사번+권한이름 단위, details 배열 포함)
 * @param {Array} rows - API 조회 결과 플랫 행 배열
 */
export const buildAuthGridRows = (rows) => {
  if (!rows?.length) return [];

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
        parentDetailId: row.detailId,
        details: [],
      });
    }
    grouped.get(id).details.push({
      detailId: row.detailId,
      detailNm: row.detailNm,
      detailAuth: row.detailAuth,
      detailUseYn: row.detailUseYn,
    });
  });

  return Array.from(grouped.values());
};
