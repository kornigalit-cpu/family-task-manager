import { useState } from "react";
import SearchBar from "./components/molecules/SearchBar";
import ReleaseGrid from "./components/organisms/ReleaseGrid";
import AddReleaseModal from "./components/molecules/AddReleaseModal";
import Button from "./components/atoms/Button";
import { INITIAL_RELEASES } from "./data/initialReleases";

export default function App() {
  const [releases, setReleases] = useState(INITIAL_RELEASES);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // הוספת פריט חדש לאוסף (Create ב-CRUD)
  const handleAddRelease = (newReleaseData) => {
    const newRelease = {
      ...newReleaseData,
      id: Date.now().toString(), // מזהה ייחודי
    };

    setReleases((prevReleases) => [newRelease, ...prevReleases]);
  };

  // מחיקת פריט לפי ID (Delete ב-CRUD)
  const handleDeleteRelease = (idToDelete) => {
    setReleases((prevReleases) =>
      prevReleases.filter((release) => release.id !== idToDelete),
    );
  };

  // סינון פריטים
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
      {/* כותרת עליונה עם כפתור הוספה */}
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
          onClick={() => setIsAddModalOpen(true)}
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

      {/* רשת הכרטיסים */}
      <section>
        <ReleaseGrid
          releases={filteredReleases}
          onTradeRequest={(item) => alert(`Selected for trade: ${item.title}`)}
          onDeleteRelease={handleDeleteRelease}
        />
      </section>

      {/* מודאל הוספת אלבום */}
      <AddReleaseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddRelease={handleAddRelease}
      />
    </main>
  );
}
