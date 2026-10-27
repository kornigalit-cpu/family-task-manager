/**
 * בדיקת טקסט: מוודא שהערך הוא מחרוזת ואינו ריק או מכיל רק רווחים
 */
export function isValidText(text) {
  if (typeof text !== "string") return false;
  return text.trim().length > 0;
}

/**
 * בדיקת שנת יציאה: מספר שלם בין 1900 לשנה הבאה
 */
export function isValidYear(year) {
  if (year === null || year === undefined || year === "") return false;
  const num = Number(year);
  if (!Number.isInteger(num)) return false;
  const currentYear = new Date().getFullYear();
  return num >= 1900 && num <= currentYear + 1;
}

/**
 * בדיקת מחיר: מספר חיובי או 0. מחרוזות ריקות או רווחים נפסלות.
 */
export function isValidPrice(price) {
  if (price === null || price === undefined) return false;
  if (typeof price === "string" && price.trim() === "") return false;
  const num = Number(price);
  return !isNaN(num) && num >= 0;
}

/**
 * בדיקת תקינות URL: דורש פרוטוקול http או https בלבד להגנה מ-XSS
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
 * ולידטור מרכזי לאלבום חדש או מעודכן
 * Title ו-Artist הם שדות חובה.
 * Year, Price ו-CoverUrl נבדקים רק כאשר הם קיימים/נשלחו.
 */
export function validateRelease(release) {
  const errors = {};

  if (!release || typeof release !== "object") {
    return {
      isValid: false,
      errors: { general: "Invalid release data payload" },
    };
  }

  // 1. שדות חובה
  if (!isValidText(release.title)) {
    errors.title = "Title is required";
  }

  if (!isValidText(release.artist)) {
    errors.artist = "Artist is required";
  }

  // 2. שנת יציאה (חובה שתהיה תקינה במידה והוגדרה)
  if (!isValidYear(release.year)) {
    errors.year = `Year must be an integer between 1900 and ${new Date().getFullYear() + 1}`;
  }

  // 3. מחיר (שדה רשות - נבדק רק אם הוזן ערך שאינו ריק)
  const hasPriceValue =
    release.price !== undefined &&
    release.price !== null &&
    String(release.price).trim() !== "";

  if (hasPriceValue && !isValidPrice(release.price)) {
    errors.price = "Price must be 0 or a positive number";
  }

  // 4. כתובת תמונה (שדה רשות - נבדק רק אם הוזן ערך)
  if (release.coverUrl && !isValidUrl(release.coverUrl)) {
    errors.coverUrl = "Please provide a valid http/https image URL";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * ולידטור מרכזי להצעת מסחר (Single Source of Truth עבור טריידים)
 */
export function validateTradeProposal(proposal) {
  const errors = {};

  if (!proposal || typeof proposal !== "object") {
    return {
      isValid: false,
      errors: { general: "Invalid trade proposal payload" },
    };
  }

  if (!isValidText(proposal.proposerName)) {
    errors.proposerName = "Collector name / tag is required";
  }

  if (!isValidText(proposal.offeredItem)) {
    errors.offeredItem = "Offered item details are required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
