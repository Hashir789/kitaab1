import { deviceType, localStorageKeys } from "@/constants/enums";

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

export function getDeviceType(): deviceType {
  const ua = window.navigator.userAgent;
  const isIpadOs = /Macintosh/.test(ua) && window.navigator.maxTouchPoints > 1;

  if (isIpadOs || /iPad|Tablet|PlayBook|Silk/i.test(ua) || (/Android/i.test(ua) && !/Mobi/i.test(ua))) {
    return deviceType.TABLET;
  }
  if (/Mobi|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    return deviceType.MOBILE;
  }
  return deviceType.DESKTOP;
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