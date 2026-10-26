import { useAuth } from "../../context/useAuth";
import logoImg from "../../assets/Logo_Vault.jpg";

export default function Header() {
  const { currentUser, openAuthModal, logout } = useAuth();

  const userInitials = currentUser?.username
    ? currentUser.username.slice(0, 2).toUpperCase()
    : "UV";

  return (
    <header className="w-full border-b border-gray-800/80 bg-[#0d0b14]/90 backdrop-blur-md sticky top-0 z-40 px-6 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* צד שמאל: כאן נכנס הלוגו לצד שם האפליקציה */}
        <div className="flex items-center gap-3.5">
          <img
            src={logoImg}
            alt="Underground Vault Logo"
            className="w-10 h-10 object-contain rounded-full shadow-[0_0_12px_rgba(204,255,0,0.25)] hover:rotate-180 transition-transform duration-700 cursor-pointer"
          />
          <div className="flex flex-col">
            <h1 className="text-lg sm:text-xl font-black tracking-widest text-white uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] leading-none">
              Underground Vault
            </h1>
            <span className="text-[10px] sm:text-xs text-gray-500 tracking-[0.2em] uppercase font-semibold mt-1">
              Independent Physical Music Archive
            </span>
          </div>
        </div>

        {/* צד ימין: פרופיל וסשן */}
        <div className="flex items-center gap-4">
          {currentUser ? (
            <div className="flex items-center gap-3 bg-[#161224] border border-vault-purple/40 px-3.5 py-1.5 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.15)]">
              <div className="w-8 h-8 rounded-full bg-vault-purple/20 border border-vault-purple text-vault-purple font-mono font-bold text-xs flex items-center justify-center">
                {userInitials}
              </div>

              <div className="flex flex-col text-left">
                <span className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold leading-tight flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Collector
                </span>
                <span className="text-xs font-bold text-white tracking-wide">
                  {currentUser.username}
                </span>
              </div>

              <button
                type="button"
                onClick={logout}
                className="ml-2 text-xs text-gray-400 hover:text-red-400 transition-colors p-1"
                title="Disconnect session"
                aria-label="Logout"
              >
                ⏻
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={openAuthModal}
              className="px-4 py-2 text-xs uppercase tracking-widest font-bold text-vault-purple border border-vault-purple/60 rounded-lg bg-vault-purple/10 hover:bg-vault-purple hover:text-white transition-all shadow-[0_0_12px_rgba(168,85,247,0.2)] hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] active:scale-95"
            >
              SIGN IN
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
