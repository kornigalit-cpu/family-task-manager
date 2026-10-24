import { describe, it, expect } from "vitest";
import {
  isValidText,
  isValidYear,
  isValidPrice,
  isValidUrl,
  validateRelease,
} from "./validators";

describe("Validation Utility Functions", () => {
  describe("isValidText", () => {
    it("returns true for non-empty string", () => {
      expect(isValidText("Unknown Pleasures")).toBe(true);
    });

    it("returns false for empty or whitespace-only string", () => {
      expect(isValidText("")).toBe(false);
      expect(isValidText("   ")).toBe(false);
      expect(isValidText(null)).toBe(false);
    });
  });

  describe("isValidYear", () => {
    it("returns true for valid vintage and current years", () => {
      expect(isValidYear(1979)).toBe(true);
      expect(isValidYear("1994")).toBe(true);
    });

    it("returns false for years before 1900 or non-integers", () => {
      expect(isValidYear(1899)).toBe(false);
      expect(isValidYear(1994.5)).toBe(false);
      expect(isValidYear("not-a-year")).toBe(false);
    });
  });

  describe("isValidPrice", () => {
    it("accepts zero and positive values", () => {
      expect(isValidPrice(0)).toBe(true);
      expect(isValidPrice(120)).toBe(true);
      expect(isValidPrice("45.50")).toBe(true);
    });

    it("rejects negative numbers and non-numeric inputs", () => {
      expect(isValidPrice(-10)).toBe(false);
      expect(isValidPrice("free")).toBe(false);
    });
  });

  describe("isValidUrl", () => {
    it("accepts valid http and https URLs", () => {
      expect(isValidUrl("https://images.unsplash.com/photo-1")).toBe(true);
      expect(isValidUrl("http://example.com/art.jpg")).toBe(true);
    });

    it("rejects invalid or malformed URLs", () => {
      expect(isValidUrl("javascript:alert(1)")).toBe(false);
      expect(isValidUrl("not-a-url")).toBe(false);
      expect(isValidUrl("")).toBe(false);
    });
  });

  describe("validateRelease aggregator", () => {
    it("validates a correct release object with no errors", () => {
      const validItem = {
        title: "Closer",
        artist: "Joy Division",
        year: 1980,
        price: 90,
        coverUrl: "https://example.com/cover.jpg",
      };
      const result = validateRelease(validItem);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it("collects errors for invalid fields", () => {
      const invalidItem = {
        title: "   ",
        artist: "",
        year: 1850,
        price: -5,
        coverUrl: "invalid-url",
      };
      const result = validateRelease(invalidItem);
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBeDefined();
      expect(result.errors.artist).toBeDefined();
      expect(result.errors.year).toBeDefined();
      expect(result.errors.price).toBeDefined();
      expect(result.errors.coverUrl).toBeDefined();
    });
  });
});
