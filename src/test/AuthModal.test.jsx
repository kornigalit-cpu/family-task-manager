import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AuthModal from "../components/molecules/AuthModal";
import * as authService from "../utils/authService";

vi.mock("../utils/authService", () => ({
  loginUser: vi.fn(),
  registerUser: vi.fn(),
}));

describe("AuthModal Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not render when isOpen is false", () => {
    render(
      <AuthModal isOpen={false} onClose={() => {}} onAuthSuccess={() => {}} />,
    );
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("renders sign in fields and switches tabs smoothly", () => {
    render(
      <AuthModal isOpen={true} onClose={() => {}} onAuthSuccess={() => {}} />,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/Access Terminal/i)).toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText(/collector@underground.io/i),
    ).toBeNull();

    // לחיצה על טאב יצירת חשבון
    fireEvent.click(screen.getByText(/Create Vault ID/i));

    // מוודאים ששדה האימייל הופיע
    expect(
      screen.getByPlaceholderText(/collector@underground.io/i),
    ).toBeInTheDocument();
  });

  it("displays client validation error for short input", async () => {
    render(
      <AuthModal isOpen={true} onClose={() => {}} onAuthSuccess={() => {}} />,
    );

    fireEvent.change(screen.getByPlaceholderText(/SonicDistortion/i), {
      target: { value: "ab" },
    });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), {
      target: { value: "123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Authorize & Enter/i }));

    expect(
      await screen.findByText(/Username must be at least 3 characters/i),
    ).toBeInTheDocument();
  });

  it("calls loginUser and triggers onAuthSuccess on valid submission", async () => {
    const mockUser = { id: "usr-1", username: "VinylKing" };
    authService.loginUser.mockResolvedValueOnce(mockUser);

    const onAuthSuccess = vi.fn();
    const onClose = vi.fn();

    render(
      <AuthModal
        isOpen={true}
        onClose={onClose}
        onAuthSuccess={onAuthSuccess}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText(/SonicDistortion/i), {
      target: { value: "VinylKing" },
    });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), {
      target: { value: "secretPass123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Authorize & Enter/i }));

    await waitFor(() => {
      expect(authService.loginUser).toHaveBeenCalledWith({
        username: "VinylKing",
        password: "secretPass123",
      });
      expect(onAuthSuccess).toHaveBeenCalledWith(mockUser);
      expect(onClose).toHaveBeenCalled();
    });
  });
});
