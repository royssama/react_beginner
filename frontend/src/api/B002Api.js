import axiosUtil from "../utils/axiosUtil";
import { buildAuthGridRows } from "../utils/authGridUtil";
import { B002_GRID_OPTIONS } from "../config/b002GridOptions";
import {
  MOCK_B002_DEPARTMENTS,
  MOCK_B002_DETAIL_LIST,
  MOCK_B002_FLAT_ROWS,
} from "../data/b002MockData";

const warnOffline = (apiName, err) => {
  console.warn(`[B002] ${apiName} 실패 → mock 데이터 사용`, err?.message ?? err);
};

/**
 * B002 부서 옵션 (Oracle TB_B002_AUTH_EXCEL)
 */
export const fetchB002Departments = async () => {
  try {
    return await axiosUtil.get("api/b002/options/departments", {}, {});
  } catch (err) {
    if (!B002_GRID_OPTIONS.useOfflineFallback) throw err;
    warnOffline("departments", err);
    return { success: true, data: MOCK_B002_DEPARTMENTS, offline: true };
  }
};

/**
 * B002 세부권한 셀렉트 옵션 (Oracle TB_B002_AUTH_EXCEL_DETAIL)
 */
export const fetchB002DetailAuthOptions = async () => {
  try {
    return await axiosUtil.get("api/b002/options/detail-auths", {}, {});
  } catch (err) {
    if (!B002_GRID_OPTIONS.useOfflineFallback) throw err;
    warnOffline("detail-auths", err);
    return {
      success: true,
      data: MOCK_B002_DETAIL_LIST.map((item) => ({
        code: item.detailAuth,
        name: item.detailAuth,
      })),
      offline: true,
    };
  }
};

/**
 * B002 세부권한 선택 모달 목록 (Oracle DETAIL_LIST)
 */
export const fetchB002DetailList = async () => {
  try {
    return await axiosUtil.get("api/b002/options/detail-list", {}, {});
  } catch (err) {
    if (!B002_GRID_OPTIONS.useOfflineFallback) throw err;
    warnOffline("detail-list", err);
    return { success: true, data: MOCK_B002_DETAIL_LIST, offline: true };
  }
};

/**
 * B002 그리드 조회 — DB 플랫 행 조회 후 buildAuthGridRows로 그룹핑
 * params.departmentCode = 부서명 (예: 개발, 계획)
 */
export const fetchB002GridData = async (params) => {
  try {
    const searchData = {
      departmentCode: params?.departmentCode || "",
    };
    const response = await axiosUtil.get("api/b002/search", searchData, {});
    const flatRows = response?.data ?? [];
    const rows = buildAuthGridRows(flatRows);

    return {
      ...response,
      data: rows,
      totalCount: rows.length,
    };
  } catch (err) {
    if (!B002_GRID_OPTIONS.useOfflineFallback) throw err;
    warnOffline("search", err);

    const dept = params?.departmentCode || "";
    const flatRows = dept
      ? MOCK_B002_FLAT_ROWS.filter((row) => row.dept === dept)
      : MOCK_B002_FLAT_ROWS;
    const rows = buildAuthGridRows(flatRows);

    return {
      success: true,
      data: rows,
      totalCount: rows.length,
      offline: true,
    };
  }
};

/**
 * B002 그리드 행 세부권한 동기화 (체크 추가/해제 → DB INSERT/DELETE)
 * 오프라인 시에는 선택된 항목을 그대로 반환해 화면만 갱신
 */
export const syncB002RowDetails = async (payload) => {
  try {
    return await axiosUtil.post("api/b002/details/sync", payload, {});
  } catch (err) {
    if (!B002_GRID_OPTIONS.useOfflineFallback) throw err;
    warnOffline("details/sync", err);

    const parentDetailId = payload?.parentDetailId ?? "";
    const details = (payload?.selectedDetails ?? []).map((item) => ({
      detailId: parentDetailId,
      detailNm: item.detailNm ?? item.detailAuth ?? "",
      detailAuth: item.detailAuth ?? "",
      detailUseYn: "Y",
    }));

    return { success: true, data: details, offline: true };
  }
};

/**
 * B002 세부권한 저장 (추후 DB UPDATE 연동)
 */
export const saveB002DetailChanges = async (changes) => {
  const payload = {
    success: true,
    changedCount: changes.length,
    data: changes,
  };

  console.log("[B002 API] POST /api/b002/details/save", payload);
  await new Promise((resolve) => setTimeout(resolve, 300));
  return payload;
};
