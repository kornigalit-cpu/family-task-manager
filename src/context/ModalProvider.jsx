import { useState, useCallback, useMemo } from "react";
import { ModalContext } from "./ModalContext";

export function ModalProvider({ children }) {
  const [modalState, setModalState] = useState({ type: null, payload: null });

  const openModal = useCallback((type, payload = null) => {
    setModalState({ type, payload });
  }, []);

  const closeModal = useCallback(() => {
    setModalState({ type: null, payload: null });
  }, []);

  const value = useMemo(
    () => ({
      activeModal: modalState.type,
      modalPayload: modalState.payload,
      openModal,
      closeModal,
      isOpen: Boolean(modalState.type),
    }),
    [modalState, openModal, closeModal],
  );

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
}
