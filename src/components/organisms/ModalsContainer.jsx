import AuthModal from "../molecules/AuthModal";
import AddReleaseModal from "../molecules/AddReleaseModal";
import TradeProposalModal from "../molecules/TradeProposalModal";
import ActivityLogDrawer from "./ActivityLogDrawer";

export default function ModalsContainer({
  // Auth Modal
  isAuthModalOpen,
  onCloseAuth,
  onAuthSuccess,

  // Add/Edit Release Modal
  isReleaseModalOpen,
  onCloseReleaseModal,
  onSaveRelease,
  editingRelease,

  // Trade Modal
  isTradeModalOpen,
  onCloseTradeModal,
  tradingRelease,
  onSubmitTrade,

  // Activity Log Drawer
  isLogOpen,
  onCloseLog,
  logs,
  onClearLogs,
}) {
  return (
    <>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={onCloseAuth}
        onAuthSuccess={onAuthSuccess}
      />

      <AddReleaseModal
        isOpen={isReleaseModalOpen}
        onClose={onCloseReleaseModal}
        onSaveRelease={onSaveRelease}
        initialData={editingRelease}
      />

      <ActivityLogDrawer
        isOpen={isLogOpen}
        onClose={onCloseLog}
        logs={logs}
        onClearLogs={onClearLogs}
      />

      <TradeProposalModal
        key={tradingRelease ? tradingRelease.id : "closed"}
        isOpen={isTradeModalOpen}
        onClose={onCloseTradeModal}
        release={tradingRelease}
        onSubmit={onSubmitTrade}
      />
    </>
  );
}
