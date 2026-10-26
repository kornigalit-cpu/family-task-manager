import "../utils/authService";
import { describe, it, expect, beforeEach } from "vitest";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  hashPassword,
} from "../utils/authService";

describe("authService", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("hashes plain-text passwords into SHA-256 strings", async () => {
    const hash = await hashPassword("cyberpunk2077");
    expect(typeof hash).toBe("string");
    expect(hash.length).toBe(64);
  });

  it("registers a new user and sets the active session", async () => {
    const user = await registerUser({
      username: "VinylHunter",
      email: "vinyl@vault.io",
      password: "password123",
    });

    expect(user.username).toBe("VinylHunter");
    expect(getCurrentUser()).toEqual(user);
  });

  it("rejects duplicate usernames", async () => {
    await registerUser({
      username: "CollectorOne",
      password: "password123",
    });

    await expect(
      registerUser({
        username: "collectorone",
        password: "diffPassword",
      }),
    ).rejects.toThrow("Username is already taken");
  });

  it("authenticates valid credentials successfully", async () => {
    await registerUser({
      username: "Rocker99",
      password: "secretPassword",
    });

    logoutUser();
    expect(getCurrentUser()).toBeNull();

    const loggedIn = await loginUser({
      username: "Rocker99",
      password: "secretPassword",
    });

    expect(loggedIn.username).toBe("Rocker99");
    expect(getCurrentUser()).toEqual(loggedIn);
  });

  it("rejects login with an invalid password", async () => {
    await registerUser({
      username: "Rocker99",
      password: "secretPassword",
    });

    await expect(
      loginUser({
        username: "Rocker99",
        password: "wrongPassword",
      }),
    ).rejects.toThrow("Invalid username or password");
  });
});
