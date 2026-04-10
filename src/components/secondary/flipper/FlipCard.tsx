"use client";

import React, { ReactNode, useCallback, useLayoutEffect, useRef, useState } from "react";
import styles from "./flipcard.module.css";

type FlipCardProps = {
  front: ReactNode;
  back: ReactNode;
  ariaLabel?: string;
  className?: string;
  flipped?: boolean;
  width?: number | string;
  height?: number | string;
  initialFlipped?: boolean;
};

export default function FlipCard({
  front,
  back,
  width,
  height,
  ariaLabel,
  className,
  flipped,
  initialFlipped = false,
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(initialFlipped);
  const frontRef = useRef<HTMLDivElement | null>(null);
  const backRef = useRef<HTMLDivElement | null>(null);
  const [computedHeight, setComputedHeight] = useState<number | undefined>(undefined);

  const toggle = useCallback(() => setIsFlipped((p) => !p), []);
  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;
    
    const noFlipEl = target.closest("[data-noflip]");
    if (noFlipEl) return;

    if (target.closest("[data-flip]")) toggle();
  }, [toggle]);

  React.useEffect(() => {
    if (typeof flipped === "boolean") {
      setIsFlipped(flipped);
    }
  }, [flipped]);

  useLayoutEffect(() => {
    const compute = () => {
      const frontHeight = frontRef.current?.offsetHeight ?? 0;
      const backHeight = backRef.current?.offsetHeight ?? 0;
      const activeHeight = isFlipped ? backHeight : frontHeight;
      setComputedHeight(activeHeight || undefined);
    };
    compute();
    const ro = new ResizeObserver(compute);
    if (frontRef.current) ro.observe(frontRef.current);
    if (backRef.current) ro.observe(backRef.current);
    window.addEventListener("resize", compute);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, [isFlipped]);

  return (
    <div
      className={`${styles.flipRoot} ${className ?? ""}`}
      aria-label={ariaLabel}
      style={{
        ...(width !== undefined ? { width } : {}),
        ...(height !== undefined ? { height } : {}),
        ...(computedHeight !== undefined && height === undefined ? { height: computedHeight } : {}),
      }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        const target = e.target as HTMLElement | null;
        
        if (
          target &&
          (target.closest("input, textarea, select, button, a, [contenteditable='true']") ||
            target.getAttribute("contenteditable") === "true")
        ) {
          return;
        }
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      }}
    >
      <div
        className={styles.flipInner}
        style={{ transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        <div ref={frontRef} className={styles.flipFaceFront} aria-hidden={isFlipped} style={{ pointerEvents: isFlipped ? "none" : "auto" }}>
          {front}
        </div>
        <div ref={backRef} className={styles.flipFaceBack} aria-hidden={!isFlipped} style={{ pointerEvents: isFlipped ? "auto" : "none" }}>
          {back}
        </div>
      </div>
    </div>
  );
}

