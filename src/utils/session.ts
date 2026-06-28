import { deedType, localStorageKeys, sessionStorageKeys, sessionStorageValues } from "@/constants/enums";

interface TokenPayload {
  sub?: string;
  email?: string;
}

function decodeTokenPayload(token: string): TokenPayload | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    return JSON.parse(
      atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
    ) as TokenPayload;
  } catch {
    return null;
  }
}

export function clearUserSession(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(localStorageKeys.ACCESS_TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(localStorageKeys.MASTER_KEY_STORAGE_KEY);
  clearPendingPassword();
}

export function setMasterKey(masterKey: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    localStorageKeys.MASTER_KEY_STORAGE_KEY,
    masterKey
  );
}

export function getMasterKey(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(localStorageKeys.MASTER_KEY_STORAGE_KEY);
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(localStorageKeys.ACCESS_TOKEN_STORAGE_KEY);
}

function getTokenExpiry(token: string): number | null {
  const payload = decodeTokenPayload(token);
  if (!payload || typeof (payload as { exp?: number }).exp !== "number") return null;
  return (payload as { exp: number }).exp;
}

export function getUserIdFromToken(): string | null {
  const token = getAccessToken();
  if (!token) return null;
  const payload = decodeTokenPayload(token);
  return payload?.sub ?? null;
}

export function getEmailFromToken(): string | null {
  const token = getAccessToken();
  if (!token) return null;
  const payload = decodeTokenPayload(token);
  return payload?.email ?? null;
}

export function setPendingPassword(password: string): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(sessionStorageKeys.PENDING_PASSWORD, password);
}

export function getPendingPassword(): string | null {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(sessionStorageKeys.PENDING_PASSWORD);
}

export function clearPendingPassword(): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(sessionStorageKeys.PENDING_PASSWORD);
}

export function setDeedCreateSuccessPending(): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(
    sessionStorageKeys.DEED_CREATE_SUCCESS,
    sessionStorageValues.TRACKED
  );
}

export function consumeDeedCreateSuccessPending(): boolean {
  if (typeof window === "undefined") return false;

  const pending =
    window.sessionStorage.getItem(sessionStorageKeys.DEED_CREATE_SUCCESS) ===
    sessionStorageValues.TRACKED;

  if (pending) {
    window.sessionStorage.removeItem(sessionStorageKeys.DEED_CREATE_SUCCESS);
  }

  return pending;
}

export type PendingScaleDeed = {
  categoryType: deedType;
  displayOrder: number;
  deedId?: string;
  deedItemId?: string;
};

export function setPendingScaleDeed(deed: PendingScaleDeed): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(sessionStorageKeys.PENDING_SCALE_DEED, JSON.stringify(deed));
}

export function getPendingScaleDeed(): PendingScaleDeed | null {
  if (typeof window === "undefined") return null;

  const raw = window.sessionStorage.getItem(sessionStorageKeys.PENDING_SCALE_DEED);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as PendingScaleDeed;
    if (parsed.categoryType === undefined || parsed.displayOrder === undefined) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function clearPendingScaleDeed(): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(sessionStorageKeys.PENDING_SCALE_DEED);
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