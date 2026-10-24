import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  STORAGE_KEY,
  loadReleasesFromStorage,
  saveReleasesToStorage,
} from "./storage";

describe("storage utils (Persistence & Edge Cases)", () => {
  const mockFallback = [{ id: 1, title: "Fallback Release" }];

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe("loadReleasesFromStorage", () => {
    it("returns fallback data when localStorage is empty", () => {
      const result = loadReleasesFromStorage(mockFallback);
      expect(result).toEqual(mockFallback);
    });

    it("correctly deserializes and returns valid JSON data from storage", () => {
      const savedData = [
        { id: 2, title: "Disintegration", artist: "The Cure" },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedData));

      const result = loadReleasesFromStorage(mockFallback);
      expect(result).toEqual(savedData);
    });

    it("returns fallback data when stored JSON is malformed/corrupted", () => {
      localStorage.setItem(STORAGE_KEY, "{ invalid json structure");

      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const result = loadReleasesFromStorage(mockFallback);

      expect(result).toEqual(mockFallback);
      expect(consoleSpy).toHaveBeenCalled();
    });

    it("returns fallback data when stored data is valid JSON but not an array", () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ notAn: "array" }));

      const result = loadReleasesFromStorage(mockFallback);
      expect(result).toEqual(mockFallback);
    });
  });

  describe("saveReleasesToStorage", () => {
    it("successfully serializes and saves array to localStorage", () => {
      const dataToSave = [{ id: 10, title: "Unknown Pleasures" }];
      const success = saveReleasesToStorage(dataToSave);

      expect(success).toBe(true);
      expect(localStorage.getItem(STORAGE_KEY)).toBe(
        JSON.stringify(dataToSave),
      );
    });

    it("handles storage quota exceeded errors gracefully", () => {
      vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        const error = new Error("QuotaExceededError");
        error.name = "QuotaExceededError";
        throw error;
      });

      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const success = saveReleasesToStorage([{ id: 1 }]);

      expect(success).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();
    });

    it("handles circular JSON serialization errors safely", () => {
      const circularObj = {};
      circularObj.self = circularObj;

      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const success = saveReleasesToStorage(circularObj);

      expect(success).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();
    });
  });
});
