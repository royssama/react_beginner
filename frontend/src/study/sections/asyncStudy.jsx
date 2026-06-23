import axios from "axios";
import { MultiSection, ExampleBlock } from "../StudyLayout";

/** 비동기 학습 섹션 */
export const renderAsyncSection = (tab, ctx) => {
  const {
    asyncResult, setAsyncResult,
    asyncSteps, setAsyncSteps,
    tryResult, setTryResult,
    promiseResult, setPromiseResult, promiseTiming,
    fetchResult, setFetchResult,
    fetchDetail, setFetchDetail,
  } = ctx;

  switch (tab) {
    case "asyncAwait":
      return (
        <MultiSection
          title="async / await"
          overview="async/await는 Promise를 '동기 코드처럼' 읽기 쉽게 작성하는 문법입니다. B001의 API 호출 전반에 사용됩니다."
        >
          <ExampleBlock
            number={1}
            title="1초 대기 후 결과 표시"
            desc="await new Promise(...) 로 지정 시간만큼 기다립니다."
            b001Ref="handleReset — await resetFilters()"
            code={`const handleClick = async () => {
  setAsyncResult("로딩...");
  await new Promise((r) => setTimeout(r, 1000));
  setAsyncResult("1초 후 완료!");
};`}
            demo={
              <>
                <button className="btn btn-primary" onClick={async () => {
                  setAsyncResult("로딩...");
                  await new Promise((r) => setTimeout(r, 1000));
                  setAsyncResult("1초 후 완료!");
                }}>1초 대기</button>
                <p className="study-result">{asyncResult}</p>
              </>
            }
          />
          <ExampleBlock
            number={2}
            title="순차 실행 — 1단계 → 2단계 → 3단계"
            desc="await를 연속으로 쓰면 이전 작업이 끝난 뒤 다음 실행 (B001 필터 로드 순서)"
            b001Ref="resetFilters — loadDepartments → loadSections → loadStaticOptions 순서"
            code={`const resetFilters = async () => {
  const deptList = await loadDepartments(week);      // 1단계
  const sectionList = await loadSections(week, code); // 2단계
  await loadStaticOptions();                          // 3단계
  setFilters({ ... });
};`}
            demo={
              <>
                <button className="btn btn-primary" onClick={async () => {
                  setAsyncSteps([]);
                  setAsyncSteps((s) => [...s, "1. 부서 API 호출..."]);
                  await new Promise((r) => setTimeout(r, 500));
                  setAsyncSteps((s) => [...s, "2. 팀 API 호출..."]);
                  await new Promise((r) => setTimeout(r, 500));
                  setAsyncSteps((s) => [...s, "3. filters 초기화 완료!"]);
                }}>순차 실행 시뮬레이션</button>
                <ol>{asyncSteps.map((step, i) => <li key={i}>{step}</li>)}</ol>
              </>
            }
          />
          <ExampleBlock
            number={3}
            title="async 함수는 항상 Promise 반환"
            desc="resetFilters()를 호출하면 Promise가 반환되어 await 가능"
            code={`const handleReset = async () => {
  await resetFilters();  // resetFilters가 끝날 때까지 대기
  clearGrid();
};`}
            demo={<p className="study-tip">await 없이 resetFilters()만 호출하면 API 완료 전에 clearGrid가 실행될 수 있음</p>}
          />
        </MultiSection>
      );

    case "tryCatch":
      return (
        <MultiSection
          title="try / catch / finally"
          overview="try에서 오류가 나면 catch가 잡고, finally는 성공/실패 관계없이 항상 실행됩니다."
        >
          <ExampleBlock
            number={1}
            title="의도적 에러 잡기"
            code={`try {
  throw new Error("의도적 오류");
} catch (err) {
  setTryResult(err.message);
} finally {
  console.log("항상 실행");
}`}
            demo={
              <>
                <button className="btn btn-primary" onClick={() => {
                  try {
                    throw new Error("API 연결 실패!");
                  } catch (err) {
                    setTryResult(`catch: ${err.message}`);
                  } finally {
                    setTryResult((prev) => `${prev} | finally: 로딩 종료`);
                  }
                }}>에러 발생</button>
                <button className="btn btn-secondary" onClick={() => setTryResult("정상 완료 | finally: 로딩 종료")}>성공 시뮬레이션</button>
                <p className="study-result">{tryResult}</p>
              </>
            }
          />
          <ExampleBlock
            number={2}
            title="API 호출 실패 처리"
            desc="fetch/axios 실패 시 catch에서 사용자에게 메시지 표시"
            b001Ref="useGrid search — catch에서 setError, setRowData([])"
            code={`try {
  const res = await fetchGridData(params);
  setRowData(res.data);
} catch (err) {
  setError(err.message);
  setRowData([]);
} finally {
  setLoading(false);
}`}
            demo={
              <button className="btn btn-primary" onClick={async () => {
                try {
                  await fetch("/api/not-exists-404");
                } catch {
                  setTryResult("catch: API 실패 — 사용자에게 오류 메시지 표시");
                } finally {
                  setTryResult((p) => p + " | finally: setLoading(false)");
                }
              }}>404 API 호출</button>
            }
          />
          <ExampleBlock
            number={3}
            title="finally는 왜 쓰나"
            desc="성공해도 실패해도 로딩 스피너를 끄려면 finally에 setLoading(false)"
            b001Ref="useSearch resetFilters — try { ... } finally { setLoading(false) }"
            code={`try {
  await loadDepartments(week);
} catch (err) {
  // 에러 처리
} finally {
  setLoading(false);  // 무조건 로딩 해제
}`}
            demo={<p className="study-tip">finally 없이 try/catch 각각에 setLoading(false) 넣으면 코드 중복</p>}
          />
        </MultiSection>
      );

    case "promiseAll":
      return (
        <MultiSection
          title="Promise.all"
          overview="여러 비동기 작업을 '동시에' 실행하고, 모두 성공하면 결과 배열을 반환합니다. 하나라도 실패하면 전체 실패."
        >
          <ExampleBlock
            number={1}
            title="2개 API 동시 호출"
            desc="순차(await 2번)보다 빠름 — 동시에 시작"
            b001Ref="useSearch loadStaticOptions — Promise.all([categories, statuses, types])"
            code={`const [cat, status, types] = await Promise.all([
  fetchGridCategories(),
  fetchGridStatuses(),
  fetchGridTypes(),
]);`}
            demo={
              <>
                <button className="btn btn-primary" onClick={async () => {
                  const start = Date.now();
                  setPromiseResult("로딩...");
                  const results = await Promise.all([
                    new Promise((r) => setTimeout(() => r("부서"), 600)),
                    new Promise((r) => setTimeout(() => r("팀"), 600)),
                    new Promise((r) => setTimeout(() => r("카테고리"), 600)),
                  ]);
                  setPromiseTiming(`${Date.now() - start}ms (동시 실행 → 약 600ms)`);
                  setPromiseResult(`완료: ${results.join(", ")}`);
                }}>Promise.all (3개 동시)</button>
                <p className="study-result">{promiseResult}</p>
                {promiseTiming && <p>{promiseTiming}</p>}
              </>
            }
          />
          <ExampleBlock
            number={2}
            title="순차 vs Promise.all 시간 차이"
            desc="await 3번 연속이면 1800ms, Promise.all이면 600ms"
            code={`// 순차: 600+600+600 = 1800ms
await api1(); await api2(); await api3();

// 동시: max(600,600,600) = 600ms
await Promise.all([api1(), api2(), api3()]);`}
            demo={
              <button className="btn btn-secondary" onClick={async () => {
                const start = Date.now();
                await new Promise((r) => setTimeout(r, 400));
                await new Promise((r) => setTimeout(r, 400));
                await new Promise((r) => setTimeout(r, 400));
                setPromiseTiming(`순차 실행: ${Date.now() - start}ms (약 1200ms)`);
              }}>순차 실행 비교</button>
            }
          />
          <ExampleBlock
            number={3}
            title="하나 실패 시 전체 실패"
            desc="Promise.all은 하나라도 reject되면 catch로"
            code={`try {
  await Promise.all([ok(), fail()]);
} catch (err) {
  // fail() 때문에 여기로
}`}
            demo={<p className="study-tip">관련 없는 API는 all, 하나 실패해도 나머지 필요하면 allSettled</p>}
          />
        </MultiSection>
      );

    case "fetchAxios":
      return (
        <MultiSection
          title="fetch / axios"
          overview="서버 API를 호출하는 두 가지 대표 방법입니다. 이 프로젝트는 axiosUtil.get 패턴을 사용합니다."
        >
          <ExampleBlock
            number={1}
            title="fetch — 브라우저 내장"
            code={`const res = await fetch("/api/grid/options/statuses");
const json = await res.json();
console.log(json.data);`}
            demo={
              <button className="btn btn-primary" onClick={async () => {
                setFetchResult("fetch 조회 중...");
                try {
                  const res = await fetch("/api/grid/options/statuses");
                  const json = await res.json();
                  setFetchDetail(JSON.stringify(json.data, null, 2));
                  setFetchResult(`fetch 성공: ${json.data?.length}건`);
                } catch {
                  setFetchResult("fetch 실패 — 백엔드(8080) 확인");
                }
              }}>fetch로 상태 목록 조회</button>
            }
            output={fetchResult}
          />
          <ExampleBlock
            number={2}
            title="axios — 응답이 편리"
            desc="axios는 .data에 바로 본문. 이 프로젝트는 axiosUtil로 래핑"
            b001Ref="B001Api.js — axiosUtil.get('api/grid/options/departments', params, {})"
            code={`import axiosUtil from "../utils/axiosUtil";

const response = await axiosUtil.get(
  "api/grid/search",
  { week: "202625", departmentCode: "D01" },
  {}
);
// response.data → 그리드 행 배열`}
            demo={
              <button className="btn btn-primary" onClick={async () => {
                setFetchResult("axios 조회 중...");
                try {
                  const res = await axios.get("/api/grid/options/statuses");
                  setFetchDetail(JSON.stringify(res.data?.data, null, 2));
                  setFetchResult(`axios 성공: ${res.data?.data?.length}건`);
                } catch {
                  setFetchResult("axios 실패 — 백엔드(8080) 확인");
                }
              }}>axios로 상태 목록 조회</button>
            }
          />
          <ExampleBlock
            number={3}
            title="B001 실제 조회 흐름"
            desc="조회 버튼 → getSearchParams() → fetchGridData(params) → setRowData"
            b001Ref="useGrid.js search → B001Api fetchGridData → api/grid/search"
            code={`// B001Page.jsx
const handleSearch = async () => {
  await search(getSearchParams());
};

// useGrid.js
const response = await fetchGridData(params);
setRowData(response?.data ?? []);`}
            demo={
              <>
                <button className="btn btn-secondary" onClick={async () => {
                  try {
                    const [f, a] = await Promise.all([
                      fetch("/api/grid/options/statuses").then((r) => r.json()),
                      axios.get("/api/grid/options/statuses").then((r) => r.data),
                    ]);
                    setFetchResult(`fetch ${f.data?.length}건 | axios ${a.data?.length}건`);
                  } catch {
                    setFetchResult("백엔드 미실행");
                  }
                }}>fetch + axios 동시 비교</button>
                {fetchDetail && <pre className="study-code study-code-sm">{fetchDetail}</pre>}
              </>
            }
            output={fetchResult}
          />
        </MultiSection>
      );

    default:
      return null;
  }
};
