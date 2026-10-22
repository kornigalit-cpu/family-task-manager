import { useState, useEffect } from "react";
import SearchBar from "./components/molecules/SearchBar";
import ReleaseGrid from "./components/organisms/ReleaseGrid";
import AddReleaseModal from "./components/molecules/AddReleaseModal";
import Button from "./components/atoms/Button";
import { INITIAL_RELEASES } from "./data/initialReleases";

const STORAGE_KEY = "underground_vault_releases";

export default function App() {
  // טעינה חכמה מה-localStorage: מתבצעת פעם אחת בלבד בעליית האפליקציה
  const [releases, setReleases] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error("Failed to load releases from localStorage:", error);
    }
    return INITIAL_RELEASES;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRelease, setEditingRelease] = useState(null);

  // סנכרון אוטומטי ל-localStorage בכל שינוי ב-releases
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(releases));
    } catch (error) {
      console.error("Failed to save releases to localStorage:", error);
    }
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

  // שמירה: גם הוספה (Create) וגם עריכה (Update)
  const handleSaveRelease = (releaseData) => {
    if (editingRelease) {
      setReleases((prev) =>
        prev.map((item) =>
          item.id === editingRelease.id
            ? { ...releaseData, id: item.id }
            : item,
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

  // מחיקה (Delete)
  const handleDeleteRelease = (idToDelete) => {
    setReleases((prev) => prev.filter((release) => release.id !== idToDelete));
  };

  // סינון
  const filteredReleases = releases.filter((rel) => {
    const query = searchTerm.toLowerCase();
    return (
      rel.title.toLowerCase().includes(query) ||
      rel.artist.toLowerCase().includes(query) ||
      rel.genre.toLowerCase().includes(query)
    );
  });

  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto flex flex-col gap-6">
      {/* כותרת עליונה */}
      <header className="border-b border-zinc-800 pb-4 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-vault-text">
            UNDERGROUND VAULT
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Catalog & Collection Management
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          className="bg-vault-lime !text-black hover:bg-vault-lime/90 font-extrabold px-4 py-2 text-xs rounded-lg shadow-sm whitespace-nowrap cursor-pointer transition-all"
        >
          + Add Release
        </Button>
      </header>

      {/* שורת חיפוש */}
      <section className="w-full">
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </section>

      {/* רשת כרטיסים */}
      <section>
        <ReleaseGrid
          releases={filteredReleases}
          onTradeRequest={(item) => alert(`Selected for trade: ${item.title}`)}
          onDeleteRelease={handleDeleteRelease}
          onEditRelease={handleOpenEdit}
        />
      </section>

      {/* מודאל מאוחד: הוספה ועריכה */}
      <AddReleaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaveRelease={handleSaveRelease}
        initialData={editingRelease}
      />
    </main>
  );
}
