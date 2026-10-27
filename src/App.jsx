import { useState, useEffect, useMemo, useCallback } from "react";
import Header from "./components/organisms/Header";
import ActionBar from "./components/organisms/ActionBar";
import FilterControls from "./components/organisms/FilterControls";
import ReleaseGrid from "./components/organisms/ReleaseGrid";
import ModalsContainer from "./components/organisms/ModalsContainer";
import { INITIAL_RELEASES } from "./data/initialReleases";
import { filterAndSortReleases } from "./utils/filterReleases";
import {
  loadReleasesFromStorage,
  saveReleasesToStorage,
} from "./utils/storage";
import {
  getStoredLogs,
  createLogEntry,
  clearAllLogs,
  LOG_TYPES,
} from "./utils/logger";
import { useAuth } from "./context/useAuth";
import { useModal, MODAL_TYPES } from "./context/useModal";

export default function App() {
  const { isAuthenticated } = useAuth();
  const { openModal } = useModal();

  // טעינה וסנכרון של ריליסים
  const [releases, setReleases] = useState(() => {
    return loadReleasesFromStorage(INITIAL_RELEASES);
  });

  // מסננים ובקרות חיפוש
  const [searchTerm, setSearchTerm] = useState("");
  const [formatFilter, setFormatFilter] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  // לוגים מקומיים
  const [logs, setLogs] = useState(() => getStoredLogs());

  // שמירה ל-localStorage בכל שינוי במערך האלבומים
  useEffect(() => {
    saveReleasesToStorage(releases);
  }, [releases]);

  // פונקציית עזר להגנת פעולות הדורשות הזדהות (Guard Pattern)
  const requireAuth = useCallback(
    (action) => {
      if (!isAuthenticated) {
        openModal(MODAL_TYPES.AUTH);
        return;
      }
      action();
    },
    [isAuthenticated, openModal],
  );

  // פתיחת מודל הוספה
  const handleOpenAdd = useCallback(() => {
    requireAuth(() => {
      openModal(MODAL_TYPES.RELEASE_FORM, null);
    });
  }, [requireAuth, openModal]);

  // פתיחת מודל עריכה
  const handleOpenEdit = useCallback(
    (release) => {
      requireAuth(() => {
        openModal(MODAL_TYPES.RELEASE_FORM, release);
      });
    },
    [requireAuth, openModal],
  );

  // פתיחת מודל טרייד
  const handleOpenTrade = useCallback(
    (release) => {
      requireAuth(() => {
        openModal(MODAL_TYPES.TRADE, release);
      });
    },
    [requireAuth, openModal],
  );

  // שמירת ריליס (הוספה או עדכון)
  const handleSaveRelease = useCallback((releaseData) => {
    if (!releaseData.title?.trim() || !releaseData.artist?.trim()) {
      const updatedLogs = createLogEntry({
        type: LOG_TYPES.VALIDATION_ERROR,
        title: "Validation Failed: Missing required fields",
        details: "Release title and artist cannot be empty",
      });
      setLogs(updatedLogs);
      return;
    }

    if (releaseData.id) {
      // עריכת אלבום קיים
      setReleases((prev) =>
        prev.map((r) => (r.id === releaseData.id ? { ...releaseData } : r)),
      );

      const updatedLogs = createLogEntry({
        type: LOG_TYPES.RELEASE_UPDATED,
        title: `Updated "${releaseData.title}"`,
        details: `${releaseData.artist} - ₪${releaseData.price || 0}`,
      });
      setLogs(updatedLogs);
    } else {
      // הוספת אלבום חדש
      const newRelease = {
        ...releaseData,
        id: Date.now().toString(),
      };
      setReleases((prev) => [newRelease, ...prev]);

      const updatedLogs = createLogEntry({
        type: LOG_TYPES.RELEASE_ADDED,
        title: `Added "${newRelease.title}"`,
        details: `${newRelease.artist} (${newRelease.format})`,
      });
      setLogs(updatedLogs);
    }
  }, []);

  // מחיקת ריליס
  const handleDeleteRelease = useCallback(
    (id) => {
      requireAuth(() => {
        const deletedItem = releases.find((r) => r.id === id);
        setReleases((prev) => prev.filter((r) => r.id !== id));

        const updatedLogs = createLogEntry({
          type: LOG_TYPES.RELEASE_DELETED,
          title: `Deleted "${deletedItem?.title || "Release"}"`,
          details: "Removed from vault archive",
        });
        setLogs(updatedLogs);
      });
    },
    [requireAuth, releases],
  );

  // שליחת הצעת טרייד
  const handleTradeSubmit = useCallback((proposalData) => {
    setReleases((prev) =>
      prev.map((r) =>
        r.id === proposalData.releaseId
          ? { ...r, status: "Pending", tradeProposal: proposalData }
          : r,
      ),
    );

    const updatedLogs = createLogEntry({
      type: LOG_TYPES.TRADE_REQUESTED,
      title: `Trade Proposed: "${proposalData.releaseTitle}"`,
      details: `Offered: "${proposalData.offeredItem}" by ${proposalData.proposerName}`,
    });
    setLogs(updatedLogs);
  }, []);

  const handleClearLogs = useCallback(() => {
    setLogs(clearAllLogs());
  }, []);

  // חישוב ממוטב (Memoized) של רשימת הריליסים
  const filteredReleases = useMemo(() => {
    return filterAndSortReleases(releases, {
      searchTerm,
      formatFilter,
      sortBy,
    });
  }, [releases, searchTerm, formatFilter, sortBy]);

  return (
    <div className="min-h-screen bg-[#0f1013] text-vault-text flex flex-col font-sans">
      {/* 1. Header Organism */}
      <Header />

      {/* 2. Action Bar Organism */}
      <ActionBar
        releasesCount={releases.length}
        onOpenAdd={handleOpenAdd}
        onOpenLogs={() => openModal(MODAL_TYPES.LOGS)}
        logsCount={logs.length}
      />

      {/* 3. Main Content: Controls & Grid Organisms */}
      <main className="max-w-7xl mx-auto w-full px-6 py-8 flex-1 flex flex-col gap-6">
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
          onEditRelease={handleOpenEdit}
          onDeleteRelease={handleDeleteRelease}
          onTradeRequest={handleOpenTrade}
        />
      </main>

      {/* 4. Modals Container (Consumes ModalContext directly) */}
      <ModalsContainer
        onSaveRelease={handleSaveRelease}
        onSubmitTrade={handleTradeSubmit}
        logs={logs}
        onClearLogs={handleClearLogs}
      />
    </div>
  );
}
