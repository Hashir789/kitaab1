import { localStorageKeys } from "@/constants/enums";
import type { UserSession } from "@/interfaces/user";

export function getUserSession(): UserSession | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(localStorageKeys.USER_SESSION_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserSession;
  } catch {
    return null;
  }
}

export function setUserSession(session: UserSession): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    localStorageKeys.USER_SESSION_STORAGE_KEY,
    JSON.stringify(session)
  );
}

export function clearUserSession(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(localStorageKeys.USER_SESSION_STORAGE_KEY);
  window.localStorage.removeItem(localStorageKeys.ACCESS_TOKEN_STORAGE_KEY);
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(localStorageKeys.ACCESS_TOKEN_STORAGE_KEY);
}

function getTokenExpiry(token: string): number | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const payload = JSON.parse(
      atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
    );
    return typeof payload.exp === "number" ? payload.exp : null;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  const token = getAccessToken();
  if (!token) return false;

  const exp = getTokenExpiry(token);
  if (exp !== null && exp * 1000 <= Date.now()) {
    clearUserSession();
    return false;
  }

  return true;
}

export function logout(): void {
  clearUserSession();
  window.location.href = "/auth";
}