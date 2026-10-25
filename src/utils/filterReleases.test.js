import { describe, it, expect } from "vitest";
import { filterAndSortReleases } from "./filterReleases";

const MOCK_RELEASES = [
  {
    id: "1",
    title: "Disintegration",
    artist: "The Cure",
    genre: "Goth Rock",
    format: "Vinyl",
    year: 1989,
    price: 180,
    forTrade: true,
  },
  {
    id: "2",
    title: "Unknown Pleasures",
    artist: "Joy Division",
    genre: "Post-Punk",
    format: "Cassette",
    year: 1979,
    price: 120,
    forTrade: false,
  },
  {
    id: "3",
    title: "Loveless",
    artist: "My Bloody Valentine",
    genre: "Shoegaze",
    format: "Vinyl",
    year: 1991,
    price: 240,
    forTrade: true,
  },
  {
    id: "4",
    title: "First and Last and Always",
    artist: "The Sisters of Mercy",
    genre: "Goth Rock",
    format: "Cassette",
    year: 1985,
    price: 90,
    forTrade: false,
  },
];

describe("Issue #28: Filtering and Sorting Logic", () => {
  describe("Format and Trade Filtering", () => {
    it("returns all releases when format is 'All'", () => {
      const result = filterAndSortReleases(MOCK_RELEASES, {
        formatFilter: "All",
      });
      expect(result).toHaveLength(4);
    });

    it("filters correctly by 'Vinyl' format", () => {
      const result = filterAndSortReleases(MOCK_RELEASES, {
        formatFilter: "Vinyl",
      });
      expect(result).toHaveLength(2);
      expect(result.every((r) => r.format === "Vinyl")).toBe(true);
    });

    it("filters correctly by 'Cassette' format", () => {
      const result = filterAndSortReleases(MOCK_RELEASES, {
        formatFilter: "Cassette",
      });
      expect(result).toHaveLength(2);
      expect(result.every((r) => r.format === "Cassette")).toBe(true);
    });

    it("filters items marked strictly as 'For Trade'", () => {
      const result = filterAndSortReleases(MOCK_RELEASES, {
        formatFilter: "For Trade",
      });
      expect(result).toHaveLength(2);
      expect(result.every((r) => r.forTrade === true)).toBe(true);
      expect(result.map((r) => r.title)).toEqual([
        "Disintegration",
        "Loveless",
      ]);
    });
  });

  describe("Sorting Criteria", () => {
    it("sorts by price: low to high", () => {
      const result = filterAndSortReleases(MOCK_RELEASES, {
        sortBy: "price-asc",
      });
      expect(result.map((r) => r.price)).toEqual([90, 120, 180, 240]);
    });

    it("sorts by price: high to low", () => {
      const result = filterAndSortReleases(MOCK_RELEASES, {
        sortBy: "price-desc",
      });
      expect(result.map((r) => r.price)).toEqual([240, 180, 120, 90]);
    });

    it("sorts by release year: newest first", () => {
      const result = filterAndSortReleases(MOCK_RELEASES, {
        sortBy: "year-desc",
      });
      expect(result.map((r) => r.year)).toEqual([1991, 1989, 1985, 1979]);
    });

    it("sorts by release year: oldest first", () => {
      const result = filterAndSortReleases(MOCK_RELEASES, {
        sortBy: "year-asc",
      });
      expect(result.map((r) => r.year)).toEqual([1979, 1985, 1989, 1991]);
    });
  });

  describe("Combined Criteria (Search + Format + Sort)", () => {
    it("handles search query, format filter, and price sorting simultaneously", () => {
      const result = filterAndSortReleases(MOCK_RELEASES, {
        searchTerm: "goth",
        formatFilter: "Vinyl",
        sortBy: "price-asc",
      });

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("Disintegration");
    });

    it("returns empty array when search query matches no items in the active filter", () => {
      const result = filterAndSortReleases(MOCK_RELEASES, {
        searchTerm: "Joy Division",
        formatFilter: "Vinyl",
      });

      expect(result).toHaveLength(0);
    });
  });
});
