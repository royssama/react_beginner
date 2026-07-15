/**
 * B003 그리드 동작 옵션
 * - useOfflineFallback: 백엔드 미기동/API 실패 시 mock 목록 사용 여부
 * - alwaysExpandCookieKey: 항상 펼치기 설정 쿠키 키 (B002와 분리)
 */
export const B003_GRID_OPTIONS = {
  useOfflineFallback: true,
  alwaysExpandCookieKey: "b003_always_expand",
};
