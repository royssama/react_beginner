/**
 * 공통 조건 스캔 유틸 — DOM 기준
 *
 * 화면별 fieldDefs 없이, data-filter-catch="on" 이 붙은 요소만 읽어
 * 라벨 / 표시값(value) / 원시 코드(code) 를 만든다.
 */

/** 라벨 텍스트에서 앞쪽 번호("1. ")와 뒤쪽 괄호 설명 제거 */
const cleanLabel = (text) =>
  (text || "")
    .replace(/^\d+\.\s*/, "")
    .replace(/\s*\(.*\)\s*$/, "") // "카테고리 (다중선택)" → "카테고리"
    .trim();

/** radio/checkbox input → 옆에 보이는 텍스트 */
const labelTextOfInput = (input) => {
  const wrap = input.closest("label");
  if (!wrap) return input.value || "";
  return wrap.textContent.replace(/\s+/g, " ").trim();
};

/** 체크된 input 목록 → { value, code } */
const readCheckedInputs = (inputs) => {
  const checked = Array.from(inputs).filter((input) => input.checked);
  if (!checked.length) return { value: "(선택 없음)", code: "" };
  return {
    value: checked.map(labelTextOfInput).join(", "),
    code: checked.map((input) => input.value).join(", "),
  };
};

/**
 * filter-item 하나에서 표시값과 코드 추출
 * 우선순위: select → radio → checkbox → 일반 input(달력/텍스트)
 */
const readFilterItem = (itemEl) => {
  const select = itemEl.querySelector("select");
  if (select) {
    const selected = Array.from(select.selectedOptions);
    if (!selected.length) return { value: "(선택 없음)", code: "" };
    return {
      value: selected.map((opt) => opt.textContent.trim()).join(", "),
      code: selected.map((opt) => opt.value).join(", "),
    };
  }

  const radios = itemEl.querySelectorAll('input[type="radio"]');
  if (radios.length) return readCheckedInputs(radios);

  const checkboxes = itemEl.querySelectorAll('input[type="checkbox"]');
  if (checkboxes.length) return readCheckedInputs(checkboxes);

  const input = itemEl.querySelector(
    'input:not([type="radio"]):not([type="checkbox"]):not([type="hidden"])'
  );
  if (input) {
    // 달력처럼 보조 문구(.filter-hint)가 있으면 그것을 표시값으로 쓴다
    const hint = itemEl.querySelector(".filter-hint")?.textContent?.trim();
    const raw = input.value?.trim() || "";
    return {
      value: hint || raw || "(없음)",
      code: raw,
    };
  }

  const hint = itemEl.querySelector(".filter-hint")?.textContent?.trim();
  return { value: hint || "(없음)", code: "" };
};

/**
 * 컨테이너 DOM을 스캔해 조회 조건 미리보기 목록 생성
 * @param {HTMLElement | null} root
 * @returns {{ key: string, label: string, value: string, code: string }[]}
 */
export const scanFilterConditionsFromDom = (root) => {
  if (!root) return [];

  const items = root.querySelectorAll('[data-filter-catch="on"]');
debugger
  return Array.from(items).map((itemEl, index) => {
    const rawLabel =
      itemEl.querySelector(".filter-label")?.textContent?.trim() ||
      itemEl.getAttribute("data-filter-label") ||
      `조건 ${index + 1}`;

    const { value, code } = readFilterItem(itemEl);

    return {
      key: itemEl.getAttribute("data-filter-key") || `filter-${index}`,
      label: cleanLabel(rawLabel),
      value,
      code,
    };
  });
};
