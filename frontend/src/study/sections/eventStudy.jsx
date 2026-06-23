import { MultiSection, ExampleBlock } from "../StudyLayout";

/** 이벤트 학습 섹션 */
export const renderEventSection = (tab, ctx) => {
  const {
    inputVal, setInputVal,
    selectVal, setSelectVal,
    clickCount, setClickCount,
    keyLog, setKeyLog, keyHistory, setKeyHistory,
    formMsg, setFormMsg, formName, setFormName,
    linkMsg, setLinkMsg,
  } = ctx;

  switch (tab) {
    case "onChange":
      return (
        <MultiSection
          title="onChange"
          overview="onChange는 input, select, textarea 등의 '값이 바뀔 때' 실행됩니다. React에서는 거의 항상 setState와 함께 씁니다."
        >
          <ExampleBlock
            number={1}
            title="text input — 글자 입력"
            desc="한 글자 칠 때마다 onChange 실행 → setInputVal → 화면 갱신"
            b001Ref="SearchPanel handleDateChange — date input onChange"
            code={`<input
  value={inputVal}
  onChange={(e) => setInputVal(e.target.value)}
/>`}
            demo={
              <>
                <input className="study-input" value={inputVal} onChange={(e) => setInputVal(e.target.value)} placeholder="입력해보세요" />
                <p>현재 값: <strong>{inputVal}</strong> (길이: {inputVal.length})</p>
              </>
            }
          />
          <ExampleBlock
            number={2}
            title="select — 드롭다운 선택"
            desc="셀렉트박스에서 option을 고르면 onChange 발생"
            b001Ref="SearchPanel — onDepartmentChange(e.target.value)"
            code={`<select
  value={selectVal}
  onChange={(e) => setSelectVal(e.target.value)}
>
  <option value="D01">영업부</option>
  <option value="D02">개발부</option>
</select>`}
            demo={
              <>
                <select className="study-input" value={selectVal} onChange={(e) => setSelectVal(e.target.value)}>
                  <option value="D01">영업부 (D01)</option>
                  <option value="D02">개발부 (D02)</option>
                  <option value="D03">인사부 (D03)</option>
                </select>
                <p className="study-result">선택된 코드: {selectVal}</p>
              </>
            }
          />
          <ExampleBlock
            number={3}
            title="checkbox — 체크/해제"
            desc="체크박스는 checked와 onChange를 함께 사용"
            b001Ref="SearchPanel handleTypeToggle, filters.typeCodes.includes(code)"
            code={`<input
  type="checkbox"
  checked={typeCodes.includes("T01")}
  onChange={() => handleTypeToggle("T01")}
/>`}
            demo={
              <label>
                <input type="checkbox" checked={ctx.checkDemo} onChange={(e) => ctx.setCheckDemo(e.target.checked)} />
                유형A (T01) 선택: {String(ctx.checkDemo)}
              </label>
            }
          />
        </MultiSection>
      );

    case "onClick":
      return (
        <MultiSection
          title="onClick"
          overview="onClick은 버튼, div 등을 '클릭했을 때' 실행됩니다. B001의 조회/리셋 버튼이 대표 예시입니다."
        >
          <ExampleBlock
            number={1}
            title="카운터 — 클릭할 때마다 +1"
            code={`<button onClick={() => setClickCount((c) => c + 1)}>
  클릭: {clickCount}
</button>`}
            demo={
              <button className="btn btn-primary" onClick={() => setClickCount((c) => c + 1)}>
                클릭 횟수: {clickCount}
              </button>
            }
          />
          <ExampleBlock
            number={2}
            title="조회 버튼 — async 함수 연결"
            desc="onClick에 async 함수를 연결해 API 호출"
            b001Ref="SearchPanel onClick={onSearch} → B001Page handleSearch → search(getSearchParams())"
            code={`<button onClick={handleSearch}>조회</button>

const handleSearch = async () => {
  await search(getSearchParams());
};`}
            demo={
              <button className="btn btn-primary" onClick={() => alert("조회 버튼 클릭! → handleSearch → API 호출")}>
                조회 시뮬레이션
              </button>
            }
          />
          <ExampleBlock
            number={3}
            title="disabled — 로딩 중 클릭 막기"
            desc="loading이 true면 버튼 비활성"
            b001Ref="SearchPanel — disabled={loading || gridLoading}"
            code={`<button onClick={onSearch} disabled={loading || gridLoading}>
  조회
</button>`}
            demo={
              <>
                <button className="btn btn-secondary" disabled={ctx.clickDisabledDemo} onClick={() => alert("클릭됨")}>
                  {ctx.clickDisabledDemo ? "비활성 (클릭 불가)" : "활성"}
                </button>
                <button className="btn btn-primary" onClick={() => ctx.setClickDisabledDemo((d) => !d)}>disabled 토글</button>
              </>
            }
          />
        </MultiSection>
      );

    case "onKeyDown":
      return (
        <MultiSection
          title="onKeyDown"
          overview="onKeyDown은 키보드 키를 '눌렀을 때' 실행됩니다. Enter로 조회, Esc로 닫기 등에 사용합니다."
        >
          <ExampleBlock
            number={1}
            title="누른 키 이름 표시"
            desc="e.key로 'Enter', 'a', 'ArrowDown' 등 확인"
            code={`<input onKeyDown={(e) => setKeyLog(e.key)} />`}
            demo={
              <>
                <input className="study-input" placeholder="키를 눌러보세요" onKeyDown={(e) => setKeyLog(`키: ${e.key} (코드: ${e.code})`)} />
                <p className="study-result">{keyLog || "아직 입력 없음"}</p>
              </>
            }
          />
          <ExampleBlock
            number={2}
            title="Enter 키로 검색 실행"
            desc="e.key === 'Enter' 일 때만 조회"
            whenToUse="검색창에서 Enter로 조회"
            code={`<input
  onKeyDown={(e) => {
    if (e.key === "Enter") handleSearch();
  }}
/>`}
            demo={
              <>
                <input
                  className="study-input"
                  placeholder="Enter 누르면 기록"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setKeyHistory((prev) => [...prev, `Enter로 검색: "${e.target.value}"`]);
                    }
                  }}
                />
                <ul>{keyHistory.map((h, i) => <li key={i}>{h}</li>)}</ul>
              </>
            }
          />
          <ExampleBlock
            number={3}
            title="e.key vs e.code"
            desc="key는 문자('a'), code는 물리 키('KeyA')"
            code={`onKeyDown={(e) => {
  console.log(e.key);   // "a"
  console.log(e.code);  // "KeyA"
}}`}
            demo={<p className="study-tip">한/영 전환해도 code는 KeyA로 동일할 수 있음</p>}
          />
        </MultiSection>
      );

    case "targetValue":
      return (
        <MultiSection
          title="e.target.value"
          overview="이벤트 객체 e의 target은 이벤트가 발생한 DOM 요소이고, value는 그 요소의 현재 값입니다."
        >
          <ExampleBlock
            number={1}
            title="input에서 값 읽기"
            code={`onChange={(e) => {
  console.log(e.target.value);
  setInputVal(e.target.value);
}}`}
            demo={
              <>
                <input className="study-input" onChange={(e) => setInputVal(e.target.value)} placeholder="입력" />
                <p className="study-result">e.target.value = "{inputVal}"</p>
              </>
            }
          />
          <ExampleBlock
            number={2}
            title="select에서 코드 읽기"
            b001Ref="onDepartmentChange(e.target.value) — 선택된 option의 value(코드)"
            code={`onChange={(e) => onDepartmentChange(e.target.value)}
// e.target.value === "D01"`}
            demo={
              <select className="study-input" onChange={(e) => setSelectVal(e.target.value)}>
                <option value="D01">영업부</option>
                <option value="D02">개발부</option>
              </select>
            }
            output={`선택 코드: ${selectVal}`}
          />
          <ExampleBlock
            number={3}
            title="checkbox — e.target.checked"
            desc="체크박스는 value가 아니라 checked 사용"
            code={`onChange={(e) => setChecked(e.target.checked)}
// e.target.checked === true / false`}
            demo={
              <label>
                <input type="checkbox" onChange={(e) => ctx.setCheckDemo2(e.target.checked)} />
                checked: {String(ctx.checkDemo2)}
              </label>
            }
          />
        </MultiSection>
      );

    case "preventDefault":
      return (
        <MultiSection
          title="e.preventDefault()"
          overview="브라우저의 '기본 동작'을 막습니다. 폼 제출 시 페이지 새로고침, a태그 클릭 시 이동 등을 막을 때 씁니다."
        >
          <ExampleBlock
            number={1}
            title="form submit — 페이지 새로고침 막기"
            desc="preventDefault 없으면 form 제출 시 페이지가 새로고침됨"
            code={`<form onSubmit={(e) => {
  e.preventDefault();
  setFormMsg("제출 처리 완료 (새로고침 없음)");
}}>
  <button type="submit">제출</button>
</form>`}
            demo={
              <form onSubmit={(e) => { e.preventDefault(); setFormMsg(`제출됨! 이름: ${formName}`); }}>
                <input className="study-input" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="이름" />
                <button type="submit" className="btn btn-primary">제출</button>
                {formMsg && <p className="study-result">{formMsg}</p>}
              </form>
            }
          />
          <ExampleBlock
            number={2}
            title="a 태그 — 링크 이동 막기"
            desc="클릭해도 페이지 이동하지 않고 메시지만 표시"
            code={`<a href="/other" onClick={(e) => {
  e.preventDefault();
  alert("이동 막음");
}}>링크</a>`}
            demo={
              <>
                <a href="https://example.com" className="study-link" onClick={(e) => { e.preventDefault(); setLinkMsg("링크 이동이 preventDefault로 막혔습니다!"); }}>
                  클릭 (이동 안 함)
                </a>
                {linkMsg && <p className="study-result">{linkMsg}</p>}
              </>
            }
          />
          <ExampleBlock
            number={3}
            title="preventDefault vs stopPropagation"
            desc="preventDefault: 브라우저 기본동작 막기 / stopPropagation: 이벤트 버블링 막기"
            code={`e.preventDefault();  // 폼 제출, 링크 이동 막기
e.stopPropagation(); // 부모로 클릭 전파 막기`}
            demo={<p className="study-tip">B001 조회/리셋은 button type='button'이라 form submit 기본동작 없음</p>}
          />
        </MultiSection>
      );

    default:
      return null;
  }
};
