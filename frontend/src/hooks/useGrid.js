/**
 * useGrid - AG Grid 목록 데이터 조회/초기화 커스텀 훅
 * B001Page에서 사용하며, GridPanel에 rowData·loading·searched를 전달합니다.
 */
import { useState, useCallback } from "react";

export const MOCK_AUTH_EXCEL_ROWS = [
  //          이름,	         사번,	        부서,	         권한이름,	      권한부여,	   사용여부,	          세부권한정보,	          사용여부
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


export const useGrid = () => {
  const [rowData, setRowData] = useState([]); // 그리드에 표시할 행 데이터 배열
  const [loading, setLoading] = useState(false); // 그리드 API 조회 중 여부
  const [searched, setSearched] = useState(false); // 조회 버튼을 한 번이라도 눌렀는지 (false면 안내 문구 표시)
  const [error, setError] = useState(null); // 조회 실패 시 에러 메시지






  /**
   * 그리드 데이터 조회 (조회 버튼 클릭 시 B001Page.handleSearch에서 호출)
   * @param {Object} params - getSearchParams()가 반환한 조회 조건 (week, departmentCode 등)
   */
  const search = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // const response = await fetchGridData(params); // api/grid/search → data에 업종/협력업체/담당자 포함
      // //setRowData(response?.data ?? []);
      // setRowData(MOCK_AUTH_EXCEL_ROWS);
      // setSearched(true); // 조회 완료 → GridPanel에서 그리드 표시
      // return response;


      // 펼침/접힘은 row.id 로 구분함 → 엑셀 행마다 고유 id 필수
      // 같은 사람+권한이름끼리 묶고, 세부권한은 details 배열에 넣음 (펼침 테이블용)
      const grouped = new Map();
      MOCK_AUTH_EXCEL_ROWS.forEach((row) => {
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
          detailAuth: row.detailAuth,
          detailUseYn: row.detailUseYn,
        });
      });

      const rows = Array.from(grouped.values());
      setRowData(rows);
      setSearched(true);
      return { data: rows, totalCount: rows.length };

    } catch (err) {
      setError(err?.message ?? "조회 중 오류가 발생했습니다.");
      setRowData([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);





  /*
   // 펼침/접힘은 row.id 로 구분함 → 엑셀 행마다 고유 id 필수
      // 같은 사람+권한이름끼리 묶고, 세부권한은 details 배열에 넣음 (펼침 테이블용)
      const grouped = new Map();
      MOCK_AUTH_EXCEL_ROWS.forEach((row) => {
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
          detailAuth: row.detailAuth,
          detailUseYn: row.detailUseYn,
        });
      });

      const rows = Array.from(grouped.values());
      setRowData(rows);
      setSearched(true);
      return { data: rows, totalCount: rows.length };

  */
  /**
   * 그리드 초기화 (리셋 버튼 클릭 시 B001Page.handleReset에서 호출)
   * 데이터를 비우고 화면을 최초 로드 상태로 되돌림
   */
  const clearGrid = useCallback(() => {
    setRowData([]);
    setSearched(false);
    setError(null);
  }, []);

  return {
    rowData,
    loading,
    searched,
    error,
    search,
    clearGrid,
  };
};
