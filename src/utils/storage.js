export const STORAGE_KEY = "underground_vault_releases";

/**
 * טוען תקליטים מ-localStorage עם תמיכה במקרי קצה וב-fallback
 */
export function loadReleasesFromStorage(fallbackData = []) {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return fallbackData;
    }
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) {
      return fallbackData;
    }
    return parsed;
  } catch (error) {
    console.error("Failed to load releases from localStorage:", error);
    return fallbackData;
  }
}

/**
 * שומר תקליטים ל-localStorage עם תמיכה בשגיאות סריאליזציה ומכסת אחסון
 */
export function saveReleasesToStorage(releases) {
  try {
    const serialized = JSON.stringify(releases);
    localStorage.setItem(STORAGE_KEY, serialized);
    return true;
  } catch (error) {
    console.error("Failed to save releases to localStorage:", error);
    return false;
  }
}
