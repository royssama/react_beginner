/**
 * 날짜를 YYYYWW 주차 코드로 변환 (ISO 주차 기준)
 * 예: 2026-06-29 → "202627"
 */
export const dateToWeekCode = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  const year = d.getFullYear();
  return `${year}${String(weekNo).padStart(2, "0")}`;
};

export const getTodayWeekCode = () => {
  return dateToWeekCode(new Date());
};

export const formatWeekDisplay = (weekCode) => {
  if (!weekCode || weekCode.length !== 6) return weekCode;
  const year = weekCode.substring(0, 4);
  const week = weekCode.substring(4, 6);
  return `${year}년 ${parseInt(week, 10)}주차 (${weekCode})`;
};

export const weekCodeToDateInput = (weekCode) => {
  if (!weekCode || weekCode.length !== 6) return "";
  const year = parseInt(weekCode.substring(0, 4), 10);
  const week = parseInt(weekCode.substring(4, 6), 10);
  const jan4 = new Date(year, 0, 4);
  const dayOfWeek = jan4.getDay() || 7;
  const monday = new Date(jan4);
  monday.setDate(jan4.getDate() - dayOfWeek + 1 + (week - 1) * 7);
  return monday.toISOString().split("T")[0];
};
