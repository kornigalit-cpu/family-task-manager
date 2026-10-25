/**
 * מסננת וממיינת מערך ריליסים לפי חיפוש, פורמט וסדר נבחר
 */
export function filterAndSortReleases(
  releases = [],
  { searchTerm = "", formatFilter = "All", sortBy = "default" } = {},
) {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  return releases
    .filter((release) => {
      // 1. התאמת חיפוש טקסטואלי
      const matchesSearch =
        !normalizedSearch ||
        release.title?.toLowerCase().includes(normalizedSearch) ||
        release.artist?.toLowerCase().includes(normalizedSearch) ||
        release.genre?.toLowerCase().includes(normalizedSearch);

      // 2. התאמת פורמט / סטטוס Trade
      let matchesFormat = true;
      if (formatFilter === "For Trade") {
        matchesFormat = Boolean(release.forTrade);
      } else if (formatFilter !== "All") {
        matchesFormat = release.format === formatFilter;
      }

      return matchesSearch && matchesFormat;
    })
    .sort((a, b) => {
      // 3. מיון
      switch (sortBy) {
        case "price-asc":
          return Number(a.price) - Number(b.price);
        case "price-desc":
          return Number(b.price) - Number(a.price);
        case "year-desc":
          return Number(b.year) - Number(a.year);
        case "year-asc":
          return Number(a.year) - Number(b.year);
        default:
          return 0;
      }
    });
}
