// מפתח ייעודי לשמירת היסטוריית הפעולות ב-localStorage בנפרד מהריליסים
const LOGS_STORAGE_KEY = "vault_system_logs";

// הגדרת סוגי הפעולות במערכת למניעת שגיאות כתיב (Magic Strings)
export const ACTION_TYPES = {
  RELEASE_ADDED: "RELEASE_ADDED",
  RELEASE_UPDATED: "RELEASE_UPDATED",
  RELEASE_DELETED: "RELEASE_DELETED",
  TRADE_REQUESTED: "TRADE_REQUESTED",
};

/**
 * טוען את מערך הלוגים מ-localStorage.
 * אם אין נתונים או שיש שגיאת קריאה, מחזיר מערך ריק.
 */
export function getStoredLogs() {
  try {
    const raw = localStorage.getItem(LOGS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("Failed to load logs from localStorage:", error);
    return [];
  }
}

/**
 * שומר את מערך הלוגים המלא ב-localStorage כמחרוזת JSON.
 */
export function saveLogs(logs) {
  try {
    localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(logs));
  } catch (error) {
    console.error("Failed to save logs to localStorage:", error);
  }
}

/**
 * יוצר רשומת לוג חדשה עם מזהה ייחודי וחותמת זמן עדכנית,
 * מוסיף אותה לתחילת הרשימה (כך שהפעולה האחרונה תופיע תמיד ראשונה),
 * מגביל את הזיכרון ל-50 הפעולות האחרונות, ושומר ב-localStorage.
 */
export function createLogEntry({ type, title, details = "" }) {
  const newEntry = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    type,
    title,
    details,
    timestamp: new Date().toISOString(),
  };

  const currentLogs = getStoredLogs();
  const updatedLogs = [newEntry, ...currentLogs].slice(0, 50);
  saveLogs(updatedLogs);

  return updatedLogs;
}

/**
 * מנקה לחלוטין את היסטוריית הפעולות מה-localStorage ומחזיר מערך ריק.
 */
export function clearAllLogs() {
  saveLogs([]);
  return [];
}
