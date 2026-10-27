import { createContext } from "react";

export const ModalContext = createContext(null);

export const MODAL_TYPES = Object.freeze({
  AUTH: "AUTH",
  RELEASE_FORM: "RELEASE_FORM",
  TRADE: "TRADE",
  LOGS: "LOGS",
});
