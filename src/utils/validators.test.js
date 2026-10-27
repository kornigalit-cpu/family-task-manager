import { describe, it, expect } from "vitest";
import {
  isValidText,
  isValidYear,
  isValidPrice,
  isValidUrl,
  validateRelease,
  validateTradeProposal,
} from "./validators";

describe("Validation Utilities Suite", () => {
  describe("isValidText", () => {
    it("returns true for valid strings", () => {
      expect(isValidText("The Cure")).toBe(true);
      expect(isValidText("  Joy Division  ")).toBe(true);
    });

    it("returns false for empty strings or whitespaces", () => {
      expect(isValidText("")).toBe(false);
      expect(isValidText("   ")).toBe(false);
    });

    it("returns false for non-string types", () => {
      expect(isValidText(null)).toBe(false);
      expect(isValidText(undefined)).toBe(false);
      expect(isValidText(123)).toBe(false);
      expect(isValidText({})).toBe(false);
    });
  });

  describe("isValidPrice", () => {
    it("returns true for valid positive numbers and 0", () => {
      expect(isValidPrice(150)).toBe(true);
      expect(isValidPrice(0)).toBe(true);
      expect(isValidPrice("0")).toBe(true);
      expect(isValidPrice("99.9")).toBe(true);
    });

    it("returns false for negative values", () => {
      expect(isValidPrice(-10)).toBe(false);
      expect(isValidPrice("-1")).toBe(false);
    });

    it("returns false for empty strings and whitespace (Falsy coercion check)", () => {
      expect(isValidPrice("")).toBe(false);
      expect(isValidPrice("   ")).toBe(false);
      expect(isValidPrice(null)).toBe(false);
      expect(isValidPrice(undefined)).toBe(false);
    });

    it("returns false for non-numeric strings", () => {
      expect(isValidPrice("free")).toBe(false);
    });
  });

  describe("isValidYear", () => {
    const currentYear = new Date().getFullYear();

    it("accepts valid years within range", () => {
      expect(isValidYear(1989)).toBe(true);
      expect(isValidYear("1989")).toBe(true);
      expect(isValidYear(currentYear)).toBe(true);
      expect(isValidYear(currentYear + 1)).toBe(true);
    });

    it("rejects years before 1900 or too far in the future", () => {
      expect(isValidYear(1899)).toBe(false);
      expect(isValidYear(currentYear + 2)).toBe(false);
    });

    it("rejects non-integer and invalid types", () => {
      expect(isValidYear(1989.5)).toBe(false);
      expect(isValidYear("")).toBe(false);
      expect(isValidYear(null)).toBe(false);
    });
  });

  describe("isValidUrl", () => {
    it("accepts valid http and https URLs", () => {
      expect(isValidUrl("https://example.com/cover.jpg")).toBe(true);
      expect(isValidUrl("http://images.com/art.png")).toBe(true);
    });

    it("rejects dangerous or invalid protocols (XSS prevention)", () => {
      expect(isValidUrl("javascript:alert(1)")).toBe(false);
      expect(isValidUrl("data:text/html;base64,PHNjcmlwdD4=")).toBe(false);
      expect(isValidUrl("ftp://files.com/art.jpg")).toBe(false);
      expect(isValidUrl("not-a-url")).toBe(false);
      expect(isValidUrl(null)).toBe(false);
    });
  });

  describe("validateRelease", () => {
    it("returns isValid: true for a complete valid release", () => {
      const validRelease = {
        title: "Disintegration",
        artist: "The Cure",
        year: 1989,
        price: 180,
        coverUrl: "https://example.com/disintegration.jpg",
      };

      const result = validateRelease(validRelease);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it("safely handles null or non-object payloads without crashing", () => {
      const nullResult = validateRelease(null);
      expect(nullResult.isValid).toBe(false);
      expect(nullResult.errors.general).toBeDefined();

      const undefinedResult = validateRelease(undefined);
      expect(undefinedResult.isValid).toBe(false);
    });

    it("accumulates multiple validation errors accurately", () => {
      const invalidRelease = {
        title: "   ",
        artist: "",
        year: 1850,
        price: -5,
        coverUrl: "invalid-url",
      };

      const result = validateRelease(invalidRelease);
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBe("Title is required");
      expect(result.errors.artist).toBe("Artist is required");
      expect(result.errors.year).toBeDefined();
      expect(result.errors.price).toBe("Price must be 0 or a positive number");
      expect(result.errors.coverUrl).toBeDefined();
    });
    it("accepts a release when optional price is omitted or empty", () => {
      const releaseWithoutPrice = {
        title: "Unknown Pleasures",
        artist: "Joy Division",
        year: 1979,
        price: "",
      };

      const result = validateRelease(releaseWithoutPrice);
      expect(result.isValid).toBe(true);
      expect(result.errors.price).toBeUndefined();
    });
  });

  describe("validateTradeProposal", () => {
    it("validates successfully with proper name and offered item", () => {
      const proposal = {
        proposerName: "VinylFanatic_88",
        offeredItem: "Joy Division - Closer (Original Press)",
      };

      const result = validateTradeProposal(proposal);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it("safely handles null or non-object payloads", () => {
      const result = validateTradeProposal(null);
      expect(result.isValid).toBe(false);
      expect(result.errors.general).toBeDefined();
    });

    it("flags missing or whitespace-only fields", () => {
      const invalidProposal = {
        proposerName: "   ",
        offeredItem: "",
      };

      const result = validateTradeProposal(invalidProposal);
      expect(result.isValid).toBe(false);
      expect(result.errors.proposerName).toBe(
        "Collector name / tag is required",
      );
      expect(result.errors.offeredItem).toBe(
        "Offered item details are required",
      );
    });
  });
});
