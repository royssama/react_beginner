/**
 * B002 저장 API (목 서버 — 실제 백엔드 없음)
 */
export const saveB002DetailChanges = async (changes) => {
  const payload = {
    success: true,
    changedCount: changes.length,
    data: changes,
  };

  console.log("[B002 API] POST /api/b002/details/save", payload);

  // 네트워크 지연 시뮬레이션
  await new Promise((resolve) => setTimeout(resolve, 300));

  return payload;
};
