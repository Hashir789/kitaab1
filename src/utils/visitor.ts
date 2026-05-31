import { localStorageKeys } from "@/constants/enums";
import type { DeviceType } from "@/interfaces/visitors";

export function getOrCreateAnonymousId(): string {
  let id = window.localStorage.getItem(localStorageKeys.ANONYMOUS_ID);
  if (!id) {
    const bytes = new Uint8Array(8);
    crypto.getRandomValues(bytes);
    id = Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    window.localStorage.setItem(localStorageKeys.ANONYMOUS_ID, id);
  }
  return id;
}

export function getDeviceType(): DeviceType {
  const ua = window.navigator.userAgent;
  const isIpadOs = /Macintosh/.test(ua) && window.navigator.maxTouchPoints > 1;

  if (isIpadOs || /iPad|Tablet|PlayBook|Silk/i.test(ua) || (/Android/i.test(ua) && !/Mobi/i.test(ua))) {
    return "tablet";
  }
  if (/Mobi|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    return "mobile";
  }
  return "desktop";
}

export function getTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function readTrackedCounts(): { clicks: number; navigations: number } {
  const clicks = Number(window.localStorage.getItem(localStorageKeys.CLICKS)) || 0;
  const navigations = Number(window.localStorage.getItem(localStorageKeys.NAVIGATIONS)) || 0;
  return { clicks, navigations };
}

export function resetTrackedCounts(): void {
  window.localStorage.setItem(localStorageKeys.CLICKS, "0");
  window.localStorage.setItem(localStorageKeys.NAVIGATIONS, "0");
}