import { useState } from "react";
import SearchBar from "./components/molecules/SearchBar";
import ReleaseGrid from "./components/organisms/ReleaseGrid";
import AddReleaseModal from "./components/molecules/AddReleaseModal";
import Button from "./components/atoms/Button";
import { INITIAL_RELEASES } from "./data/initialReleases";

export default function App() {
  const [releases, setReleases] = useState(INITIAL_RELEASES);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRelease, setEditingRelease] = useState(null);

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
      // Update
      setReleases((prev) =>
        prev.map((item) =>
          item.id === editingRelease.id
            ? { ...releaseData, id: item.id }
            : item,
        ),
      );
    } else {
      // Create
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

      {/* רשת כרטיסים עם עריכה ומחיקה */}
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
