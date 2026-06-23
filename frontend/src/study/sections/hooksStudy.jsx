import { MultiSection, ExampleBlock } from "../StudyLayout";

/** Hooks 학습 섹션 (useState ~ useReducer) */
export const renderHooksSection = (tab, ctx) => {
  const {
    text, setText, count, setCount,
    userName, setUserName, userAge, setUserAge,
    filtersDemo, setFiltersDemo,
    effectCount, setEffectCount, effectLog,
    mountMsg, setMountMsg,
    timerSec, setTimerSec,
    cbNum, setCbNum, double, cbRenderCount, setCbRenderCount,
    memoItems, setMemoItems, sortedMemo, memoSum,
    inputRef, refInputValue, setRefInputValue, renderCountRef,
    theme, setTheme, ThemeContext, ThemeDisplay, UserContext, UserDisplay,
    reducerState, dispatch, todos, todoInput, setTodoInput, addTodo, toggleTodo,
  } = ctx;

  switch (tab) {
    case "useState":
      return (
        <MultiSection
          title="useState"
          overview="useState는 React 컴포넌트에서 '변하는 값'을 저장하는 도구입니다. 값이 바뀌면 React가 화면을 자동으로 다시 그립니다. B001 화면의 filters, rowData 등 모든 동적 데이터가 useState로 관리됩니다."
        >
          <ExampleBlock
            number={1}
            title="문자열 state — 입력창과 화면 연동"
            desc="input에 글자를 치면 state가 바뀌고, 바뀐 state가 화면에 즉시 반영됩니다."
            whenToUse="텍스트 입력, 검색어, 이름 입력 등 단순 문자열 저장"
            b001Ref="StudyPage는 아니지만, SearchPanel에서 filters.week를 화면에 표시하는 것과 같은 원리입니다."
            code={`const [text, setText] = useState("안녕하세요");

<input
  value={text}
  onChange={(e) => setText(e.target.value)}
/>
<p>화면에 표시: {text}</p>`}
            demo={
              <>
                <input className="study-input" value={text} onChange={(e) => setText(e.target.value)} />
                <p>화면에 표시: <strong>{text}</strong></p>
                <button className="btn btn-secondary" onClick={() => setText("초기화됨!")}>setText로 직접 변경</button>
              </>
            }
          />
          <ExampleBlock
            number={2}
            title="숫자 state — 카운터 (+1 / -1)"
            desc="버튼 클릭마다 count가 1씩 증가합니다. setCount(count + 1) 또는 setCount(c => c + 1) 두 방식 모두 가능합니다."
            whenToUse="클릭 횟수, 수량, 페이지 번호 등 숫자 증감"
            b001Ref="useGrid의 searched 상태처럼 '조회했는지 여부'를 true/false로 바꾸는 것도 useState입니다."
            code={`const [count, setCount] = useState(0);

// 방법 1: 현재 값 사용
setCount(count + 1);

// 방법 2: 이전 값 기준 (연속 클릭에 안전)
setCount((c) => c + 1);
setCount((c) => c - 1);`}
            demo={
              <div className="study-btn-row">
                <button className="btn btn-primary" onClick={() => setCount((c) => c + 1)}>+1</button>
                <button className="btn btn-secondary" onClick={() => setCount((c) => c - 1)}>-1</button>
                <button className="btn btn-secondary" onClick={() => setCount(0)}>0으로 리셋</button>
                <span className="study-result">현재 count: {count}</span>
              </div>
            }
          />
          <ExampleBlock
            number={3}
            title="객체 state — 여러 값을 한 덩어리로 관리"
            desc="이름·나이를 하나의 user 객체로 관리합니다. 변경 시 반드시 {...prev}로 기존 값을 복사한 뒤 바꿀 필드만 수정해야 합니다."
            whenToUse="조회 조건(filters), 사용자 정보, 폼 데이터처럼 관련된 값이 여러 개일 때"
            b001Ref="useSearch.js의 filters — { week, departmentCode, sectionCode, categoryCodes, statusCode, typeCodes }"
            code={`const [filters, setFilters] = useState({
  week: "202625",
  departmentCode: "D01",
});

// ❌ 잘못된 방법: filters.departmentCode = "D02" (직접 수정 금지)
// ✅ 올바른 방법: 새 객체 생성
setFilters((prev) => ({
  ...prev,                    // 기존 값 복사 (spread)
  departmentCode: "D02",       // 바꿀 것만 덮어쓰기
}));`}
            demo={
              <>
                <label>이름: </label>
                <input className="study-input" value={userName} onChange={(e) => setUserName(e.target.value)} />
                <label>나이: </label>
                <input className="study-input" type="number" value={userAge} onChange={(e) => setUserAge(Number(e.target.value))} />
                <p className="study-result">user 객체: {JSON.stringify({ name: userName, age: userAge })}</p>
                <hr className="study-hr" />
                <p>filters 데모 (B001과 동일 패턴):</p>
                <button className="btn btn-primary" onClick={() => setFiltersDemo((p) => ({ ...p, departmentCode: "D02" }))}>
                  부서를 D02로 변경
                </button>
                <button className="btn btn-secondary" onClick={() => setFiltersDemo((p) => ({ ...p, categoryCodes: [...p.categoryCodes, "C01"] }))}>
                  카테고리 C01 추가
                </button>
                <p className="study-result">{JSON.stringify(filtersDemo)}</p>
              </>
            }
          />
        </MultiSection>
      );

    case "useEffect":
      return (
        <MultiSection
          title="useEffect"
          overview="useEffect는 '화면이 그려진 후' 실행할 코드를 등록합니다. API 호출, 로그 기록, 타이머 설정 등에 사용합니다. 의존 배열 [값]에 넣은 값이 바뀔 때마다 다시 실행됩니다."
        >
          <ExampleBlock
            number={1}
            title="의존 배열 — 특정 값이 바뀔 때만 실행"
            desc="effectCount가 바뀔 때마다 effectLog에 기록이 추가됩니다. 의존 배열이 []이면 최초 1회만, [effectCount]면 effectCount 변경 시마다 실행됩니다."
            whenToUse="필터 값이 바뀌면 연관 API를 다시 호출할 때 (주차 변경 → 부서 목록 재조회)"
            b001Ref="useSearch.js — handleWeekChange에서 주차 변경 후 loadDepartments(), loadSections() 호출하는 패턴"
            code={`useEffect(() => {
  setEffectLog((prev) => [...prev, \`effectCount가 \${effectCount}로 변경됨\`]);
}, [effectCount]);  // effectCount가 바뀔 때만 실행

// [] 빈 배열이면 → 컴포넌트 최초 마운트 시 1번만
// [week] 이면 → week가 바뀔 때마다`}
            demo={
              <>
                <button className="btn btn-primary" onClick={() => setEffectCount((c) => c + 1)}>
                  effectCount 증가 (현재: {effectCount})
                </button>
                <p>실행 기록 (최근 5개):</p>
                <ul className="study-log">{effectLog.slice(-5).map((log, i) => <li key={i}>{log}</li>)}</ul>
              </>
            }
          />
          <ExampleBlock
            number={2}
            title="마운트 시 1회 — 화면 로드 시 API 호출 시뮬레이션"
            desc="의존 배열 []를 쓰면 컴포넌트가 처음 나타날 때 딱 1번만 실행됩니다. B001 화면 로드 시 필터 옵션을 불러오는 것과 같습니다."
            whenToUse="페이지 첫 로드 시 초기 데이터 조회"
            b001Ref="useSearch.js의 useEffect(() => { init(); }, []) — 화면 로드 시 부서/팀/카테고리 옵션 API 호출"
            code={`useEffect(() => {
  const init = async () => {
    setLoading(true);
    const deptList = await loadDepartments(week);  // API 호출
    setDepartments(deptList);
    setLoading(false);
  };
  init();
}, []);  // [] = 최초 1회만`}
            demo={
              <>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setMountMsg("API 로드 중...");
                    setTimeout(() => setMountMsg("부서 목록 3건 로드 완료! (영업부, 개발부, 인사부)"), 800);
                  }}
                >
                  API 로드 시뮬레이션
                </button>
                <p className="study-result">{mountMsg || "버튼을 눌러 마운트 시 API 호출을 체험하세요."}</p>
              </>
            }
          />
          <ExampleBlock
            number={3}
            title="cleanup — 타이머/구독 해제"
            desc="useEffect가 return하는 함수는 '정리(cleanup)' 함수입니다. 컴포넌트가 사라지거나, effect가 다시 실행되기 전에 호출됩니다."
            whenToUse="setInterval, WebSocket, 이벤트 리스너 등록 후 해제할 때"
            b001Ref="직접 사용하진 않지만, 모달 닫을 때 타이머 정리 등에 동일 패턴 사용"
            code={`useEffect(() => {
  const timer = setInterval(() => {
    setTimerSec((s) => s + 1);
  }, 1000);

  return () => clearInterval(timer);  // cleanup: 타이머 해제
}, []);`}
            demo={
              <p className="study-result">이 페이지에 머문 시간: {timerSec}초 (1초마다 자동 증가)</p>
            }
          />
        </MultiSection>
      );

    case "useCallback":
      return (
        <MultiSection
          title="useCallback"
          overview="useCallback은 함수를 '기억(메모이제이션)'해 둡니다. 부모가 리렌더링돼도 같은 함수 참조를 유지해, 불필요한 자식 리렌더링을 줄일 수 있습니다."
        >
          <ExampleBlock
            number={1}
            title="기본 — 함수를 한 번 만들고 재사용"
            desc="double 함수는 cbNum이 바뀌어도 함수 자체는 재생성되지 않습니다 (의존 배열 [])."
            whenToUse="자식 컴포넌트에 함수를 props로 넘길 때"
            b001Ref="useSearch.js의 loadDepartments, loadSections — useCallback으로 감싸져 있음"
            code={`const double = useCallback((n) => n * 2, []);
//                              ↑ 함수 내용    ↑ 의존 배열 (비어있으면 절대 재생성 안 함)

double(5)  // 10
double(cbNum)`}
            demo={
              <>
                <button className="btn btn-primary" onClick={() => setCbNum((n) => n + 1)}>cbNum 증가 ({cbNum})</button>
                <p className="study-result">double({cbNum}) = {double(cbNum)}</p>
              </>
            }
          />
          <ExampleBlock
            number={2}
            title="의존 배열이 있을 때 — filters.week가 바뀌면 함수 재생성"
            desc="의존 값이 바뀌면 새 함수가 만들어집니다. B001에서는 week가 바뀔 때 부서 조회 로직이 달라지는 것과 유사합니다."
            whenToUse="함수 안에서 외부 state를 참조하고, 그 state가 바뀌면 함수도 새로 만들어야 할 때"
            b001Ref="useGrid.js의 search — useCallback(async (params) => {...}, [])"
            code={`const loadByWeek = useCallback(async (week) => {
  return await fetchGridDepartments({ week });
}, []);  // week는 인자로 받으므로 의존 배열 비워도 됨

// state를 직접 참조하면 의존 배열에 넣어야 함
const handleDept = useCallback(() => {
  loadSections(filters.week, filters.departmentCode);
}, [filters.week, filters.departmentCode]);`}
            demo={
              <button className="btn btn-secondary" onClick={() => setCbRenderCount((c) => c + 1)}>
                부모 강제 리렌더링 ({cbRenderCount}회) — double 함수는 그대로 유지
              </button>
            }
          />
          <ExampleBlock
            number={3}
            title="useCallback 없이 vs 있을 때 차이 (개념)"
            desc="매 렌더링마다 새 함수가 만들어지면, React.memo로 감싼 자식도 props가 '바뀐 것'으로 인식해 불필요하게 리렌더링됩니다."
            whenToUse="성능 최적화가 필요한 큰 목록, 자주 리렌더링되는 부모"
            code={`// ❌ 매번 새 함수 생성
const handleClick = () => { doSomething(); };

// ✅ 같은 함수 참조 유지
const handleClick = useCallback(() => {
  doSomething();
}, []);`}
            demo={<p className="study-tip">B001의 handleDepartmentChange, resetFilters 등이 useSearch 훅 안에서 정의되어 SearchPanel에 props로 전달됩니다.</p>}
          />
        </MultiSection>
      );

    case "useMemo":
      return (
        <MultiSection
          title="useMemo"
          overview="useMemo는 '계산 결과'를 기억해 둡니다. 의존 값이 바뀔 때만 다시 계산하고, 그 외에는 이전 결과를 재사용합니다."
        >
          <ExampleBlock
            number={1}
            title="배열 정렬 결과 캐시"
            desc="memoItems가 바뀔 때만 정렬을 다시 합니다. 부모가 다른 이유로 리렌더링돼도 memoItems가 같으면 정렬 생략."
            whenToUse="정렬, 필터링, 합계 등 계산 비용이 큰 작업"
            b001Ref="GridPanel.jsx의 columnDefs — useMemo(() => [...], []) 로 컬럼 정의 1회만 생성"
            code={`const sortedMemo = useMemo(
  () => [...memoItems].sort((a, b) => a - b),
  [memoItems]   // memoItems가 바뀔 때만 재계산
);`}
            demo={
              <>
                <p>원본 배열: [{memoItems.join(", ")}]</p>
                <p className="study-result">정렬 결과: [{sortedMemo.join(", ")}]</p>
                <button className="btn btn-primary" onClick={() => setMemoItems([...memoItems, Math.floor(Math.random() * 10)])}>
                  랜덤 숫자 추가 (의존 값 변경 → 재계산)
                </button>
              </>
            }
          />
          <ExampleBlock
            number={2}
            title="합계 계산 캐시"
            desc="배열의 합계를 useMemo로 계산합니다. forEach/reduce와 비슷하지만 결과를 캐시합니다."
            whenToUse="그리드 하단 총 건수, 금액 합계 등"
            code={`const total = useMemo(
  () => memoItems.reduce((sum, n) => sum + n, 0),
  [memoItems]
);`}
            demo={<p className="study-result">배열 합계: {memoSum}</p>}
          />
          <ExampleBlock
            number={3}
            title="필터링된 목록 — B001 categoryCodes 패턴"
            desc="전체 users에서 role이 'dev'인 사람만 골라 목록을 만듭니다."
            whenToUse="검색 조건에 맞는 행만 화면에 표시"
            b001Ref="useSearch.js getSearchParams() — filters.categoryCodes.join(',') 로 API에 전달"
            code={`const devUsers = useMemo(
  () => users.filter((u) => u.role === "dev"),
  [users]
);`}
            demo={
              <ul>{ctx.users.filter((u) => u.role === "dev").map((u) => <li key={u.id}>{u.name}</li>)}</ul>
            }
            output="dev 역할: 김철수, 박민수"
          />
        </MultiSection>
      );

    case "useRef":
      return (
        <MultiSection
          title="useRef"
          overview="useRef는 두 가지 용도가 있습니다. ① DOM 요소에 직접 접근 ② 리렌더링 없이 값을 저장"
        >
          <ExampleBlock
            number={1}
            title="DOM 접근 — input에 포커스"
            desc="inputRef.current.focus()로 입력창에 커서를 보냅니다. document.getElementById 대신 React 방식."
            whenToUse="포커스 이동, 스크롤 위치, input 값 직접 읽기"
            code={`const inputRef = useRef(null);

<input ref={inputRef} />
<button onClick={() => inputRef.current?.focus()}>
  포커스
</button>`}
            demo={
              <div className="study-btn-row">
                <input ref={inputRef} className="study-input" placeholder="여기로 포커스" />
                <button className="btn btn-primary" onClick={() => inputRef.current?.focus()}>포커스</button>
                <button className="btn btn-secondary" onClick={() => { if (inputRef.current) inputRef.current.value = ""; }}>값 비우기 (DOM 직접)</button>
              </div>
            }
          />
          <ExampleBlock
            number={2}
            title="리렌더링 없이 값 저장"
            desc="ref.current를 바꿔도 화면은 다시 그려지지 않습니다. useState와의 차이를 체험합니다."
            whenToUse="이전 값 기억, 렌더링 횟수 추적, 타이머 ID 저장"
            code={`const renderCountRef = useRef(0);
renderCountRef.current += 1;  // 리렌더링마다 증가 (화면 자동 갱신 X)

const [stateCount, setStateCount] = useState(0);
// setStateCount 호출 시 → 화면 다시 그림`}
            demo={
              <>
                <p>ref 카운트 (리렌더링해도 화면 숫자 안 바뀜): <input className="study-input" value={refInputValue} readOnly /></p>
                <button className="btn btn-primary" onClick={() => { renderCountRef.current += 1; setRefInputValue(String(renderCountRef.current)); }}>
                  ref.current 증가 (setState로 화면 갱신)
                </button>
              </>
            }
          />
          <ExampleBlock
            number={3}
            title="이전 input 값 기억하기"
            desc="마지막으로 입력한 값을 ref에 저장해 두었다가 '이전 값 복원' 버튼으로 되돌립니다."
            whenToUse="폼 임시 저장, undo 기능"
            code={`const prevValueRef = useRef("");
const handleBlur = (e) => {
  prevValueRef.current = e.target.value;
};`}
            demo={
              <>
                <input className="study-input" defaultValue="테스트" onBlur={(e) => ctx.setPrevInputRef(e.target.value)} />
                <p className="study-result">blur 시 저장된 이전 값: {ctx.prevInputRef || "(아직 없음)"}</p>
              </>
            }
          />
        </MultiSection>
      );

    case "useContext":
      return (
        <MultiSection
          title="useContext"
          overview="useContext는 props drilling(여러 단계로 props 전달) 없이, 상위에서 만든 값을 하위 컴포넌트가 바로 읽게 합니다."
        >
          <ExampleBlock
            number={1}
            title="테마 공유 — Provider / Consumer"
            desc="ThemeContext.Provider가 value를 제공하고, 하위 ThemeDisplay가 useContext로 읽습니다."
            whenToUse="테마, 언어 설정, 로그인 사용자 정보 등 앱 전역 설정"
            code={`const ThemeContext = createContext("light");

// 상위: 값 제공
<ThemeContext.Provider value={theme}>
  <ThemeDisplay />
</ThemeContext.Provider>

// 하위: 값 읽기
const theme = useContext(ThemeContext);`}
            demo={
              <ThemeContext.Provider value={theme}>
                <button className="btn btn-primary" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
                  테마 전환 (현재: {theme})
                </button>
                <p><ThemeDisplay /></p>
              </ThemeContext.Provider>
            }
          />
          <ExampleBlock
            number={2}
            title="사용자 정보 공유 — B001에서의 대안"
            desc="UserContext로 로그인 사용자 이름을 여러 컴포넌트가 공유합니다. B001은 현재 props로 전달하지만, 규모가 커지면 Context를 씁니다."
            whenToUse="로그인 사용자, 권한, 공통 설정을 여러 화면에서 사용"
            b001Ref="현재 B001은 useSearch 훅 + props 전달. 규모가 커지면 SearchContext로 전환 가능"
            code={`const UserContext = createContext({ name: "게스트" });

<UserContext.Provider value={{ name: "김철수", role: "admin" }}>
  <UserDisplay />  {/* useContext(UserContext) */}
</UserContext.Provider>`}
            demo={
              <UserContext.Provider value={{ name: "김철수", role: "admin" }}>
                <UserDisplay />
              </UserContext.Provider>
            }
          />
        </MultiSection>
      );

    case "useReducer":
      return (
        <MultiSection
          title="useReducer"
          overview="useReducer는 복잡한 state 변경을 'action(명령)' 단위로 관리합니다. useState보다 여러 필드를 한꺼번에 바꿀 때 구조가 명확해집니다."
        >
          <ExampleBlock
            number={1}
            title="카운터 — increment / decrement / reset"
            desc="dispatch({ type: 'increment' })처럼 '무엇을 할지'만 보내고, reducer가 state를 계산합니다."
            whenToUse="상태 변경 규칙이 여러 가지일 때"
            code={`const counterReducer = (state, action) => {
  switch (action.type) {
    case "increment": return { count: state.count + 1 };
    case "decrement": return { count: state.count - 1 };
    case "reset":     return { count: 0 };
    default:          return state;
  }
};

const [state, dispatch] = useReducer(counterReducer, { count: 0 });
dispatch({ type: "increment" });`}
            demo={
              <div className="study-btn-row">
                <span className="study-result">count: {reducerState.count}</span>
                <button className="btn btn-primary" onClick={() => dispatch({ type: "increment" })}>+1</button>
                <button className="btn btn-secondary" onClick={() => dispatch({ type: "decrement" })}>-1</button>
                <button className="btn btn-secondary" onClick={() => dispatch({ type: "reset" })}>리셋</button>
              </div>
            }
          />
          <ExampleBlock
            number={2}
            title="할 일 목록 — 추가 / 완료 토글"
            desc="여러 action(add, toggle)으로 배열 state를 관리합니다. filters + 여러 필드를 한 reducer로 묶는 것과 유사합니다."
            whenToUse="장바구니, 할 일, 다단계 폼"
            b001Ref="useSearch의 setFilters 여러 번 호출하는 로직을 useReducer 하나로 합칠 수 있음"
            code={`dispatch({ type: "ADD_TODO", text: "공부하기" });
dispatch({ type: "TOGGLE_TODO", id: 1 });`}
            demo={
              <>
                <div className="study-btn-row">
                  <input className="study-input" value={todoInput} onChange={(e) => setTodoInput(e.target.value)} placeholder="할 일 입력" />
                  <button className="btn btn-primary" onClick={addTodo}>추가</button>
                </div>
                <ul className="study-todo-list">
                  {todos.map((t) => (
                    <li key={t.id} className={t.done ? "done" : ""}>
                      <label>
                        <input type="checkbox" checked={t.done} onChange={() => toggleTodo(t.id)} />
                        {t.text}
                      </label>
                    </li>
                  ))}
                </ul>
              </>
            }
          />
        </MultiSection>
      );

    default:
      return null;
  }
};
