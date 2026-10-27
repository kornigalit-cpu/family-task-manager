import { useModal, MODAL_TYPES } from "../../context/useModal";
import { useAuth } from "../../context/useAuth";
import AuthModal from "../molecules/AuthModal";
import AddReleaseModal from "../molecules/AddReleaseModal";
import TradeProposalModal from "../molecules/TradeProposalModal";
import ActivityLogDrawer from "./ActivityLogDrawer";

export default function ModalsContainer({
  onSaveRelease,
  onSubmitTrade,
  logs,
  onClearLogs,
}) {
  const { activeModal, modalPayload, closeModal } = useModal();
  const { login } = useAuth();

  return (
    <>
      {/* מודל הזדהות */}
      <AuthModal
        isOpen={activeModal === MODAL_TYPES.AUTH}
        onClose={closeModal}
        onAuthSuccess={(userData) => {
          login(userData);
          closeModal();
        }}
      />

      {/* מודל הוספה / עריכת אלבום */}
      <AddReleaseModal
        isOpen={activeModal === MODAL_TYPES.RELEASE_FORM}
        onClose={closeModal}
        onSaveRelease={(releaseData) => {
          onSaveRelease(releaseData);
          closeModal();
        }}
        initialData={
          activeModal === MODAL_TYPES.RELEASE_FORM ? modalPayload : null
        }
      />

      {/* מודל הצעת מסחר (טרייד) */}
      <TradeProposalModal
        key={
          activeModal === MODAL_TYPES.TRADE && modalPayload
            ? modalPayload.id
            : "closed"
        }
        isOpen={activeModal === MODAL_TYPES.TRADE}
        onClose={closeModal}
        release={activeModal === MODAL_TYPES.TRADE ? modalPayload : null}
        onSubmit={(proposal) => {
          onSubmitTrade(proposal);
          closeModal();
        }}
      />

      {/* מגירת לוגים של המערכת */}
      <ActivityLogDrawer
        isOpen={activeModal === MODAL_TYPES.LOGS}
        onClose={closeModal}
        logs={logs}
        onClearLogs={onClearLogs}
      />
    </>
  );
}
