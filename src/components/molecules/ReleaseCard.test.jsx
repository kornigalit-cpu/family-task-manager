import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ReleaseCard from "./ReleaseCard";

const mockRelease = {
  id: "rel-1",
  title: "Unknown Pleasures",
  artist: "Joy Division",
  format: "Vinyl",
  genre: "Post-Punk",
  condition: "Mint",
  year: 1979,
  price: 120,
  forTrade: true,
  coverUrl:
    "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=400&q=80",
};

describe("ReleaseCard Component", () => {
  it("renders release details correctly", () => {
    render(
      <ReleaseCard
        release={mockRelease}
        onTradeRequest={() => {}}
        onDeleteRelease={() => {}}
        onEditRelease={() => {}}
      />,
    );

    expect(screen.getByText("Unknown Pleasures")).toBeInTheDocument();
    expect(screen.getByText("Joy Division")).toBeInTheDocument();
    expect(screen.getByText(/1979/)).toBeInTheDocument();
  });

  it("triggers onEditRelease with release data when edit button is clicked", () => {
    const handleEdit = vi.fn();
    render(
      <ReleaseCard
        release={mockRelease}
        onTradeRequest={() => {}}
        onDeleteRelease={() => {}}
        onEditRelease={handleEdit}
      />,
    );

    const editBtn = screen.getByRole("button", { name: /edit/i });
    fireEvent.click(editBtn);

    expect(handleEdit).toHaveBeenCalledTimes(1);
    expect(handleEdit).toHaveBeenCalledWith(mockRelease);
  });

  it("triggers onDeleteRelease with release id when delete button is clicked", () => {
    const handleDelete = vi.fn();
    render(
      <ReleaseCard
        release={mockRelease}
        onTradeRequest={() => {}}
        onDeleteRelease={handleDelete}
        onEditRelease={() => {}}
      />,
    );

    const deleteBtn = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteBtn);

    expect(handleDelete).toHaveBeenCalledTimes(1);
    expect(handleDelete).toHaveBeenCalledWith("rel-1");
  });
  it("triggers onTradeRequest when trade button is clicked", () => {
    const handleTrade = vi.fn();
    render(
      <ReleaseCard
        release={mockRelease}
        onTradeRequest={handleTrade}
        onDeleteRelease={() => {}}
        onEditRelease={() => {}}
      />,
    );

    // לחיצה על כפתור Trade (אם קיים טקסט Trade או Trade Request)
    const tradeBtn = screen.getByRole("button", { name: /trade/i });
    fireEvent.click(tradeBtn);

    expect(handleTrade).toHaveBeenCalledTimes(1);
    expect(handleTrade).toHaveBeenCalledWith(mockRelease);
  });
});
