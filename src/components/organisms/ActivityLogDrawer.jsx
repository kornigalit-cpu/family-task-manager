import { useEffect, useRef } from "react";
import { exportLogsToFile } from "../../utils/logger";

export default function ActivityLogDrawer({
  isOpen,
  onClose,
  logs = [],
  onClearLogs,
}) {
  const drawerRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previousActiveElement = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // שמירת האלמנט שהיה בפוקוס לפני פתיחת המגירה כדי להחזיר אליו את הפוקוס בסגירה
    previousActiveElement.current = document.activeElement;

    // העברת הפוקוס מיד לכפתור הסגירה של המגירה
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    // ניהול מקלדת: Escape לסגירה ו-Focus Trap עבור Tab
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key === "Tab" && drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          // Shift + Tab: חזרה מהאלמנט הראשון לאחרון
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: מעבר מהאלמנט האחרון חזרה לראשון
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    // שימוש ב-capture: true כדי לתפוס את המקש לפני כל רכיב אחר בדף
    window.addEventListener("keydown", handleKeyDown, true);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown, true);
      // החזרת הפוקוס לאלמנט המקורי שלחץ על פתיחת המגירה
      if (
        previousActiveElement.current &&
        typeof previousActiveElement.current.focus === "function"
      ) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formatTime = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch {
      return "";
    }
  };

  const getBadgeStyle = (type) => {
    switch (type) {
      case "RELEASE_ADDED":
        return "text-[#ccff00] border-[#ccff00]/40 bg-[#ccff00]/10";
      case "RELEASE_UPDATED":
        return "text-[#9d4edd] border-[#9d4edd]/40 bg-[#9d4edd]/10";
      case "RELEASE_DELETED":
      case "VALIDATION_ERROR":
        return "text-red-400 border-red-500/40 bg-red-500/10";
      case "TRADE_REQUESTED":
        return "text-[#ff6b35] border-[#ff6b35]/40 bg-[#ff6b35]/10";
      default:
        return "text-zinc-300 border-zinc-600 bg-zinc-800";
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity"
      role="presentation"
    >
      {/* לחיצה על השטח הכהה ברקע סוגרת את המגירה */}
      <div className="flex-1" onClick={onClose} aria-hidden="true" />

      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="activity-log-title"
        className="w-full max-w-md bg-[#121216] border-l border-zinc-800 h-full flex flex-col shadow-2xl p-6 text-zinc-100 outline-none"
        tabIndex="-1"
      >
        {/* כותרת וכפתור סגירה נגיש */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ccff00] animate-pulse" />
            <h2
              id="activity-log-title"
              className="text-lg font-bold tracking-wide uppercase text-zinc-100"
            >
              My Activity
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close activity log"
            className="text-zinc-400 hover:text-white transition-all p-1.5 rounded-lg text-xl leading-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ccff00] focus-visible:text-white hover:bg-zinc-800"
            title="Close (Esc)"
          >
            ✕
          </button>
        </div>

        {/* רשימת הלוגים */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
          {logs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500 text-sm">
              <p>No activity recorded yet.</p>
              <p className="text-xs text-zinc-600 mt-1">
                Actions in the vault will appear here.
              </p>
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800/80 flex flex-col gap-1.5 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${getBadgeStyle(
                      log.type,
                    )}`}
                  >
                    {log.type.replace("_", " ")}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500">
                    {formatTime(log.timestamp)}
                  </span>
                </div>

                <div className="text-sm font-medium text-zinc-200">
                  {log.title}
                </div>

                {log.details && (
                  <div className="text-xs text-zinc-400 font-mono">
                    {log.details}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* שורת סיכום, ייצוא וניקוי בתחתית עם פוקוס נגיש */}
        {logs.length > 0 && (
          <div className="pt-4 border-t border-zinc-800 flex justify-between items-center text-xs gap-2 flex-wrap">
            <span className="text-zinc-500 font-mono">
              Total logs: {logs.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => exportLogsToFile(logs)}
                className="text-xs text-[#ccff00] hover:text-black border border-[#ccff00]/40 hover:bg-[#ccff00] px-3 py-1.5 rounded transition-all font-mono font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ccff00]"
                title="Download activity history as JSON file"
              >
                Export JSON
              </button>
              <button
                type="button"
                onClick={onClearLogs}
                className="text-xs text-zinc-400 hover:text-red-400 border border-zinc-700 hover:border-red-500/50 px-3 py-1.5 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
