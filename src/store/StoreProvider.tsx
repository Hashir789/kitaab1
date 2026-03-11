"use client";

import { store } from "./store";
import { useRef, useEffect } from "react";
import { updateViewport } from "./uiSlice";
import { Provider, useDispatch } from "react-redux";

function ViewportListener() {
  const dispatch = useDispatch();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      dispatch(
        updateViewport({
          width: window.innerWidth,
          height: window.innerHeight,
        })
      );
    };

    if (!hasInitialized.current) {
      handleResize();
      hasInitialized.current = true;
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  return null;
}

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <ViewportListener />
      {children}
    </Provider>
  );
}
