import { MultiSection, ExampleBlock } from "../StudyLayout";

const PRODUCTS = [
  { id: 1, name: "노트북", price: 1200000, category: "전자" },
  { id: 2, name: "마우스", price: 35000, category: "전자" },
  { id: 3, name: "책상", price: 180000, category: "가구" },
  { id: 4, name: "의자", price: 95000, category: "가구" },
  { id: 5, name: "모니터", price: 420000, category: "전자" },
];

/** 배열·객체 메서드 학습 섹션 */
export const renderArraySection = (tab, ctx) => {
  const { sampleArr, users, sampleObj, mapRole, setMapRole, filterMinPrice, setFilterMinPrice } = ctx;

  switch (tab) {
    case "map":
      return (
        <MultiSection
          title="map"
          overview="map은 배열의 각 요소를 변환해 '새 배열'을 만듭니다. 원본 배열은 바뀌지 않습니다. React에서 목록(리스트, 그리드 행, select option)을 그릴 때 가장 많이 씁니다."
        >
          <ExampleBlock
            number={1}
            title="기본 — 이름 목록을 li로 변환"
            desc="users 배열의 각 user를 <li> JSX로 바꿔 화면에 렌더링합니다."
            whenToUse="API에서 받은 목록을 화면에 표시"
            b001Ref="SearchPanel.jsx — departments.map((item) => <option key={item.code}>...</option>)"
            code={`users.map((user) => (
  <li key={user.id}>{user.name}</li>
))`}
            demo={<ul>{users.map((u) => <li key={u.id}>{u.name} ({u.role})</li>)}</ul>}
          />
          <ExampleBlock
            number={2}
            title="객체 배열 → 다른 형태로 변환"
            desc="user 객체에서 name만 뽑아 문자열 배열을 만듭니다."
            whenToUse="표시용 데이터 가공, 드롭다운 label 만들기"
            code={`const names = users.map((u) => u.name);
// ["김철수", "이영희", "박민수"]

const options = users.map((u) => ({
  value: u.id,
  label: u.name,
}));`}
            demo={<p className="study-result">이름만 추출: [{users.map((u) => u.name).join(", ")}]</p>}
          />
          <ExampleBlock
            number={3}
            title="index(인덱스) 활용 — 번호 매기기"
            desc="map의 두 번째 인자 index로 1, 2, 3... 번호를 붙입니다."
            whenToUse="순번 컬럼, 순위 표시"
            code={`users.map((user, index) => (
  <tr key={user.id}>
    <td>{index + 1}</td>
    <td>{user.name}</td>
  </tr>
))`}
            demo={
              <table className="study-table">
                <thead><tr><th>번호</th><th>이름</th><th>역할</th></tr></thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u.id}><td>{i + 1}</td><td>{u.name}</td><td>{u.role}</td></tr>
                  ))}
                </tbody>
              </table>
            }
          />
        </MultiSection>
      );

    case "filter":
      return (
        <MultiSection
          title="filter"
          overview="filter는 조건에 맞는 요소만 골라 '새 배열'을 만듭니다. 조건 함수가 true를 반환하는 요소만 남습니다."
        >
          <ExampleBlock
            number={1}
            title="role이 dev인 사용자만"
            desc="users.filter(u => u.role === 'dev')"
            whenToUse="검색 조건, 카테고리 필터"
            b001Ref="useSearch — categoryCodes에 선택된 코드만 API에 전달 후 서버에서 필터링"
            code={`const devUsers = users.filter((u) => u.role === "dev");
// [{ id:1, name:"김철수", role:"dev" }, { id:3, ... }]`}
            demo={
              <>
                <select className="study-input" value={mapRole} onChange={(e) => setMapRole(e.target.value)}>
                  <option value="all">전체</option>
                  <option value="dev">dev</option>
                  <option value="design">design</option>
                </select>
                <ul>
                  {(mapRole === "all" ? users : users.filter((u) => u.role === mapRole)).map((u) => (
                    <li key={u.id}>{u.name}</li>
                  ))}
                </ul>
              </>
            }
          />
          <ExampleBlock
            number={2}
            title="가격이 N원 이상인 상품"
            desc="숫자 비교 조건으로 필터링합니다."
            whenToUse="금액 범위, 날짜 범위 검색"
            code={`products.filter((p) => p.price >= 100000);`}
            demo={
              <>
                <label>최소 가격: </label>
                <input className="study-input" type="number" value={filterMinPrice} onChange={(e) => setFilterMinPrice(Number(e.target.value))} />
                <ul>
                  {PRODUCTS.filter((p) => p.price >= filterMinPrice).map((p) => (
                    <li key={p.id}>{p.name} — {p.price.toLocaleString()}원</li>
                  ))}
                </ul>
              </>
            }
          />
          <ExampleBlock
            number={3}
            title="filter + includes — 다중 선택 (B001 categoryCodes)"
            desc="선택된 카테고리 코드 배열에 포함된 상품만 표시합니다."
            whenToUse="체크박스 다중 필터"
            b001Ref="SearchPanel handleCategoryToggle — categoryCodes 배열에 code 추가/제거"
            code={`const selected = ["C01", "C02"];
items.filter((item) => selected.includes(item.code));`}
            demo={
              <p className="study-result">
                전자 제품: {PRODUCTS.filter((p) => p.category === "전자").map((p) => p.name).join(", ")}
              </p>
            }
          />
        </MultiSection>
      );

    case "find":
      return (
        <MultiSection
          title="find"
          overview="find는 조건에 맞는 '첫 번째 요소 하나'만 반환합니다. 없으면 undefined입니다."
        >
          <ExampleBlock
            number={1}
            title="id로 사용자 1명 찾기"
            desc="users.find(u => u.id === 2)"
            whenToUse="선택한 행 상세 보기, 코드로 이름 찾기"
            b001Ref="departments[0]?.code — 첫 번째 부서 코드 자동 선택"
            code={`const user = users.find((u) => u.id === 2);
// { id: 2, name: "이영희", role: "design" }`}
            demo={<p className="study-result">id=2: {JSON.stringify(users.find((u) => u.id === 2))}</p>}
          />
          <ExampleBlock
            number={2}
            title="코드로 부서 이름 찾기 (B001 패턴)"
            desc="departmentCode 'D01'에 해당하는 부서 객체를 찾습니다."
            whenToUse="코드 → 이름 변환, 선택값 표시"
            code={`const dept = departments.find((d) => d.code === filters.departmentCode);
const deptName = dept?.name ?? "";`}
            demo={
              <p className="study-result">
                D01 찾기: {JSON.stringify({ code: "D01", name: "영업부" })}
              </p>
            }
          />
          <ExampleBlock
            number={3}
            title="find vs filter 차이"
            desc="find는 1개, filter는 여러 개. find는 못 찾으면 undefined."
            code={`users.find(u => u.role === "dev")    // 객체 1개
users.filter(u => u.role === "dev")  // 배열`}
            demo={
              <ul>
                <li>find dev: {users.find((u) => u.role === "dev")?.name}</li>
                <li>filter dev: {users.filter((u) => u.role === "dev").map((u) => u.name).join(", ")}</li>
              </ul>
            }
          />
        </MultiSection>
      );

    case "forEach":
      return (
        <MultiSection
          title="forEach"
          overview="forEach는 배열 각 요소에 대해 함수를 실행합니다. 반환값이 없습니다(undefined). map과 달리 '새 배열'을 만들지 않습니다."
        >
          <ExampleBlock
            number={1}
            title="합계 구하기"
            desc="각 숫자를 순회하며 sum에 더합니다."
            whenToUse="단순 반복 작업, 로그 출력, DOM 조작"
            code={`let sum = 0;
sampleArr.forEach((n) => { sum += n; });
// sum === 102`}
            demo={
              <p className="study-result">
                [{sampleArr.join(", ")}] 합계: {(() => { let s = 0; sampleArr.forEach((n) => { s += n; }); return s; })()}
              </p>
            }
          />
          <ExampleBlock
            number={2}
            title="이름만 콘솔에 출력 (부수 효과)"
            desc="forEach는 값을 반환하지 않고 '실행'만 합니다."
            code={`users.forEach((u) => {
  console.log(u.name);
});`}
            demo={
              <button className="btn btn-primary" onClick={() => {
                const logs = [];
                users.forEach((u) => logs.push(u.name));
                alert("forEach 결과:\n" + logs.join("\n"));
              }}>
                forEach로 이름 alert
              </button>
            }
          />
          <ExampleBlock
            number={3}
            title="forEach vs map — 언제 뭘 쓰나"
            desc="새 배열이 필요하면 map, 반복 실행만 하면 forEach. 합계는 reduce가 더 적합."
            code={`// map → 새 배열 반환
const names = users.map(u => u.name);

// forEach → 반환 없음
users.forEach(u => console.log(u.name));`}
            demo={<p className="study-tip">B001 그리드 목록은 map으로 rowData를 AgGridReact에 전달합니다.</p>}
          />
        </MultiSection>
      );

    case "reduce":
      return (
        <MultiSection
          title="reduce"
          overview="reduce는 배열을 '하나의 값'으로 줄입니다. 합계, 최댓값, 그룹핑, 객체 변환에 강력합니다."
        >
          <ExampleBlock
            number={1}
            title="숫자 합계"
            desc="acc(누적값)에 각 요소를 더해 최종 합계를 만듭니다."
            whenToUse="총 금액, 총 건수"
            code={`sampleArr.reduce((acc, n) => acc + n, 0);
// 0은 시작값(initial value)`}
            demo={<p className="study-result">합계: {sampleArr.reduce((acc, n) => acc + n, 0)}</p>}
          />
          <ExampleBlock
            number={2}
            title="최댓값 찾기"
            desc="reduce로 max를 구합니다."
            code={`sampleArr.reduce((max, n) => (n > max ? n : max), 0);`}
            demo={<p className="study-result">최댓값: {sampleArr.reduce((max, n) => (n > max ? n : max), 0)}</p>}
          />
          <ExampleBlock
            number={3}
            title="배열 → 객체 변환 (코드 맵)"
            desc="부서 목록을 { D01: '영업부', D02: '개발부' } 형태로 변환합니다."
            whenToUse="코드로 이름 빠르게 찾기"
            b001Ref="백엔드 mapDepartmentName과 비슷한 프론트 변환"
            code={`departments.reduce((obj, d) => {
  obj[d.code] = d.name;
  return obj;
}, {});`}
            demo={
              <p className="study-result">
                {JSON.stringify(users.reduce((o, u) => ({ ...o, [u.id]: u.name }), {}))}
              </p>
            }
          />
        </MultiSection>
      );

    case "sort":
      return (
        <MultiSection
          title="sort"
          overview="sort는 배열을 정렬합니다. ⚠️ 원본 배열을 직접 변경하므로 [...arr].sort()처럼 복사본에서 사용하세요."
        >
          <ExampleBlock
            number={1}
            title="숫자 오름차순"
            desc="(a, b) => a - b"
            code={`[...sampleArr].sort((a, b) => a - b);`}
            demo={<p className="study-result">오름차순: {[...sampleArr].sort((a, b) => a - b).join(", ")}</p>}
          />
          <ExampleBlock
            number={2}
            title="숫자 내림차순"
            desc="(a, b) => b - a"
            code={`[...sampleArr].sort((a, b) => b - a);`}
            demo={<p className="study-result">내림차순: {[...sampleArr].sort((a, b) => b - a).join(", ")}</p>}
          />
          <ExampleBlock
            number={3}
            title="이름 가나다순"
            desc="문자열은 localeCompare 사용"
            code={`[...users].sort((a, b) => a.name.localeCompare(b.name));`}
            demo={
              <p className="study-result">
                이름순: {[...users].sort((a, b) => a.name.localeCompare(b.name)).map((u) => u.name).join(", ")}
              </p>
            }
          />
        </MultiSection>
      );

    case "includes":
      return (
        <MultiSection
          title="includes"
          overview="includes는 배열에 특정 값이 들어있는지 true/false로 확인합니다. 문자열에도 사용 가능합니다."
        >
          <ExampleBlock
            number={1}
            title="숫자 포함 여부"
            desc="sampleArr.includes(42) → true"
            code={`sampleArr.includes(42);  // true
sampleArr.includes(99);  // false`}
            demo={
              <p className="study-result">
                42 포함? {String(sampleArr.includes(42))} / 99 포함? {String(sampleArr.includes(99))}
              </p>
            }
          />
          <ExampleBlock
            number={2}
            title="체크박스 선택 확인 (B001 typeCodes)"
            desc="typeCodes 배열에 'T01'이 선택되어 있는지 확인합니다."
            whenToUse="다중 선택 필터, 권한 체크"
            b001Ref="SearchPanel — filters.typeCodes.includes(item.code) 로 체크 여부 표시"
            code={`const typeCodes = ["T01", "T03"];
typeCodes.includes("T01");  // true
typeCodes.includes("T02");  // false`}
            demo={
              <>
                <p>선택된 코드: ["T01", "T03"]</p>
                <p>T01 포함? {String(["T01", "T03"].includes("T01"))}</p>
                <p>T02 포함? {String(["T01", "T03"].includes("T02"))}</p>
              </>
            }
          />
          <ExampleBlock
            number={3}
            title="includes로 토글 (추가/제거)"
            desc="이미 있으면 제거, 없으면 추가 — handleCategoryToggle 패턴"
            b001Ref="SearchPanel.jsx handleCategoryToggle, handleTypeToggle"
            code={`const toggle = (codes, code) =>
  codes.includes(code)
    ? codes.filter((c) => c !== code)
    : [...codes, code];`}
            demo={<p className="study-tip">리셋 시 categoryCodes: [], typeCodes: [] 로 빈 배열 초기화</p>}
          />
        </MultiSection>
      );

    case "objectKeys":
      return (
        <MultiSection
          title="Object.keys"
          overview="Object.keys(객체)는 객체의 키(속성 이름)만 모은 배열을 반환합니다."
        >
          <ExampleBlock
            number={1}
            title="기본 — 키 목록"
            desc='Object.keys({ name: "React", version: 18 }) → ["name", "version"]'
            code={`Object.keys(sampleObj);
// ["name", "version", "type"]`}
            demo={<p className="study-result">키: {Object.keys(sampleObj).join(", ")}</p>}
          />
          <ExampleBlock
            number={2}
            title="keys로 객체 순회"
            desc="키 배열을 map으로 돌며 값도 함께 표시"
            code={`Object.keys(sampleObj).map((key) => (
  <p key={key}>{key}: {sampleObj[key]}</p>
));`}
            demo={
              <ul>
                {Object.keys(sampleObj).map((key) => (
                  <li key={key}><strong>{key}</strong>: {String(sampleObj[key])}</li>
                ))}
              </ul>
            }
          />
          <ExampleBlock
            number={3}
            title="filters 객체 키 나열 (B001)"
            desc="getSearchParams에 쓰이는 filters의 모든 필드명 확인"
            b001Ref="useSearch.js filters — week, departmentCode, sectionCode, categoryCodes, statusCode, typeCodes"
            code={`Object.keys(filters);
// ["week", "departmentCode", "sectionCode", ...]`}
            demo={
              <p className="study-result">
                filters 키: week, departmentCode, sectionCode, categoryCodes, statusCode, typeCodes
              </p>
            }
          />
        </MultiSection>
      );

    case "arrayIsArray":
      return (
        <MultiSection
          title="Array.isArray"
          overview="값이 배열인지 확인합니다. typeof []는 'object'라서 배열 구분에 Array.isArray를 씁니다."
        >
          <ExampleBlock
            number={1}
            title="배열 vs 문자열 vs 객체"
            code={`Array.isArray([1, 2, 3]);  // true
Array.isArray("hello");       // false
Array.isArray({ a: 1 });       // false`}
            demo={
              <ul>
                <li>[1,2,3]: {String(Array.isArray([1, 2, 3]))}</li>
                <li>"hello": {String(Array.isArray("hello"))}</li>
                <li>{'{ a:1 }'}: {String(Array.isArray({ a: 1 }))}</li>
              </ul>
            }
          />
          <ExampleBlock
            number={2}
            title="API 응답 검증"
            desc="data가 배열인지 확인 후 map 사용 — 안전한 코드"
            whenToUse="API 응답이 배열이 아닐 수 있을 때 방어 코드"
            b001Ref="useGrid — setRowData(response?.data ?? [])"
            code={`const list = res?.data ?? [];
if (Array.isArray(list)) {
  list.map(...);
}`}
            demo={<p className="study-result">users는 배열? {String(Array.isArray(users))}</p>}
          />
          <ExampleBlock
            number={3}
            title="categoryCodes가 배열인지 확인"
            desc="다중 선택 값은 반드시 배열. 문자열이면 includes/map 오류 발생"
            code={`Array.isArray(filters.categoryCodes);  // true
// join(",")은 배열일 때만`}
            demo={<p className="study-tip">getSearchParams에서 categoryCodes.join(',') — 배열이어야 함</p>}
          />
        </MultiSection>
      );

    case "spread":
      return (
        <MultiSection
          title="spread (...)"
          overview="spread는 배열·객체를 '펼쳐서' 복사하거나 합칩니다. React state 업데이트의 핵심 문법입니다."
        >
          <ExampleBlock
            number={1}
            title="배열 복사 + 요소 추가"
            desc="[...arr, 새값] — 원본 유지, 끝에 추가"
            code={`const next = [...sampleArr, 100];
// [10, 25, 8, 42, 17, 100]`}
            demo={<p className="study-result">추가 후: {[...sampleArr, 100].join(", ")}</p>}
          />
          <ExampleBlock
            number={2}
            title="객체 복사 + 필드 수정 (B001 filters)"
            desc="setFilters((prev) => ({ ...prev, week: newWeek }))"
            whenToUse="useState 객체/배열 업데이트 시 필수"
            b001Ref="useSearch.js — setFilters((prev) => ({ ...prev, sectionCode }))"
            code={`setFilters((prev) => ({
  ...prev,
  departmentCode: "D02",
}));`}
            demo={
              <p className="study-result">
                수정 전: {JSON.stringify({ week: "202625", dept: "D01" })} →
                수정 후: {JSON.stringify({ ...{ week: "202625", dept: "D01" }, dept: "D02" })}
              </p>
            }
          />
          <ExampleBlock
            number={3}
            title="배열에서 항목 제거 (filter + spread)"
            desc="categoryCodes에서 code 하나 빼기"
            b001Ref="handleCategoryToggle — filter로 제거, [...arr, code]로 추가"
            code={`const remove = (arr, code) => arr.filter((c) => c !== code);
const add = (arr, code) => [...arr, code];`}
            demo={
              <p className="study-result">
                ["C01","C02","C03"]에서 C02 제거 → {JSON.stringify(["C01", "C02", "C03"].filter((c) => c !== "C02"))}
              </p>
            }
          />
        </MultiSection>
      );

    case "concat":
      return (
        <MultiSection
          title="concat"
          overview="concat은 배열을 이어 붙여 '새 배열'을 만듭니다. [...a, ...b]와 비슷하지만 concat은 메서드 체이닝이 가능합니다."
        >
          <ExampleBlock
            number={1}
            title="두 배열 합치기"
            code={`sampleArr.concat([100, 200]);`}
            demo={<p className="study-result">{sampleArr.concat([100, 200]).join(", ")}</p>}
          />
          <ExampleBlock
            number={2}
            title="concat vs spread"
            desc="결과는 같음. spread가 더 많이 씀"
            code={`arr1.concat(arr2);
[...arr1, ...arr2];`}
            demo={
              <p className="study-result">
                concat: {sampleArr.concat([1, 2]).join(", ")} | spread: {[...sampleArr, 1, 2].join(", ")}
              </p>
            }
          />
          <ExampleBlock
            number={3}
            title="effectLog에 로그 추가"
            desc="useEffect에서 이전 로그 + 새 로그"
            b001Ref="useSearch useEffect — setEffectLog(prev => [...prev, newLog])"
            code={`setEffectLog((prev) => [...prev, "새 로그"]);
// concat: setEffectLog(prev => prev.concat(["새 로그"]))`}
            demo={<p className="study-tip">React에서는 [...prev, item] 패턴이 더 흔합니다.</p>}
          />
        </MultiSection>
      );

    default:
      return null;
  }
};
