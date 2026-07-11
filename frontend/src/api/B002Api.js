import axiosUtil from "../utils/axiosUtil";
import { buildAuthGridRows } from "../utils/authGridUtil";

/**
 * B002 부서 옵션 (Oracle TB_B002_AUTH_EXCEL)
 */
export const fetchB002Departments = async () => {
  const response = await axiosUtil.get("api/b002/options/departments", {}, {});
  return response;
};

/**
 * B002 세부권한 셀렉트 옵션 (Oracle TB_B002_AUTH_EXCEL_DETAIL)
 */
export const fetchB002DetailAuthOptions = async () => {
  const response = await axiosUtil.get("api/b002/options/detail-auths", {}, {});
  return response;
};

/**
 * B002 세부권한 선택 모달 목록 (Oracle DETAIL_LIST)
 */
export const fetchB002DetailList = async () => {
  const response = await axiosUtil.get("api/b002/options/detail-list", {}, {});
  return response;
};

/**
 * B002 그리드 조회 — DB 플랫 행 조회 후 buildAuthGridRows로 그룹핑
 * params.departmentCode = 부서명 (예: 개발, 계획)
 */
export const fetchB002GridData = async (params) => {
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
};

/**
 * B002 그리드 행 세부권한 동기화 (체크 추가/해제 → DB INSERT/DELETE)
 */
export const syncB002RowDetails = async (payload) => {
  const response = await axiosUtil.post("api/b002/details/sync", payload, {});
  return response;
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
