import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  LOG_TYPES,
  getStoredLogs,
  saveLogs,
  createLogEntry,
  clearAllLogs,
  exportLogsToFile,
} from "./logger";

describe("Logger Utility Suite", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("initializes with an empty array when storage is empty", () => {
    expect(getStoredLogs()).toEqual([]);
  });

  it("creates a new log entry and prepends it to the list", () => {
    const updated = createLogEntry({
      type: LOG_TYPES.RELEASE_ADDED,
      title: 'Added "Unknown Pleasures"',
      details: "Joy Division (Vinyl)",
    });

    expect(updated).toHaveLength(1);
    expect(updated[0].type).toBe(LOG_TYPES.RELEASE_ADDED);
    expect(updated[0].title).toBe('Added "Unknown Pleasures"');
    expect(updated[0].id).toBeDefined();
    expect(updated[0].timestamp).toBeDefined();
  });

  it("falls back to SYSTEM_ERROR when an invalid log type is provided", () => {
    const updated = createLogEntry({
      type: "UNREGISTERED_MAGIC_STRING",
      title: "Unknown action",
    });

    expect(updated[0].type).toBe(LOG_TYPES.SYSTEM_ERROR);
  });

  it("caps maximum history at 50 entries", () => {
    const dummyLogs = Array.from({ length: 50 }, (_, i) => ({
      id: `log_${i}`,
      type: LOG_TYPES.RELEASE_UPDATED,
      title: `Event ${i}`,
      details: "",
      timestamp: new Date().toISOString(),
    }));

    saveLogs(dummyLogs);

    const updated = createLogEntry({
      type: LOG_TYPES.RELEASE_ADDED,
      title: "Overflow Event",
    });

    expect(updated).toHaveLength(50);
    expect(updated[0].title).toBe("Overflow Event");
  });

  it("clears all logs correctly", () => {
    createLogEntry({
      type: LOG_TYPES.RELEASE_ADDED,
      title: "To be cleared",
    });

    const cleared = clearAllLogs();
    expect(cleared).toEqual([]);
    expect(getStoredLogs()).toEqual([]);
  });

  it("safely generates a downloadable JSON file for export", () => {
    // 1. הגדרת Mock לפונקציות ה-URL שאינן קיימות ב-JSDOM
    globalThis.URL.createObjectURL = vi.fn(
      () => "blob:http://localhost/mock-log-url",
    );
    globalThis.URL.revokeObjectURL = vi.fn();

    // 2. האזנה ללחיצה על אלמנט קישור
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});

    const testLogs = [
      { id: "1", type: LOG_TYPES.RELEASE_ADDED, title: "Test release" },
    ];

    const success = exportLogsToFile(testLogs);

    expect(success).toBe(true);
    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(globalThis.URL.createObjectURL).toHaveBeenCalledTimes(1);
    expect(globalThis.URL.revokeObjectURL).toHaveBeenCalledTimes(1);
  });
});
