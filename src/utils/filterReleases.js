/**
 * מסננת וממיינת מערך ריליסים לפי חיפוש, פורמט וסדר נבחר
 * מיישמת Fail-Fast לביצועים ושימוש ב-toSorted למניעת מוטציות
 */
export function filterAndSortReleases(
  releases = [],
  { searchTerm = "", formatFilter = "All", sortBy = "default" } = {},
) {
  if (!Array.isArray(releases)) return [];

  const normalizedSearch = (searchTerm || "").trim().toLowerCase();

  // 1. שלב הסינון עם Fail-Fast
  const filtered = releases.filter((release) => {
    if (!release || typeof release !== "object") return false;

    // א. בדיקת פורמט / טרייד תחילה (פעולה זולה של O(1))
    if (formatFilter === "For Trade") {
      if (!release.forTrade) return false;
    } else if (formatFilter !== "All") {
      if (release.format !== formatFilter) return false;
    }

    // ב. בדיקת חיפוש טקסטואלי (רק אם הפריט עבר את הפורמט ויש מחרוזת חיפוש)
    if (!normalizedSearch) return true;

    const titleMatch = release.title?.toLowerCase().includes(normalizedSearch);
    const artistMatch = release.artist
      ?.toLowerCase()
      .includes(normalizedSearch);
    const genreMatch = release.genre?.toLowerCase().includes(normalizedSearch);

    return Boolean(titleMatch || artistMatch || genreMatch);
  });

  // 2. שלב המיון (שימוש ב-toSorted או העתקה בלתי מוטטיבית)
  const sortComparator = (a, b) => {
    switch (sortBy) {
      case "price-asc":
        return (Number(a.price) || 0) - (Number(b.price) || 0);
      case "price-desc":
        return (Number(b.price) || 0) - (Number(a.price) || 0);
      case "year-desc":
        return (Number(b.year) || 0) - (Number(a.year) || 0);
      case "year-asc":
        return (Number(a.year) || 0) - (Number(b.year) || 0);
      default:
        return 0; // שמירה על היציבות המקורית של המערך
    }
  };

  return typeof filtered.toSorted === "function"
    ? filtered.toSorted(sortComparator)
    : [...filtered].sort(sortComparator);
}
