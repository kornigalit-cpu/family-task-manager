import { useState, useEffect, useCallback } from "react";
import { loginUser, registerUser } from "../../utils/authService";

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = useCallback(() => {
    setUsername("");
    setEmail("");
    setPassword("");
    setError("");
    setShowPassword(false);
    setIsLoading(false);
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const switchMode = (newMode) => {
    setMode(newMode);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
      let user;
      if (mode === "login") {
        user = await loginUser({ username, password });
      } else {
        user = await registerUser({ username, email, password });
      }

      resetForm();
      if (onAuthSuccess) {
        onAuthSuccess(user);
      }
      onClose();
    } catch (err) {
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl border border-vault-purple/50 bg-[#110f1a] shadow-[0_0_35px_rgba(168,85,247,0.28)] text-gray-100 relative">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors text-xl font-bold"
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="flex border-b border-gray-800 mb-6">
          <button
            type="button"
            onClick={() => switchMode("login")}
            className={`flex-1 pb-3 text-sm font-semibold tracking-wide transition-all border-b-2 ${
              mode === "login"
                ? "border-vault-purple text-vault-purple drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            Access Terminal (Sign In)
          </button>
          <button
            type="button"
            onClick={() => switchMode("register")}
            className={`flex-1 pb-3 text-sm font-semibold tracking-wide transition-all border-b-2 ${
              mode === "register"
                ? "border-vault-purple text-vault-purple drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            Create Vault ID (Sign Up)
          </button>
        </div>

        <h2
          id="auth-modal-title"
          className="text-xl font-bold mb-1 tracking-wider text-white"
        >
          {mode === "login"
            ? "Welcome Back, Collector"
            : "Join the Underground Vault"}
        </h2>
        <p className="text-xs text-gray-400 mb-5">
          {mode === "login"
            ? "Identify yourself to initiate swaps and manage catalog items."
            : "Establish your local encrypted collector profile."}
        </p>

        {error && (
          <div className="mb-4 p-3 text-xs text-red-400 bg-red-950/40 border border-red-800/80 rounded-lg flex items-center gap-2">
            <span>⚠</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-gray-300 mb-1 text-xs uppercase tracking-wider font-semibold">
              Collector Handle / Username *
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. SonicDistortion"
              autoComplete="username"
              className="w-full bg-[#1b1828] border border-gray-700 rounded-lg px-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-vault-purple focus:ring-1 focus:ring-vault-purple transition-all"
            />
          </div>

          {mode === "register" && (
            <div>
              <label className="block text-gray-300 mb-1 text-xs uppercase tracking-wider font-semibold">
                Email Address (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="collector@underground.io"
                autoComplete="email"
                className="w-full bg-[#1b1828] border border-gray-700 rounded-lg px-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-vault-purple focus:ring-1 focus:ring-vault-purple transition-all"
              />
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-gray-300 text-xs uppercase tracking-wider font-semibold">
                Secret Passcode *
              </label>
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-xs text-gray-400 hover:text-vault-purple transition-colors"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              className="w-full bg-[#1b1828] border border-gray-700 rounded-lg px-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-vault-purple focus:ring-1 focus:ring-vault-purple transition-all"
            />
            {mode === "register" && (
              <span className="text-[11px] text-gray-500 mt-1 block">
                Must be at least 6 characters (hashed locally via SHA-256).
              </span>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg bg-vault-purple hover:bg-purple-600 text-white font-semibold tracking-wide transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading
                ? "Processing..."
                : mode === "login"
                  ? "Authorize & Enter"
                  : "Register & Launch"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
