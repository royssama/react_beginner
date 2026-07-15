/**
 * 쿠키 읽기/쓰기 유틸
 */

/** @param {string} name */
export const getCookie = (name) => {
  if (typeof document === "undefined") return null;
  const target = `${encodeURIComponent(name)}=`;
  const parts = document.cookie.split(";");
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.startsWith(target)) {
      return decodeURIComponent(trimmed.slice(target.length));
    }
  }
  return null;
};

/**
 * @param {string} name
 * @param {string} value
 * @param {number} [days=365]
 */
export const setCookie = (name, value, days = 365) => {
  if (typeof document === "undefined") return;
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
};

/** boolean 쿠키 읽기 (없으면 defaultValue) */
export const getCookieBoolean = (name, defaultValue = false) => {
  const raw = getCookie(name);
  if (raw == null) return defaultValue;
  return raw === "true" || raw === "1";
};
