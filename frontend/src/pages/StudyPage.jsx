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
import { renderHooksSection } from "../study/sections/hooksStudy";
import { renderArraySection } from "../study/sections/arrayStudy";
import { renderEventSection } from "../study/sections/eventStudy";
import { renderAsyncSection } from "../study/sections/asyncStudy";

/* ───────── useContext 데모 ───────── */
const ThemeContext = createContext("light");
const UserContext = createContext({ name: "게스트", role: "user" });

const ThemeDisplay = () => {
  const theme = useContext(ThemeContext);
  return <span>현재 테마: <strong>{theme}</strong></span>;
};

const UserDisplay = () => {
  const user = useContext(UserContext);
  return <span>로그인: <strong>{user.name}</strong> ({user.role})</span>;
};

/* ───────── useReducer: 카운터 ───────── */
const counterReducer = (state, action) => {
  switch (action.type) {
    case "increment": return { count: state.count + 1 };
    case "decrement": return { count: state.count - 1 };
    case "reset": return { count: 0 };
    default: return state;
  }
};

/* ───────── useReducer: 할 일 목록 ───────── */
const todoReducer = (state, action) => {
  switch (action.type) {
    case "ADD":
      return [...state, { id: Date.now(), text: action.text, done: false }];
    case "TOGGLE":
      return state.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t));
    default:
      return state;
  }
};

const STUDY_SECTIONS = [
  { id: "useState", category: "Hooks" },
  { id: "useEffect", category: "Hooks" },
  { id: "useCallback", category: "Hooks" },
  { id: "useMemo", category: "Hooks" },
  { id: "useRef", category: "Hooks" },
  { id: "useContext", category: "Hooks" },
  { id: "useReducer", category: "Hooks" },
  { id: "map", category: "배열" },
  { id: "filter", category: "배열" },
  { id: "find", category: "배열" },
  { id: "forEach", category: "배열" },
  { id: "reduce", category: "배열" },
  { id: "sort", category: "배열" },
  { id: "includes", category: "배열" },
  { id: "objectKeys", category: "객체" },
  { id: "arrayIsArray", category: "객체" },
  { id: "spread", category: "객체" },
  { id: "concat", category: "객체" },
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
  const [userName, setUserName] = useState("김철수");
  const [userAge, setUserAge] = useState(25);
  const [filtersDemo, setFiltersDemo] = useState({
    week: "202625",
    departmentCode: "D01",
    categoryCodes: [],
  });

  /* useEffect */
  const [effectCount, setEffectCount] = useState(0);
  const [effectLog, setEffectLog] = useState([]);
  const [mountMsg, setMountMsg] = useState("");
  const [timerSec, setTimerSec] = useState(0);

  useEffect(() => {
    setEffectLog((prev) => [...prev, `effectCount가 ${effectCount}로 변경됨 (${new Date().toLocaleTimeString()})`]);
  }, [effectCount]);

  useEffect(() => {
    const timer = setInterval(() => setTimerSec((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  /* useCallback / useMemo */
  const [cbNum, setCbNum] = useState(1);
  const [cbRenderCount, setCbRenderCount] = useState(0);
  const [memoItems, setMemoItems] = useState([3, 1, 4, 1, 5]);
  const double = useCallback((n) => n * 2, []);
  const sortedMemo = useMemo(() => [...memoItems].sort((a, b) => a - b), [memoItems]);
  const memoSum = useMemo(() => memoItems.reduce((s, n) => s + n, 0), [memoItems]);

  /* useRef */
  const inputRef = useRef(null);
  const renderCountRef = useRef(0);
  const [refInputValue, setRefInputValue] = useState("0");
  const [prevInputRef, setPrevInputRef] = useState("");

  /* useContext */
  const [theme, setTheme] = useState("light");

  /* useReducer */
  const [reducerState, dispatch] = useReducer(counterReducer, { count: 0 });
  const [todos, todoDispatch] = useReducer(todoReducer, [
    { id: 1, text: "useState 공부", done: true },
    { id: 2, text: "B001 코드 읽기", done: false },
  ]);
  const [todoInput, setTodoInput] = useState("");
  const addTodo = () => {
    if (!todoInput.trim()) return;
    todoDispatch({ type: "ADD", text: todoInput });
    setTodoInput("");
  };
  const toggleTodo = (id) => todoDispatch({ type: "TOGGLE", id });

  /* 배열 메서드 */
  const sampleArr = [10, 25, 8, 42, 17];
  const users = [
    { id: 1, name: "김철수", role: "dev" },
    { id: 2, name: "이영희", role: "design" },
    { id: 3, name: "박민수", role: "dev" },
  ];
  const sampleObj = { name: "React", version: 18, type: "library" };
  const [mapRole, setMapRole] = useState("all");
  const [filterMinPrice, setFilterMinPrice] = useState(100000);

  /* 이벤트 */
  const [inputVal, setInputVal] = useState("");
  const [selectVal, setSelectVal] = useState("D01");
  const [clickCount, setClickCount] = useState(0);
  const [clickDisabledDemo, setClickDisabledDemo] = useState(false);
  const [keyLog, setKeyLog] = useState("");
  const [keyHistory, setKeyHistory] = useState([]);
  const [formMsg, setFormMsg] = useState("");
  const [formName, setFormName] = useState("");
  const [linkMsg, setLinkMsg] = useState("");
  const [checkDemo, setCheckDemo] = useState(false);
  const [checkDemo2, setCheckDemo2] = useState(false);

  /* 비동기 */
  const [asyncResult, setAsyncResult] = useState("");
  const [asyncSteps, setAsyncSteps] = useState([]);
  const [tryResult, setTryResult] = useState("");
  const [promiseResult, setPromiseResult] = useState("");
  const [promiseTiming, setPromiseTiming] = useState("");
  const [fetchResult, setFetchResult] = useState("");
  const [fetchDetail, setFetchDetail] = useState("");

  const studyContext = {
    text, setText, count, setCount,
    userName, setUserName, userAge, setUserAge, filtersDemo, setFiltersDemo,
    effectCount, setEffectCount, effectLog, mountMsg, setMountMsg, timerSec,
    cbNum, setCbNum, double, cbRenderCount, setCbRenderCount,
    memoItems, setMemoItems, sortedMemo, memoSum,
    inputRef, refInputValue, setRefInputValue, renderCountRef, prevInputRef, setPrevInputRef,
    theme, setTheme, ThemeContext, ThemeDisplay, UserContext, UserDisplay,
    reducerState, dispatch, todos, todoInput, setTodoInput, addTodo, toggleTodo,
    sampleArr, users, sampleObj, mapRole, setMapRole, filterMinPrice, setFilterMinPrice,
    inputVal, setInputVal, selectVal, setSelectVal,
    clickCount, setClickCount, clickDisabledDemo, setClickDisabledDemo,
    keyLog, setKeyLog, keyHistory, setKeyHistory,
    formMsg, setFormMsg, formName, setFormName, linkMsg, setLinkMsg,
    checkDemo, setCheckDemo, checkDemo2, setCheckDemo2,
    asyncResult, setAsyncResult, asyncSteps, setAsyncSteps,
    tryResult, setTryResult, promiseResult, setPromiseResult, promiseTiming,
    fetchResult, setFetchResult, fetchDetail, setFetchDetail,
  };

  const renderSection = () => {
    const hooks = renderHooksSection(activeTab, studyContext);
    if (hooks) return hooks;
    const arrays = renderArraySection(activeTab, studyContext);
    if (arrays) return arrays;
    const events = renderEventSection(activeTab, studyContext);
    if (events) return events;
    const asyncSec = renderAsyncSection(activeTab, studyContext);
    if (asyncSec) return asyncSec;
    return null;
  };

  const currentCategory = STUDY_SECTIONS.find((s) => s.id === activeTab)?.category;

  return (
    <div className="page study-page">
      <h1>React 학습 페이지</h1>
      <p className="study-intro">
        각 탭을 클릭하면 <strong>설명 + 예제 2~3개 + 직접 해보기 + 소스 코드</strong>를 확인할 수 있습니다.
        예제마다 <strong>B001 실제 코드</strong>와 연결된 부분도 표시했습니다.
        B001 소스: <code>pages/B001Page.jsx</code>, <code>hooks/useSearch.js</code>, <code>components/SearchPanel.jsx</code>
      </p>

      <div className="study-category">현재 분류: <strong>{currentCategory}</strong></div>

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

export default StudyPage;
