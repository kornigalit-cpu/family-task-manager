const LOGS_STORAGE_KEY = "vault_system_logs";

/**
 * טיפוסי הלוגים הרשמיים במערכת (קפואים למניעת שינוי)
 */
export const LOG_TYPES = Object.freeze({
  RELEASE_ADDED: "RELEASE_ADDED",
  RELEASE_UPDATED: "RELEASE_UPDATED",
  RELEASE_DELETED: "RELEASE_DELETED",
  TRADE_REQUESTED: "TRADE_REQUESTED",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  STORAGE_ERROR: "STORAGE_ERROR",
  SYSTEM_ERROR: "SYSTEM_ERROR",
});

// שמירה על תאימות לאחור עם קוד קיים
export const ACTION_TYPES = LOG_TYPES;

/**
 * טוען לוגים מ-localStorage בצורה בטוחה
 */
export function getStoredLogs() {
  if (typeof window === "undefined" || !window.localStorage) return [];

  try {
    const raw = localStorage.getItem(LOGS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to load logs from localStorage:", error);
    return [];
  }
}

/**
 * שומר לוגים ל-localStorage
 */
export function saveLogs(logs) {
  if (typeof window === "undefined" || !window.localStorage) return false;

  try {
    localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(logs));
    return true;
  } catch (error) {
    console.error("Failed to save logs to localStorage:", error);
    return false;
  }
}

/**
 * יוצר רשומת לוג מאומתת, מוסיף אותה לראש הרשימה ושומר בדיסק
 */
export function createLogEntry({ type, title, details = "" }) {
  // וידוא שהטיפוס חוקי, אחרת סיווג כשגיאת מערכת
  const resolvedType = Object.values(LOG_TYPES).includes(type)
    ? type
    : LOG_TYPES.SYSTEM_ERROR;

  const newEntry = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    type: resolvedType,
    title: String(title || "System Event"),
    details: typeof details === "string" ? details : JSON.stringify(details),
    timestamp: new Date().toISOString(),
  };

  const currentLogs = getStoredLogs();
  const updatedLogs = [newEntry, ...currentLogs].slice(0, 50);
  saveLogs(updatedLogs);

  return updatedLogs;
}

/**
 * מנקה את כל הלוגים
 */
export function clearAllLogs() {
  saveLogs([]);
  return [];
}

/**
 * מפיק ומוריד קובץ JSON עם כל הלוגים בדפדפן (מענה לסעיף 8 בהנחיות)
 */
export function exportLogsToFile(logs = []) {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return false;
  }

  try {
    const dataToExport = logs.length > 0 ? logs : getStoredLogs();
    const jsonString = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `vault_activity_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error("Failed to export logs file:", error);
    return false;
  }
}
