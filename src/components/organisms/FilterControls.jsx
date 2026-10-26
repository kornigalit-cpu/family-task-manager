import SearchBar from "../molecules/SearchBar";
import FilterBar from "../molecules/FilterBar";

export default function FilterControls({
  searchTerm,
  onSearchChange,
  formatFilter,
  onFilterChange,
  sortBy,
  onSortChange,
}) {
  // מטפל גם אם SearchBar שולח event וגם אם הוא שולח ישירות ערך מחרוזת
  const handleSearch = (e) => {
    const value = e && e.target !== undefined ? e.target.value : e;
    onSearchChange(value || "");
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
      <div className="w-full sm:w-80">
        <SearchBar value={searchTerm} onChange={handleSearch} />
      </div>
      <FilterBar
        activeFilter={formatFilter}
        onFilterChange={onFilterChange}
        sortBy={sortBy}
        onSortChange={onSortChange}
      />
    </div>
  );
}
