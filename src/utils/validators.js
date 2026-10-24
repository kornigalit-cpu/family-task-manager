/**
 * בדיקת טקסט שאינו ריק ואינו מכיל רק רווחים
 */
export function isValidText(text) {
  if (typeof text !== "string") return false;
  return text.trim().length > 0;
}

/**
 * בדיקת שנת יציאה (1900 עד השנה הנוכחית + 1)
 */
export function isValidYear(year) {
  const num = Number(year);
  if (!Number.isInteger(num)) return false;
  const currentYear = new Date().getFullYear();
  return num >= 1900 && num <= currentYear + 1;
}

/**
 * בדיקת מחיר: מספר שאינו שלילי
 */
export function isValidPrice(price) {
  const num = Number(price);
  if (isNaN(num)) return false;
  return num >= 0;
}

/**
 * בדיקת תקינות כתובת URL לתמונה
 */
export function isValidUrl(url) {
  if (!url || typeof url !== "string") return false;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * ולידטור מרכזי לאובייקט אלבום מלא
 * מחזיר אובייקט עם שגיאות (ריק אם הכל תקין)
 */
export function validateRelease(release) {
  const errors = {};

  if (!isValidText(release.title)) {
    errors.title = "Title is required";
  }

  if (!isValidText(release.artist)) {
    errors.artist = "Artist is required";
  }

  if (!isValidYear(release.year)) {
    errors.year = `Year must be an integer between 1900 and ${new Date().getFullYear() + 1}`;
  }

  if (!isValidPrice(release.price)) {
    errors.price = "Price must be 0 or a positive number";
  }

  if (release.coverUrl && !isValidUrl(release.coverUrl)) {
    errors.coverUrl = "Please provide a valid http/https image URL";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
