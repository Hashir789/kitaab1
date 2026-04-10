"use client";

import { useMemo } from "react";
import styles from "./sliderdots.module.css";

type SliderDotsProps = {
  gap?: number;
  count: number;
  dotSize?: number;
  ariaLabel?: string;
  activeIndex: number;
  holeBackground?: string;
  onChange?: (index: number) => void;
};

export default function SliderDots({
  count,
  gap = 0,
  onChange,
  activeIndex,
  dotSize = 14,
  holeBackground,
  ariaLabel = "slider indicators",
}: SliderDotsProps) {
  const containerWidth = useMemo(() => count * dotSize + (count - 1) * gap, [count, dotSize, gap]);
  const activeLeft = useMemo(() => activeIndex * (dotSize + gap), [activeIndex, dotSize, gap]);

  return (
    <div
      className={styles.container}
      aria-label={ariaLabel}
      role="tablist"
      style={
        {
          "--container-width": `${containerWidth}px`,
          "--dot-size": `${dotSize}px`,
          "--dot-gap": `${gap}px`,
          "--dot-left": `${activeLeft}px`,
          ...(holeBackground ? { "--dot-hole-bg": holeBackground } : {}),
        } as React.CSSProperties
      }
    >
      <div className={styles.activeDot} />
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={`hole-${i}`}
          className={styles.dotHole}
          style={{ left: `${i * (dotSize + gap)}px` }}
          aria-hidden="true"
        />
      ))}
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={`btn-${i}`}
          className={styles.dotButton}
          role="tab"
          aria-selected={i === activeIndex}
          aria-label={`Go to slide ${i + 1}`}
          style={{ left: `${(i + 0.5) * (dotSize + gap)}px` }}
          onClick={() => onChange?.(i)}
          type="button"
        />
      ))}
    </div>
  );
}