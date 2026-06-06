"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useTrackVisitor } from "@/hooks/visitors";
import type { TrackVisitorPayload } from "@/interfaces/visitors";
import { localStorageKeys, sessionStorageKeys, sessionStorageValues } from "@/constants/enums";
import { getDeviceType, getOrCreateAnonymousId, getTimezone, readTrackedCounts, resetTrackedCounts } from "@/utils/visitor";

function incrementCounter(key: localStorageKeys): void {
  const current = Number(window.localStorage.getItem(key)) || 0;
  window.localStorage.setItem(key, String(current + 1));
}

function decrementCounter(key: localStorageKeys): void {
  const current = Number(window.localStorage.getItem(key)) || 0;
  if (current <= 0) return;
  window.localStorage.setItem(key, String(current - 1));
}

export default function SessionTracker() {
  const { mutate } = useTrackVisitor();
  const sentRef = useRef(false);
  const pathname = usePathname();
  const isFirstPathnameRef = useRef(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sentRef.current) return;
    if (window.sessionStorage.getItem(sessionStorageKeys.VISITOR_TRACKED) === sessionStorageValues.TRACKED) return;
    sentRef.current = true;
    window.sessionStorage.setItem(sessionStorageKeys.VISITOR_TRACKED, sessionStorageValues.TRACKED);

    const { clicks, navigations } = readTrackedCounts();
    resetTrackedCounts();

    const payload: TrackVisitorPayload = {
      timezone: getTimezone(),
      device_type: getDeviceType(),
      anonymous_id: getOrCreateAnonymousId()
    };
    if (clicks > 0) payload.clicks = clicks;
    if (navigations > 0) payload.navigations = navigations;

    mutate(payload);
  }, [mutate]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleClick = () => incrementCounter(localStorageKeys.CLICKS);
    window.addEventListener("click", handleClick, { capture: true });
    return () => window.removeEventListener("click", handleClick, { capture: true });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isFirstPathnameRef.current) {
      isFirstPathnameRef.current = false;
      return;
    }
    incrementCounter(localStorageKeys.NAVIGATIONS);
    decrementCounter(localStorageKeys.CLICKS);
  }, [pathname]);

  return null;
}