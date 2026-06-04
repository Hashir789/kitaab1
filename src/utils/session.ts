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

export function logout(): void {
  clearUserSession();
  window.location.href = "/auth";
}