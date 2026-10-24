import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import AddReleaseModal from "./AddReleaseModal";

describe("AddReleaseModal Component", () => {
  it("does not render when isOpen is false", () => {
    render(
      <AddReleaseModal
        isOpen={false}
        onClose={() => {}}
        onSaveRelease={() => {}}
      />,
    );

    expect(screen.queryByText(/add new release/i)).not.toBeInTheDocument();
  });

  it("displays validation error messages and blocks submission when required fields are empty", () => {
    const handleSave = vi.fn();

    const { container } = render(
      <AddReleaseModal
        isOpen={true}
        onClose={() => {}}
        onSaveRelease={handleSave}
      />,
    );

    // שליחת הטופס כשהשדות ריקים
    const form = container.querySelector("form");
    fireEvent.submit(form);

    // בדיקה שהודעות השגיאה מופיעות ב-DOM
    expect(screen.getByText("Title is required")).toBeInTheDocument();
    expect(screen.getByText("Artist is required")).toBeInTheDocument();

    // בדיקה שפונקציית השמירה נחסמה
    expect(handleSave).not.toHaveBeenCalled();
  });

  it("submits successfully when required fields are valid", () => {
    const handleSave = vi.fn();
    const handleClose = vi.fn();

    const { container } = render(
      <AddReleaseModal
        isOpen={true}
        onClose={handleClose}
        onSaveRelease={handleSave}
      />,
    );

    // מילוי שדות החובה
    const titleInput = screen.getByPlaceholderText(/e\.g\. pornography/i);
    const artistInput = screen.getByPlaceholderText(/e\.g\. the cure/i);

    fireEvent.change(titleInput, {
      target: { name: "title", value: "Disintegration" },
    });
    fireEvent.change(artistInput, {
      target: { name: "artist", value: "The Cure" },
    });

    // שליחת הטופס
    const form = container.querySelector("form");
    fireEvent.submit(form);

    // וידוא שהשמירה הצליחה והמודאל נסגר
    expect(handleSave).toHaveBeenCalledTimes(1);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
