import { useState, useEffect } from "react";
import { INITIAL_RELEASES } from "./data/initialReleases";
import ReleaseGrid from "./components/organisms/ReleaseGrid";
import AddReleaseModal from "./components/molecules/AddReleaseModal";
import SearchBar from "./components/molecules/SearchBar";
import FilterBar from "./components/molecules/FilterBar";
import Button from "./components/atoms/Button";
import { filterAndSortReleases } from "./utils/filterReleases";
import ActivityLogDrawer from "./components/organisms/ActivityLogDrawer";
import TradeProposalModal from "./components/molecules/TradeProposalModal";
import {
  loadReleasesFromStorage,
  saveReleasesToStorage,
} from "./utils/storage";
import {
  getStoredLogs,
  createLogEntry,
  clearAllLogs,
  ACTION_TYPES,
} from "./utils/logger";

export default function App() {
  // טעינה חכמה מה-localStorage דרך פונקציית העזר (כולל טיפול בשגיאות ומקרי קצה)
  const [releases, setReleases] = useState(() => {
    return loadReleasesFromStorage(INITIAL_RELEASES);
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [formatFilter, setFormatFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRelease, setEditingRelease] = useState(null);
  const [sortBy, setSortBy] = useState("default");
  const [logs, setLogs] = useState(() => getStoredLogs());
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [tradingRelease, setTradingRelease] = useState(null);
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);

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
    // בדיקת ולידציה ותיעוד שגיאה במידת הצורך
    if (!releaseData.title?.trim() || !releaseData.artist?.trim()) {
      const updatedLogs = createLogEntry({
        type: "VALIDATION_ERROR",
        title: "Validation Failed: Missing required fields",
        details: "Release title and artist cannot be empty",
      });
      setLogs(updatedLogs);
      return;
    }

    if (editingRelease) {
      // עדכון ריליס קיים
      setReleases((prev) =>
        prev.map((r) =>
          r.id === editingRelease.id ? { ...releaseData, id: r.id } : r,
        ),
      );

      // --- הוספת תיעוד עריכה ללוג ---
      const updatedLogs = createLogEntry({
        type: ACTION_TYPES.RELEASE_UPDATED,
        title: `Updated "${releaseData.title}"`,
        details: `${releaseData.artist} - ₪${releaseData.price}`,
      });
      setLogs(updatedLogs);
    } else {
      // הוספת ריליס חדש
      const newRelease = {
        ...releaseData,
        id: Date.now().toString(),
      };
      setReleases((prev) => [newRelease, ...prev]);

      // --- הוספת תיעוד הוספה ללוג ---
      const updatedLogs = createLogEntry({
        type: ACTION_TYPES.RELEASE_ADDED,
        title: `Added "${newRelease.title}"`,
        details: `${newRelease.artist} (${newRelease.format})`,
      });
      setLogs(updatedLogs);
    }

    setIsModalOpen(false);
    setEditingRelease(null);
  };

  const handleDeleteRelease = (id) => {
    const deletedItem = releases.find((r) => r.id === id);
    setReleases((prev) => prev.filter((r) => r.id !== id));

    // תיעוד פעולת מחיקה ללוג
    const updatedLogs = createLogEntry({
      type: ACTION_TYPES.RELEASE_DELETED,
      title: `Deleted "${deletedItem?.title || "Release"}"`,
      details: "Removed from vault archive",
    });
    setLogs(updatedLogs);
  };

  // פתיחת מודאל הטרייד עם האלבום שנבחר
  const handleOpenTrade = (release) => {
    setTradingRelease(release);
    setIsTradeModalOpen(true);
  };

  // שליחת ההצעה: שינוי סטטוס ל-Pending ותיעוד בלוג
  const handleTradeSubmit = (proposalData) => {
    setReleases((prev) =>
      prev.map((r) =>
        r.id === proposalData.releaseId
          ? { ...r, status: "Pending", tradeProposal: proposalData }
          : r,
      ),
    );

    const updatedLogs = createLogEntry({
      type: ACTION_TYPES.TRADE_REQUESTED,
      title: `Trade Proposed: "${proposalData.releaseTitle}"`,
      details: `Offered: "${proposalData.offeredItem}" by ${proposalData.proposerName}`,
    });
    setLogs(updatedLogs);
  };

  // סינון לפי חיפוש ופורמט
  const filteredReleases = filterAndSortReleases(releases, {
    searchTerm,
    formatFilter,
    sortBy,
  });

  return (
    <div className="min-h-screen bg-[#0f1013] text-vault-text flex flex-col font-sans">
      {/* 1. Global Header: מיתוג ופרופיל משתמש */}
      <header className="border-b border-zinc-800 bg-[#14151a]/80 backdrop-blur-md sticky top-0 z-40 px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-lg font-black tracking-wider text-vault-text">
                UNDERGROUND VAULT
              </h1>
              <p className="text-[11px] text-zinc-400 font-mono tracking-tight">
                INDEPENDENT PHYSICAL MUSIC ARCHIVE
              </p>
            </div>
          </div>

          {/* פרטי משתמש (Placeholder להזדהות) */}
          <div className="flex items-center gap-3 bg-zinc-900/60 border border-zinc-800/80 px-3 py-1.5 rounded-full">
            <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-mono text-[#ccff00]">
              UV
            </div>
            <div className="text-xs">
              <span className="text-zinc-400 block text-[10px] leading-tight">
                Collector
              </span>
              <span className="text-zinc-200 font-medium">Vault Keeper</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Action Bar: סרגל כפתורי ניהול וארכיון */}
      <section className="max-w-7xl mx-auto w-full px-6 pt-6 pb-2">
        <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-zinc-800/60">
          <div>
            <h2 className="text-base font-bold text-zinc-200">
              Archive Collection
            </h2>
            <p className="text-xs text-zinc-500 font-mono">
              {releases.length} releases cataloged in vault
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsLogOpen(true)}
              className="px-3 py-2 rounded-xl border border-zinc-700 bg-zinc-900/80 hover:border-[#ccff00] text-zinc-300 hover:text-white transition-colors text-xs flex items-center gap-2 font-mono"
              title="View Activity Log"
            >
              <span className="w-2 h-2 rounded-full bg-[#ccff00]" />
              ACTIVITY
              {logs.length > 0 && (
                <span className="text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded-full border border-zinc-700">
                  {logs.length}
                </span>
              )}
            </button>

            <Button
              onClick={handleOpenAdd}
              className="bg-vault-purple !text-black hover:bg-vault-purple/90 font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5"
            >
              <span>+</span>
              <span>ADD RELEASE</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto w-full px-6 py-8 flex-1 flex flex-col gap-6">
        {/* Controls Bar: Search & Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="w-full sm:w-80">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
          </div>
          <FilterBar
            activeFilter={formatFilter}
            onFilterChange={setFormatFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>
        {/* Releases Grid */}
        <ReleaseGrid
          releases={filteredReleases}
          onEdit={handleOpenEdit}
          onDeleteRelease={handleDeleteRelease}
          onTradeRequest={handleOpenTrade}
        />
      </main>

      {/* Modal */}
      <AddReleaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaveRelease={handleSaveRelease}
        initialData={editingRelease}
      />

      <ActivityLogDrawer
        isOpen={isLogOpen}
        onClose={() => setIsLogOpen(false)}
        logs={logs}
        onClearLogs={() => setLogs(clearAllLogs())}
      />
      <TradeProposalModal
        key={tradingRelease ? tradingRelease.id : "closed"}
        isOpen={isTradeModalOpen}
        onClose={() => setIsTradeModalOpen(false)}
        release={tradingRelease}
        onSubmit={handleTradeSubmit}
      />
    </div>
  );
}
