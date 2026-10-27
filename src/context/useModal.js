import { useContext } from "react";
import { ModalContext, MODAL_TYPES } from "./ModalContext";

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}

export { MODAL_TYPES };
