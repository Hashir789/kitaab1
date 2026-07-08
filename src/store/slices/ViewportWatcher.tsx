'use client';

import { useEffect } from "react";
import { setViewport } from "./uiSlice";
import { useAppDispatch } from "@/store/hooks";

export function ViewportWatcher() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const update = () => dispatch(setViewport({ width: window.innerWidth, height: window.innerHeight }));
    update();
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
    };
  }, [dispatch]);

  return null;
}