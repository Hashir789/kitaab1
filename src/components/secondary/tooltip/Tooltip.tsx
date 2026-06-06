"use client";

import styles from "./Tooltip.module.css";
import { TooltipProps } from "./tooltip.interface";

export default function Tooltip({
  children,
  text,
  position = "bottom",
  className = "",
}: TooltipProps) {
  const positionClass = {
    top: styles.tooltipTop,
    bottom: styles.tooltipBottom,
    left: styles.tooltipLeft,
    right: styles.tooltipRight,
  }[position];

  return (
    <div className={`${styles.tooltipContainer} ${className}`.trim()}>
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
