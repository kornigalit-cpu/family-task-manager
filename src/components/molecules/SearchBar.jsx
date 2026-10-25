import Button from "../atoms/Button";

// אייקון זכוכית מגדלת נקי וקל משקל ב-SVG
const SearchIcon = () => (
  <svg
    className="w-4 h-4 text-zinc-500 pointer-events-none"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search by artist, album, or genre...",
}) {
  return (
    <div className="relative flex items-center w-full">
      {/* אייקון זכוכית מגדלת מצד שמאל */}
      <div className="absolute left-3 flex items-center">
        <SearchIcon />
      </div>

      {/* שדה הקלט - עם pl-10 כדי לפנות מקום לאייקון */}
      <input
        className="bg-zinc-900/90 border border-zinc-800 text-vault-text placeholder:text-zinc-500 rounded-lg pl-10 pr-10 py-2 text-sm w-full focus:outline-none focus:ring-1 focus:ring-vault-purple focus:border-transparent transition-all"
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />

      {/* כפתור ניקוי בצד ימין - מופיע רק כשיש טקסט */}
      {value && (
        <Button
          className="absolute right-1 text-zinc-400 hover:text-vault-text px-2 py-1 text-xs"
          variant="ghost"
          onClick={() => onChange({ target: { value: "" } })}
          aria-label="Clear search"
        >
          ✕
        </Button>
      )}
    </div>
  );
}
