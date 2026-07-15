/**
 * B003 API — 현재는 B002와 동일 엔드포인트 재사용
 * 다른 예제용으로 분리 시 이 파일만 수정하면 됩니다.
 */
export {
  fetchB002Departments as fetchB003Departments,
  fetchB002DetailAuthOptions as fetchB003DetailAuthOptions,
  fetchB002DetailList as fetchB003DetailList,
  fetchB002GridData as fetchB003GridData,
  syncB002RowDetails as syncB003RowDetails,
  saveB002DetailChanges as saveB003DetailChanges,
} from "./B002Api";
