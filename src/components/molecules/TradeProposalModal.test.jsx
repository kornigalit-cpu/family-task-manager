import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TradeProposalModal from "./TradeProposalModal";

describe("TradeProposalModal Component", () => {
  const mockRelease = {
    id: "rel-1",
    title: "Unknown Pleasures",
    artist: "Joy Division",
    format: "Vinyl",
  };

  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onSubmit: vi.fn(),
    release: mockRelease,
  };

  it("does not render when isOpen is false", () => {
    const { container } = render(
      <TradeProposalModal {...defaultProps} isOpen={false} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("does not render when release is null", () => {
    const { container } = render(
      <TradeProposalModal {...defaultProps} release={null} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders modal content and release info when open", () => {
    render(<TradeProposalModal {...defaultProps} />);

    expect(screen.getByText(/Initiate Trade Proposal/i)).toBeInTheDocument();
    expect(screen.getByText("Unknown Pleasures")).toBeInTheDocument();
    expect(screen.getByText(/Joy Division • Vinyl/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/e\.g\. VinylJunkie_99/i),
    ).toBeInTheDocument();
  });

  it("shows an error message when submitting empty required fields", () => {
    render(<TradeProposalModal {...defaultProps} />);

    const submitBtn = screen.getByRole("button", { name: /Submit Proposal/i });
    fireEvent.click(submitBtn);

    expect(
      screen.getByText(/Please fill in both your name and what you offer/i),
    ).toBeInTheDocument();
    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  });

  it("calls onSubmit with entered data and closes modal when valid", () => {
    const onSubmit = vi.fn();
    const onClose = vi.fn();

    render(
      <TradeProposalModal
        {...defaultProps}
        onSubmit={onSubmit}
        onClose={onClose}
      />,
    );

    const nameInput = screen.getByPlaceholderText(/e\.g\. VinylJunkie_99/i);
    const offerInput = screen.getByPlaceholderText(/Joy Division/i);
    const notesInput = screen.getByPlaceholderText(
      /Condition, matrix numbers/i,
    );

    fireEvent.change(nameInput, { target: { value: "Alex" } });
    fireEvent.change(offerInput, {
      target: { value: "The Smiths - The Queen Is Dead" },
    });
    fireEvent.change(notesInput, { target: { value: "Near mint condition" } });

    const submitBtn = screen.getByRole("button", { name: /Submit Proposal/i });
    fireEvent.click(submitBtn);

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      releaseId: "rel-1",
      releaseTitle: "Unknown Pleasures",
      proposerName: "Alex",
      offeredItem: "The Smiths - The Queen Is Dead",
      notes: "Near mint condition",
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Cancel button or Close (✕) button is clicked", () => {
    const onClose = vi.fn();
    render(<TradeProposalModal {...defaultProps} onClose={onClose} />);

    const closeBtn = screen.getByText("✕");
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);

    const cancelBtn = screen.getByRole("button", { name: /Cancel/i });
    fireEvent.click(cancelBtn);
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
