import { useState, useEffect } from "react";
import { INITIAL_RELEASES } from "./data/initialReleases";
import Header from "./components/organisms/Header";
import ReleaseGrid from "./components/organisms/ReleaseGrid";
import FilterControls from "./components/organisms/FilterControls";
import ActionBar from "./components/organisms/ActionBar";
import { filterAndSortReleases } from "./utils/filterReleases";
import ModalsContainer from "./components/organisms/ModalsContainer";

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
import { useAuth } from "./context/useAuth";

export default function App() {
  // שליפת ניהול המודאל ישירות מהקונטקסט הגלובלי
  const { isAuthModalOpen, closeAuthModal, handleLoginSuccess } = useAuth();

  // טעינה מה-localStorage
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
      setReleases((prev) =>
        prev.map((r) =>
          r.id === editingRelease.id ? { ...releaseData, id: r.id } : r,
        ),
      );

      const updatedLogs = createLogEntry({
        type: ACTION_TYPES.RELEASE_UPDATED,
        title: `Updated "${releaseData.title}"`,
        details: `${releaseData.artist} - ${releaseData.price || "N/A"}`,
      });
      setLogs(updatedLogs);
    } else {
      const newRelease = {
        ...releaseData,
        id: Date.now().toString(),
      };
      setReleases((prev) => [newRelease, ...prev]);

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

    const updatedLogs = createLogEntry({
      type: ACTION_TYPES.RELEASE_DELETED,
      title: `Deleted "${deletedItem?.title || "Release"}"`,
      details: "Removed from vault archive",
    });
    setLogs(updatedLogs);
  };

  // פתיחת מודאל הטרייד
  const handleOpenTrade = (release) => {
    setTradingRelease(release);
    setIsTradeModalOpen(true);
  };

  // שליחת הצעת טרייד
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

  // סינון ומיון
  const filteredReleases = filterAndSortReleases(releases, {
    searchTerm,
    formatFilter,
    sortBy,
  });

  return (
    <div className="min-h-screen bg-[#0f1013] text-vault-text flex flex-col font-sans">
      {/* 1. Global Organism Header: צורך את המשתמש ישירות מ-useAuth */}
      <Header />

      {/* 2. Action Bar Organism */}
      <ActionBar
        releasesCount={releases.length}
        onOpenAdd={handleOpenAdd}
        onOpenLogs={() => setIsLogOpen(true)}
        logsCount={logs.length}
      />

      {/* 3. Main Content */}
      <main className="max-w-7xl mx-auto w-full px-6 py-8 flex-1 flex flex-col gap-6">
        {/* Controls Bar: Search & Filters Organism */}
        <FilterControls
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          formatFilter={formatFilter}
          onFilterChange={setFormatFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        <ReleaseGrid
          releases={filteredReleases}
          onEdit={handleOpenEdit}
          onDeleteRelease={handleDeleteRelease}
          onTradeRequest={handleOpenTrade}
        />
      </main>

      {/* 4. Modals & Drawers Container */}
      <ModalsContainer
        isAuthModalOpen={isAuthModalOpen}
        onCloseAuth={closeAuthModal}
        onAuthSuccess={handleLoginSuccess}
        isReleaseModalOpen={isModalOpen}
        onCloseReleaseModal={() => setIsModalOpen(false)}
        onSaveRelease={handleSaveRelease}
        editingRelease={editingRelease}
        isTradeModalOpen={isTradeModalOpen}
        onCloseTradeModal={() => setIsTradeModalOpen(false)}
        tradingRelease={tradingRelease}
        onSubmitTrade={handleTradeSubmit}
        isLogOpen={isLogOpen}
        onCloseLog={() => setIsLogOpen(false)}
        logs={logs}
        onClearLogs={() => setLogs(clearAllLogs())}
      />
    </div>
  );
}
