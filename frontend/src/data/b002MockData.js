/**
 * B002 오프라인용 mock 데이터
 * 백엔드 서버가 꺼져 있거나 API 실패 시 사용
 */

/** 부서 옵션 */
export const MOCK_B002_DEPARTMENTS = [
  { code: "개발", name: "개발" },
  { code: "계획", name: "계획" },
  { code: "생산", name: "생산" },
  { code: "조달", name: "조달" },
];

/** DETAIL_LIST(t3) — 팝업 체크 목록 */
export const MOCK_B002_DETAIL_LIST = [
  { detailAuth: "수요예측", detailNm: "수요예측" },
  { detailAuth: "수요평가", detailNm: "수요평가" },
  { detailAuth: "수요통계", detailNm: "수요통계" },
  { detailAuth: "수요수행", detailNm: "수요수행" },
  { detailAuth: "수요이력", detailNm: "수요이력" },
  { detailAuth: "생산예측", detailNm: "생산예측" },
  { detailAuth: "생산평가", detailNm: "생산평가" },
  { detailAuth: "생산통계", detailNm: "생산통계" },
  { detailAuth: "공급통계", detailNm: "공급통계" },
  { detailAuth: "공급수행", detailNm: "공급수행" },
  { detailAuth: "공급이력", detailNm: "공급이력" },
  { detailAuth: "예측실행", detailNm: "예측실행" },
  { detailAuth: "예측평가", detailNm: "예측평가" },
  { detailAuth: "예측통계", detailNm: "예측통계" },
  { detailAuth: "기획통계", detailNm: "기획통계" },
  { detailAuth: "기획수행", detailNm: "기획수행" },
  { detailAuth: "기획이력", detailNm: "기획이력" },
  { detailAuth: "실행통계", detailNm: "실행통계" },
  { detailAuth: "실행수행", detailNm: "실행수행" },
  { detailAuth: "실행이력", detailNm: "실행이력" },
  { detailAuth: "배송통계", detailNm: "배송통계" },
  { detailAuth: "배송수행", detailNm: "배송수행" },
  { detailAuth: "배송이력", detailNm: "배송이력" },
];

/**
 * 그리드 조회용 플랫 행 (t1+t2 JOIN 형태)
 * buildAuthGridRows()로 그룹핑됨
 */
export const MOCK_B002_FLAT_ROWS = [
  { name: "박희용", empNo: "X0001", dept: "개발", authName: "수요", authGrant: "Y", useYn: "Y", detailId: "01", detailNm: "수요예측", detailAuth: "수요예측", detailUseYn: "Y" },
  { name: "박희용", empNo: "X0001", dept: "개발", authName: "수요", authGrant: "Y", useYn: "Y", detailId: "01", detailNm: "수요평가", detailAuth: "수요평가", detailUseYn: "Y" },
  { name: "박희용", empNo: "X0001", dept: "개발", authName: "수요", authGrant: "Y", useYn: "Y", detailId: "01", detailNm: "수요통계", detailAuth: "수요통계", detailUseYn: "Y" },
  { name: "박희용", empNo: "X0001", dept: "개발", authName: "생산", authGrant: "Y", useYn: "Y", detailId: "02", detailNm: "생산예측", detailAuth: "생산예측", detailUseYn: "Y" },
  { name: "박희용", empNo: "X0001", dept: "개발", authName: "생산", authGrant: "Y", useYn: "Y", detailId: "02", detailNm: "생산평가", detailAuth: "생산평가", detailUseYn: "Y" },
  { name: "김기준", empNo: "X0002", dept: "개발", authName: "공급", authGrant: "Y", useYn: "Y", detailId: "03", detailNm: "공급통계", detailAuth: "공급통계", detailUseYn: "Y" },
  { name: "김기준", empNo: "X0002", dept: "개발", authName: "공급", authGrant: "Y", useYn: "Y", detailId: "03", detailNm: "공급수행", detailAuth: "공급수행", detailUseYn: "Y" },
  { name: "김기준", empNo: "X0002", dept: "개발", authName: "예측", authGrant: "Y", useYn: "Y", detailId: "04", detailNm: "예측실행", detailAuth: "예측실행", detailUseYn: "Y" },
  { name: "구본기", empNo: "X0003", dept: "계획", authName: "기획", authGrant: "Y", useYn: "Y", detailId: "05", detailNm: "기획통계", detailAuth: "기획통계", detailUseYn: "Y" },
  { name: "구본기", empNo: "X0003", dept: "계획", authName: "기획", authGrant: "Y", useYn: "Y", detailId: "05", detailNm: "기획수행", detailAuth: "기획수행", detailUseYn: "Y" },
  { name: "김재남", empNo: "X0004", dept: "생산", authName: "실행", authGrant: "Y", useYn: "Y", detailId: "06", detailNm: "실행통계", detailAuth: "실행통계", detailUseYn: "Y" },
  { name: "정덕희", empNo: "X0005", dept: "조달", authName: "배송", authGrant: "Y", useYn: "Y", detailId: "07", detailNm: "배송통계", detailAuth: "배송통계", detailUseYn: "Y" },
  { name: "정덕희", empNo: "X0005", dept: "조달", authName: "배송", authGrant: "Y", useYn: "Y", detailId: "07", detailNm: "배송수행", detailAuth: "배송수행", detailUseYn: "Y" },
];
