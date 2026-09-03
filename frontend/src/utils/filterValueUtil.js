/**
 * type + 값(코드) → 화면에 보여줄 이름 문자열(namestr) 계산
 *
 * DOM 텍스트를 읽지 않고, React가 가진 filters/options 만으로 만든다.
 */
import { formatWeekDisplay } from "./weekUtil";

/** 코드 1개 → "이름 (코드)" */
export const findOptionName = (options, code) => {
  const found = options?.find((item) => item.code === code);
  if (!found) return code || "(없음)";
  return `${found.name} (${found.code})`;
};

/** 코드 배열 → "이름 (코드), 이름 (코드)" */
export const findOptionNames = (options, codes) => {
  if (!codes?.length) return "(선택 없음)";
  return codes.map((code) => findOptionName(options, code)).join(", ");
};

/**
 * 필터 타입별 표시값
 * @param {string} type - week | select | multiselect | radio | checkbox | text
 * @param {*} value - filters에 들어있는 코드(또는 코드 배열)
 * @param {Array} options - 해당 필터의 옵션 목록
 */
export const resolveNameStr = (type, value, options = []) => {
  switch (type) {
    case "week":
      return formatWeekDisplay(value) || "(없음)";
    case "select":
    case "radio":
      return findOptionName(options, value);
    case "multiselect":
    case "checkbox":
      return findOptionNames(options, value ?? []);
    case "text":
    default:
      if (value == null || value === "") return "(없음)";
      return String(value);
  }
};
