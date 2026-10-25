import Button from "../atoms/Button";

const FILTER_OPTIONS = ["All", "Vinyl", "Cassette", "For Trade"];

const SORT_OPTIONS = [
  { value: "default", label: "Default Order" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "year-desc", label: "Year: Newest First" },
  { value: "year-asc", label: "Year: Oldest First" },
];

export default function FilterBar({
  activeFilter = "All",
  onFilterChange,
  sortBy = "default",
  onSortChange,
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-4 mb-6 border-b border-zinc-800">
      {/* כפתורי סינון (Pills) */}
      <div
        className="flex flex-wrap items-center gap-2"
        role="group"
        aria-label="Format and status filters"
      >
        {FILTER_OPTIONS.map((filter) => {
          const isActive = activeFilter === filter;

          return (
            <Button
              key={filter}
              type="button"
              variant={isActive ? "primary" : "ghost"}
              onClick={() => onFilterChange(filter)}
              aria-pressed={isActive}
              className={`rounded-full px-3 py-1 text-xs font-mono transition-all border ${
                isActive
                  ? "border-vault-lime bg-vault-lime !text-black font-black shadow-sm"
                  : "border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
              }`}
            >
              {filter}
            </Button>
          );
        })}
      </div>

      {/* תפריט נפתח למיון */}
      <div className="flex items-center gap-2">
        <label
          htmlFor="sort-select"
          className="text-xs font-mono text-zinc-500 uppercase tracking-wider"
        >
          Sort By:
        </label>
        <select
          id="sort-select"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="bg-zinc-900 text-zinc-300 text-xs font-mono px-3 py-1.5 rounded-lg border border-zinc-800 focus:outline-none focus:ring-1 focus:ring-vault-primary focus:border-transparent transition-colors cursor-pointer"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
