"use client";

import { ReactNode } from "react";
import styles from "./Tooltip.module.css";

type TooltipPosition = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  children: ReactNode;
  text: string;
  position?: TooltipPosition;
}

export default function Tooltip({
  children,
  text,
  position = "bottom",
}: TooltipProps) {
  const positionClass = {
    top: styles.tooltipTop,
    bottom: styles.tooltipBottom,
    left: styles.tooltipLeft,
    right: styles.tooltipRight,
  }[position];

  return (
    <div className={styles.tooltipContainer}>
      {children}
      <span
        className={`${styles.tooltip} ${positionClass}`}
        role="tooltip"
        aria-live="polite"
        data-component="tooltip"
        data-tooltip-position={position}
      >
        {text}
      </span>
    </div>
  );
}
