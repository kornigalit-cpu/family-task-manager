import { useState, useEffect } from "react";
import { INITIAL_RELEASES } from "./data/initialReleases";
import ReleaseGrid from "./components/organisms/ReleaseGrid";
import AddReleaseModal from "./components/molecules/AddReleaseModal";
import SearchBar from "./components/molecules/SearchBar";
import FilterBar from "./components/molecules/FilterBar";
import Button from "./components/atoms/Button";
import {
  loadReleasesFromStorage,
  saveReleasesToStorage,
} from "./utils/storage";

export default function App() {
  // טעינה חכמה מה-localStorage דרך פונקציית העזר (כולל טיפול בשגיאות ומקרי קצה)
  const [releases, setReleases] = useState(() => {
    return loadReleasesFromStorage(INITIAL_RELEASES);
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [formatFilter, setFormatFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRelease, setEditingRelease] = useState(null);

  // סנכרון אוטומטי ל-localStorage בכל שינוי במערך ה-releases
  useEffect(() => {
    saveReleasesToStorage(releases);
  }, [releases]);

  // פתיחה במצב הוספה
  const handleOpenAdd = () => {
    setEditingRelease(null);
    setIsModalOpen(true);
  };

  // פתיחה במצב עריכה
  const handleOpenEdit = (release) => {
    setEditingRelease(release);
    setIsModalOpen(true);
  };

  // שמירה (הוספה או עריכה)
  const handleSaveRelease = (releaseData) => {
    if (editingRelease) {
      setReleases((prev) =>
        prev.map((r) =>
          r.id === editingRelease.id ? { ...releaseData, id: r.id } : r,
        ),
      );
    } else {
      const newRelease = {
        ...releaseData,
        id: Date.now().toString(),
      };
      setReleases((prev) => [newRelease, ...prev]);
    }
  };

  // מחיקת ריליס
  const handleDeleteRelease = (id) => {
    setReleases((prev) => prev.filter((r) => r.id !== id));
  };

  // החלפת סטטוס For Trade בלחיצה על התג
  const handleToggleTrade = (id) => {
    setReleases((prev) =>
      prev.map((r) => (r.id === id ? { ...r, forTrade: !r.forTrade } : r)),
    );
  };

  // סינון לפי חיפוש ופורמט
  const filteredReleases = releases.filter((release) => {
    const matchesSearch =
      release.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      release.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (release.genre &&
        release.genre.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFormat =
      formatFilter === "All" || release.format === formatFilter;

    return matchesSearch && matchesFormat;
  });

  return (
    <div className="min-h-screen bg-[#0f1013] text-vault-text flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-[#14151a]/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            <div>
              <h1 className="text-lg font-black tracking-wider text-vault-text">
                UNDERGROUND VAULT
              </h1>
              <p className="text-[11px] text-zinc-400 font-mono tracking-tight">
                INDEPENDENT PHYSICAL MUSIC ARCHIVE
              </p>
            </div>
          </div>

          <Button
            onClick={handleOpenAdd}
            className="bg-vault-lime !text-black hover:bg-vault-lime/90 font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-sm transition-transform active:scale-95"
          >
            <span>+</span>
            <span>ADD RELEASE</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto w-full px-6 py-8 flex-1 flex flex-col gap-6">
        {/* Controls Bar: Search & Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="w-full sm:w-80">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
          </div>
          <FilterBar
            selectedFormat={formatFilter}
            onSelectFormat={setFormatFilter}
          />
        </div>

        {/* Releases Grid */}
        <ReleaseGrid
          releases={filteredReleases}
          onEdit={handleOpenEdit}
          onDelete={handleDeleteRelease}
          onToggleTrade={handleToggleTrade}
        />
      </main>

      {/* Modal */}
      <AddReleaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaveRelease={handleSaveRelease}
        initialData={editingRelease}
      />
    </div>
  );
}
