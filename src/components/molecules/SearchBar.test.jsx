import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchBar from "./SearchBar";

describe("SearchBar Component", () => {
  it("renders input with default placeholder and value", () => {
    render(<SearchBar value="Joy Division" onChange={() => {}} />);

    const input = screen.getByPlaceholderText(
      /search by artist, album, or genre/i,
    );
    expect(input).toBeInTheDocument();
    expect(input.value).toBe("Joy Division");
  });

  it("calls onChange when user types in the input", () => {
    const handleChange = vi.fn();
    render(<SearchBar value="" onChange={handleChange} />);

    const input = screen.getByPlaceholderText(
      /search by artist, album, or genre/i,
    );
    fireEvent.change(input, { target: { value: "Bauhaus" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("renders clear button when value is present and clears input on click", () => {
    const handleChange = vi.fn();
    render(<SearchBar value="The Cure" onChange={handleChange} />);

    const clearButton = screen.getByLabelText("Clear search");
    expect(clearButton).toBeInTheDocument();

    fireEvent.click(clearButton);
    expect(handleChange).toHaveBeenCalledWith({ target: { value: "" } });
  });
});
