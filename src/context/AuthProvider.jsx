import { useState, useMemo, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import { getCurrentUser, logoutUser } from "../utils/authService";

export function AuthProvider({ children }) {
  // אתחול עצל מקריאת הסשן הפעיל מתוך authService
  const [user, setUser] = useState(() => getCurrentUser());

  const login = useCallback((userData) => {
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    logoutUser();
    setUser(null);
  }, []);

  // הערך נשמר יציב בזיכרון כל עוד המשתמש לא התחבר או התנתק
  const contextValue = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user, login, logout],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
