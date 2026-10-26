const USERS_STORAGE_KEY = "vault_users";
const SESSION_STORAGE_KEY = "vault_current_user";

/**
 * מנגנון גיבוב סיסמאות מאובטח באמצעות Web Crypto API (SHA-256)
 */
export async function hashPassword(plainTextPassword) {
  if (!plainTextPassword || typeof plainTextPassword !== "string") {
    throw new Error("Password must be a non-empty string");
  }
  const encoder = new TextEncoder();
  const data = encoder.encode(plainTextPassword);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

/**
 * שליפת כלל המשתמשים מ-LocalStorage
 */
export function getRegisteredUsers() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("Failed to parse users from localStorage:", error);
    return [];
  }
}

/**
 * שמירת רשימת משתמשים ב-LocalStorage
 */
function saveRegisteredUsers(users) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

/**
 * רישום משתמש חדש
 */
export async function registerUser({ username, email, password }) {
  const cleanUsername = username?.trim();
  const cleanEmail = email?.trim().toLowerCase();

  if (!cleanUsername || cleanUsername.length < 3) {
    throw new Error("Username must be at least 3 characters long");
  }

  if (!password || password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }

  const users = getRegisteredUsers();

  const userExists = users.some(
    (u) => u.username.toLowerCase() === cleanUsername.toLowerCase(),
  );

  if (userExists) {
    throw new Error("Username is already taken");
  }

  const passwordHash = await hashPassword(password);

  const newUser = {
    id: `usr-${Date.now()}`,
    username: cleanUsername,
    email: cleanEmail || "",
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveRegisteredUsers(users);

  // שמירת סשן פעיל (ללא ה-hash של הסיסמה)
  const sessionUser = {
    id: newUser.id,
    username: newUser.username,
    email: newUser.email,
  };
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionUser));

  return sessionUser;
}

/**
 * התחברות משתמש קיים
 */
export async function loginUser({ username, password }) {
  const cleanUsername = username?.trim();

  if (!cleanUsername || !password) {
    throw new Error("Username and password are required");
  }

  const users = getRegisteredUsers();
  const matchedUser = users.find(
    (u) => u.username.toLowerCase() === cleanUsername.toLowerCase(),
  );

  if (!matchedUser) {
    throw new Error("Invalid username or password");
  }

  const inputHash = await hashPassword(password);

  if (inputHash !== matchedUser.passwordHash) {
    throw new Error("Invalid username or password");
  }

  const sessionUser = {
    id: matchedUser.id,
    username: matchedUser.username,
    email: matchedUser.email,
  };

  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionUser));
  return sessionUser;
}

/**
 * שליפת המשתמש המחובר כעת
 */
export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error("Failed to get current user session:", error);
    return null;
  }
}

/**
 * התנתקות ומחיקת סשן פעיל
 */
export function logoutUser() {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}
