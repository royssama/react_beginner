import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useContext,
  useReducer,
  createContext,
} from "react";
import axios from "axios";

/* ───────── useContext 데모용 ───────── */
const ThemeContext = createContext("light");

const ThemeDisplay = () => {
  const theme = useContext(ThemeContext);
  return <span>현재 테마: <strong>{theme}</strong></span>;
};

/* ───────── useReducer 데모용 ───────── */
const counterReducer = (state, action) => {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    case "reset":
      return { count: 0 };
    default:
      return state;
  }
};

/* ───────── 학습 섹션 정의 ───────── */
const STUDY_SECTIONS = [
  { id: "useState", category: "Hooks" },
  { id: "useEffect", category: "Hooks" },
  { id: "useCallback", category: "Hooks" },
  { id: "useMemo", category: "Hooks" },
  { id: "useRef", category: "Hooks" },
  { id: "useContext", category: "Hooks" },
  { id: "useReducer", category: "Hooks" },
  { id: "map", category: "배열 메서드" },
  { id: "filter", category: "배열 메서드" },
  { id: "find", category: "배열 메서드" },
  { id: "forEach", category: "배열 메서드" },
  { id: "reduce", category: "배열 메서드" },
  { id: "sort", category: "배열 메서드" },
  { id: "includes", category: "배열 메서드" },
  { id: "objectKeys", category: "객체/배열" },
  { id: "arrayIsArray", category: "객체/배열" },
  { id: "spread", category: "객체/배열" },
  { id: "concat", category: "객체/배열" },
  { id: "onChange", category: "이벤트" },
  { id: "onClick", category: "이벤트" },
  { id: "onKeyDown", category: "이벤트" },
  { id: "targetValue", category: "이벤트" },
  { id: "preventDefault", category: "이벤트" },
  { id: "asyncAwait", category: "비동기" },
  { id: "tryCatch", category: "비동기" },
  { id: "promiseAll", category: "비동기" },
  { id: "fetchAxios", category: "비동기" },
];

const StudyPage = () => {
  const [activeTab, setActiveTab] = useState("useState");

  /* useState */
  const [text, setText] = useState("안녕하세요");
  const [count, setCount] = useState(0);

  /* useEffect */
  const [effectCount, setEffectCount] = useState(0);
  const [effectLog, setEffectLog] = useState([]);

  /* useCallback / useMemo */
  const [cbNum, setCbNum] = useState(1);
  const [memoItems, setMemoItems] = useState([3, 1, 4, 1, 5]);

  /* useRef */
  const inputRef = useRef(null);

  /* useContext */
  const [theme, setTheme] = useState("light");

  /* useReducer */
  const [reducerState, dispatch] = useReducer(counterReducer, { count: 0 });

  /* 배열 메서드 */
  const sampleArr = [10, 25, 8, 42, 17];
  const users = [
    { id: 1, name: "김철수", role: "dev" },
    { id: 2, name: "이영희", role: "design" },
    { id: 3, name: "박민수", role: "dev" },
  ];
  const sampleObj = { name: "React", version: 18, type: "library" };

  /* 이벤트 */
  const [inputVal, setInputVal] = useState("");
  const [clickCount, setClickCount] = useState(0);
  const [keyLog, setKeyLog] = useState("");
  const [formMsg, setFormMsg] = useState("");

  /* 비동기 */
  const [asyncResult, setAsyncResult] = useState("");
  const [tryResult, setTryResult] = useState("");
  const [promiseResult, setPromiseResult] = useState("");
  const [fetchResult, setFetchResult] = useState("");

  useEffect(() => {
    setEffectLog((prev) => [...prev, `effectCount가 ${effectCount}로 변경됨`]);
  }, [effectCount]);

  const double = useCallback((n) => n * 2, []);
  const sortedMemo = useMemo(() => [...memoItems].sort((a, b) => a - b), [memoItems]);

  const renderSection = () => {
    switch (activeTab) {
      case "useState":
        return (
          <Section
            title="useState"
            desc="컴포넌트 안에서 값을 저장하고, 값이 바뀌면 화면이 다시 그려집니다."
            code={`const [text, setText] = useState("안녕하세요");
const [count, setCount] = useState(0);

// 사용
setText("새 값");
setCount(count + 1);`}
            demo={
              <>
                <input
                  className="study-input"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <p>입력값: {text}</p>
                <button className="btn btn-primary" onClick={() => setCount(count + 1)}>
                  +1 (현재: {count})
                </button>
              </>
            }
          />
        );

      case "useEffect":
        return (
          <Section
            title="useEffect"
            desc="렌더링 이후에 실행할 작업(데이터 로드, 로그 등)을 등록합니다. 의존 배열에 넣은 값이 바뀔 때마다 다시 실행됩니다."
            code={`useEffect(() => {
  setEffectLog(prev => [...prev, \`effectCount가 \${effectCount}로 변경됨\`]);
}, [effectCount]);`}
            demo={
              <>
                <button className="btn btn-primary" onClick={() => setEffectCount((c) => c + 1)}>
                  effectCount 증가 ({effectCount})
                </button>
                <ul>{effectLog.slice(-5).map((log, i) => <li key={i}>{log}</li>)}</ul>
              </>
            }
          />
        );

      case "useCallback":
        return (
          <Section
            title="useCallback"
            desc="함수를 메모이제이션하여 불필요한 재생성을 막습니다. 자식 컴포넌트에 함수를 props로 넘길 때 유용합니다."
            code={`const double = useCallback((n) => n * 2, []);

// 사용
double(cbNum)  // 결과: cbNum * 2`}
            demo={
              <>
                <button className="btn btn-primary" onClick={() => setCbNum((n) => n + 1)}>
                  숫자 증가 ({cbNum})
                </button>
                <p className="study-result">double({cbNum}) = {double(cbNum)}</p>
              </>
            }
          />
        );

      case "useMemo":
        return (
          <Section
            title="useMemo"
            desc="계산 결과를 캐시합니다. 의존 값이 바뀔 때만 다시 계산합니다."
            code={`const sortedMemo = useMemo(
  () => [...memoItems].sort((a, b) => a - b),
  [memoItems]
);`}
            demo={
              <>
                <p>원본: [{memoItems.join(", ")}]</p>
                <p className="study-result">정렬: [{sortedMemo.join(", ")}]</p>
                <button
                  className="btn btn-primary"
                  onClick={() => setMemoItems([...memoItems, Math.floor(Math.random() * 10)])}
                >
                  랜덤 숫자 추가
                </button>
              </>
            }
          />
        );

      case "useRef":
        return (
          <Section
            title="useRef"
            desc="DOM 요소에 직접 접근하거나, 리렌더링 없이 값을 유지할 때 사용합니다."
            code={`const inputRef = useRef(null);

// 포커스 이동
inputRef.current.focus();`}
            demo={
              <>
                <input ref={inputRef} className="study-input" placeholder="여기로 포커스" />
                <button className="btn btn-primary" onClick={() => inputRef.current?.focus()}>
                  input에 포커스
                </button>
              </>
            }
          />
        );

      case "useContext":
        return (
          <Section
            title="useContext"
            desc="props 없이 상위 컴포넌트의 값을 하위에서 읽습니다."
            code={`const ThemeContext = createContext("light");
const theme = useContext(ThemeContext);`}
            demo={
              <ThemeContext.Provider value={theme}>
                <button
                  className="btn btn-primary"
                  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                >
                  테마 전환
                </button>
                <p><ThemeDisplay /></p>
              </ThemeContext.Provider>
            }
          />
        );

      case "useReducer":
        return (
          <Section
            title="useReducer"
            desc="복잡한 state 변경을 action 단위로 관리합니다. useState의 확장版입니다."
            code={`const [state, dispatch] = useReducer(counterReducer, { count: 0 });
dispatch({ type: "increment" });`}
            demo={
              <>
                <p className="study-result">count: {reducerState.count}</p>
                <button className="btn btn-primary" onClick={() => dispatch({ type: "increment" })}>+1</button>
                <button className="btn btn-secondary" onClick={() => dispatch({ type: "decrement" })}>-1</button>
                <button className="btn btn-secondary" onClick={() => dispatch({ type: "reset" })}>리셋</button>
              </>
            }
          />
        );

      case "map":
        return (
          <Section
            title="map"
            desc="배열 각 요소를 변환해 새 배열을 만듭니다. React에서 목록 렌더링에 자주 씁니다."
            code={`users.map(user => (
  <li key={user.id}>{user.name}</li>
))`}
            demo={<ul>{users.map((u) => <li key={u.id}>{u.name} ({u.role})</li>)}</ul>}
          />
        );

      case "filter":
        return (
          <Section
            title="filter"
            desc="조건에 맞는 요소만 골라 새 배열을 만듭니다."
            code={`users.filter(u => u.role === "dev")`}
            demo={
              <p className="study-result">
                dev: {users.filter((u) => u.role === "dev").map((u) => u.name).join(", ")}
              </p>
            }
          />
        );

      case "find":
        return (
          <Section
            title="find"
            desc="조건에 맞는 첫 번째 요소 하나를 반환합니다."
            code={`users.find(u => u.id === 2)`}
            demo={
              <p className="study-result">
                id=2: {JSON.stringify(users.find((u) => u.id === 2))}
              </p>
            }
          />
        );

      case "forEach":
        return (
          <Section
            title="forEach"
            desc="배열 각 요소에 대해 함수를 실행합니다. 반환값은 없습니다."
            code={`let sum = 0;
sampleArr.forEach(n => { sum += n; });`}
            demo={
              <p className="study-result">
                합계: {(() => { let s = 0; sampleArr.forEach((n) => { s += n; }); return s; })()}
              </p>
            }
          />
        );

      case "reduce":
        return (
          <Section
            title="reduce"
            desc="배열을 하나의 값으로 줄입니다. 합계, 그룹핑 등에 사용합니다."
            code={`sampleArr.reduce((acc, n) => acc + n, 0)`}
            demo={
              <p className="study-result">
                reduce 합계: {sampleArr.reduce((acc, n) => acc + n, 0)}
              </p>
            }
          />
        );

      case "sort":
        return (
          <Section
            title="sort"
            desc="배열을 정렬합니다. 원본을 변경하므로 [...arr].sort()처럼 복사 후 사용하는 것이 안전합니다."
            code={`[...sampleArr].sort((a, b) => a - b)`}
            demo={
              <p className="study-result">
                오름차순: {[...sampleArr].sort((a, b) => a - b).join(", ")}
              </p>
            }
          />
        );

      case "includes":
        return (
          <Section
            title="includes"
            desc="배열에 특정 값이 포함되어 있는지 true/false로 확인합니다."
            code={`sampleArr.includes(42)  // true`}
            demo={
              <p className="study-result">
                42 포함? {String(sampleArr.includes(42))} / 99 포함? {String(sampleArr.includes(99))}
              </p>
            }
          />
        );

      case "objectKeys":
        return (
          <Section
            title="Object.keys"
            desc="객체의 키 목록을 배열로 반환합니다."
            code={`Object.keys(sampleObj)  // ["name", "version", "type"]`}
            demo={
              <p className="study-result">키: {Object.keys(sampleObj).join(", ")}</p>
            }
          />
        );

      case "arrayIsArray":
        return (
          <Section
            title="Array.isArray"
            desc="값이 배열인지 확인합니다."
            code={`Array.isArray(sampleArr)  // true
Array.isArray("hello")  // false`}
            demo={
              <p className="study-result">
                sampleArr: {String(Array.isArray(sampleArr))} / "hello": {String(Array.isArray("hello"))}
              </p>
            }
          />
        );

      case "spread":
        return (
          <Section
            title="spread (...)"
            desc="배열·객체를 펼쳐 복사하거나 합칩니다."
            code={`const merged = [...sampleArr, 100];
const newObj = { ...sampleObj, version: 19 };`}
            demo={
              <>
                <p className="study-result">배열: {[...sampleArr, 100].join(", ")}</p>
                <p className="study-result">객체: {JSON.stringify({ ...sampleObj, version: 19 })}</p>
              </>
            }
          />
        );

      case "concat":
        return (
          <Section
            title="concat"
            desc="배열을 이어 붙여 새 배열을 만듭니다."
            code={`sampleArr.concat([100, 200])`}
            demo={
              <p className="study-result">
                결과: {sampleArr.concat([100, 200]).join(", ")}
              </p>
            }
          />
        );

      case "onChange":
        return (
          <Section
            title="onChange"
            desc="input, select 등 값이 바뀔 때 실행되는 이벤트 핸들러입니다."
            code={`<input onChange={(e) => setInputVal(e.target.value)} />`}
            demo={
              <>
                <input
                  className="study-input"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                />
                <p>입력: {inputVal}</p>
              </>
            }
          />
        );

      case "onClick":
        return (
          <Section
            title="onClick"
            desc="버튼 등을 클릭했을 때 실행됩니다."
            code={`<button onClick={() => setClickCount(c => c + 1)}>클릭</button>`}
            demo={
              <button className="btn btn-primary" onClick={() => setClickCount((c) => c + 1)}>
                클릭 횟수: {clickCount}
              </button>
            }
          />
        );

      case "onKeyDown":
        return (
          <Section
            title="onKeyDown"
            desc="키보드 키를 눌렀을 때 실행됩니다."
            code={`<input onKeyDown={(e) => setKeyLog(e.key)} />`}
            demo={
              <>
                <input
                  className="study-input"
                  placeholder="키를 눌러보세요"
                  onKeyDown={(e) => setKeyLog(`누른 키: ${e.key}`)}
                />
                <p className="study-result">{keyLog || "아직 키 입력 없음"}</p>
              </>
            }
          />
        );

      case "targetValue":
        return (
          <Section
            title="e.target.value"
            desc="이벤트 객체에서 입력 요소의 현재 값을 읽습니다."
            code={`onChange={(e) => console.log(e.target.value)}`}
            demo={
              <input
                className="study-input"
                placeholder="입력하면 아래에 표시"
                onChange={(e) => setInputVal(e.target.value)}
              />
            }
            result={`e.target.value = "${inputVal}"`}
          />
        );

      case "preventDefault":
        return (
          <Section
            title="e.preventDefault()"
            desc="폼 제출, 링크 이동 등 브라우저 기본 동작을 막습니다."
            code={`const handleSubmit = (e) => {
  e.preventDefault();
  setFormMsg("제출 막음!");
};`}
            demo={
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setFormMsg("폼 기본 제출이 preventDefault()로 막혔습니다!");
                }}
              >
                <input className="study-input" placeholder="이름" />
                <button type="submit" className="btn btn-primary">제출</button>
                {formMsg && <p className="study-result">{formMsg}</p>}
              </form>
            }
          />
        );

      case "asyncAwait":
        return (
          <Section
            title="async / await"
            desc="비동기 작업을 동기 코드처럼 작성합니다. async 함수 안에서 await로 결과를 기다립니다."
            code={`const run = async () => {
  await new Promise(r => setTimeout(r, 1000));
  setAsyncResult("1초 후 완료!");
};`}
            demo={
              <>
                <button
                  className="btn btn-primary"
                  onClick={async () => {
                    setAsyncResult("로딩...");
                    await new Promise((r) => setTimeout(r, 1000));
                    setAsyncResult("1초 후 완료!");
                  }}
                >
                  1초 대기 실행
                </button>
                <p className="study-result">{asyncResult}</p>
              </>
            }
          />
        );

      case "tryCatch":
        return (
          <Section
            title="try / catch / finally"
            desc="에러를 잡아 처리하고, finally에서 마무리 작업을 합니다."
            code={`try {
  throw new Error("의도적 오류");
} catch (err) {
  setTryResult(err.message);
} finally {
  // 항상 실행
}`}
            demo={
              <>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    try {
                      throw new Error("의도적 오류 발생!");
                    } catch (err) {
                      setTryResult(`catch: ${err.message}`);
                    } finally {
                      setTryResult((prev) => `${prev} | finally 실행됨`);
                    }
                  }}
                >
                  오류 발생 테스트
                </button>
                <p className="study-result">{tryResult}</p>
              </>
            }
          />
        );

      case "promiseAll":
        return (
          <Section
            title="Promise.all"
            desc="여러 Promise를 동시에 실행하고, 모두 완료되면 결과 배열을 반환합니다."
            code={`const [a, b] = await Promise.all([
  fetch("/api/a"),
  fetch("/api/b"),
]);`}
            demo={
              <>
                <button
                  className="btn btn-primary"
                  onClick={async () => {
                    setPromiseResult("로딩...");
                    const results = await Promise.all([
                      new Promise((r) => setTimeout(() => r("API-1"), 500)),
                      new Promise((r) => setTimeout(() => r("API-2"), 800)),
                    ]);
                    setPromiseResult(`완료: ${results.join(", ")}`);
                  }}
                >
                  Promise.all 실행
                </button>
                <p className="study-result">{promiseResult}</p>
              </>
            }
          />
        );

      case "fetchAxios":
        return (
          <Section
            title="fetch / axios"
            desc="서버 API를 호출하는 대표적인 방법입니다. 이 프로젝트는 axiosUtil을 사용합니다."
            code={`// fetch
const res = await fetch("/api/grid/options/statuses");
const json = await res.json();

// axios
const res = await axios.get("/api/grid/options/statuses");`}
            demo={
              <>
                <button
                  className="btn btn-primary"
                  onClick={async () => {
                    setFetchResult("조회 중...");
                    try {
                      const [fetchRes, axiosRes] = await Promise.all([
                        fetch("/api/grid/options/statuses").then((r) => r.json()),
                        axios.get("/api/grid/options/statuses").then((r) => r.data),
                      ]);
                      setFetchResult(
                        `fetch: ${fetchRes.data?.length}건 | axios: ${axiosRes.data?.length}건`
                      );
                    } catch {
                      setFetchResult("백엔드(8080)가 실행 중인지 확인하세요.");
                    }
                  }}
                >
                  fetch + axios 동시 호출
                </button>
                <p className="study-result">{fetchResult}</p>
              </>
            }
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="page study-page">
      <h1>React 학습 페이지</h1>
      <p className="study-intro">
        각 탭을 클릭하면 설명, 실제 동작 데모, 소스 코드를 확인할 수 있습니다.
        B001 화면 소스는 <code>pages/B001Page.jsx</code>, <code>hooks/</code>, <code>components/</code>를 참고하세요.
      </p>

      <div className="study-tabs">
        {STUDY_SECTIONS.map((s) => (
          <button
            key={s.id}
            className={`study-tab ${activeTab === s.id ? "active" : ""}`}
            onClick={() => setActiveTab(s.id)}
          >
            {s.id}
          </button>
        ))}
      </div>

      {renderSection()}
    </div>
  );
};

const Section = ({ title, desc, code, demo, result }) => (
  <div className="study-section">
    <h2>{title}</h2>
    <p className="study-desc">{desc}</p>
    <div className="study-demo">{demo}</div>
    {result && <p className="study-result">{result}</p>}
    <pre className="study-code">{code}</pre>
  </div>
);

export default StudyPage;
