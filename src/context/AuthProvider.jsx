import { useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  getCurrentUser,
  logoutUser as performLogout,
} from "../utils/authService";

export function AuthProvider({ children }) {
  // המשתמש נטען כבר בהרצה הראשונית מה-Storage
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    performLogout();
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
    handleLoginSuccess,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
