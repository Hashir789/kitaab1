"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./Tooltip.module.css";
import { TooltipProps } from "./tooltip.interface";

type ResolvedPosition = "top" | "bottom" | "left" | "right";

const floatingTransforms: Record<ResolvedPosition, string> = {
  top: "translate(-50%, -100%)",
  bottom: "translate(-50%, 0)",
  left: "translate(-100%, -50%)",
  right: "translate(0, -50%)",
};

const TOOLTIP_GAP = 8;

function resolveAutoVerticalPosition(
  rect: DOMRect,
  tooltipHeight: number,
  gap: number
): "top" | "bottom" {
  const viewportHeight = window.innerHeight;
  const spaceBelow = viewportHeight - rect.bottom - gap;
  const spaceAbove = rect.top - gap;

  if (spaceBelow >= tooltipHeight) {
    return "bottom";
  }

  if (spaceAbove >= tooltipHeight) {
    return "top";
  }

  return spaceBelow >= spaceAbove ? "bottom" : "top";
}

function getFloatingCoords(rect: DOMRect, resolvedPosition: ResolvedPosition, gap: number) {
  switch (resolvedPosition) {
    case "top":
      return { top: rect.top - gap, left: rect.left + rect.width / 2 };
    case "bottom":
      return { top: rect.bottom + gap, left: rect.left + rect.width / 2 };
    case "left":
      return { top: rect.top + rect.height / 2, left: rect.left - gap };
    case "right":
      return { top: rect.top + rect.height / 2, left: rect.right + gap };
  }
}

export default function Tooltip({
  children,
  text,
  position = "bottom",
  className = "",
  floating = false,
}: TooltipProps) {
  const tooltipId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);
  const [resolvedPosition, setResolvedPosition] = useState<ResolvedPosition>("bottom");
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [isPositioned, setIsPositioned] = useState(false);

  const shouldFloat =
    floating || position === "left" || position === "right";

  const staticPosition: ResolvedPosition = position === "auto" ? "bottom" : position;

  const positionClass = {
    top: styles.tooltipTop,
    bottom: styles.tooltipBottom,
    left: styles.tooltipLeft,
    right: styles.tooltipRight,
  }[staticPosition];

  const floatingPositionClass = {
    top: styles.tooltipFloatingTop,
    bottom: styles.tooltipFloatingBottom,
    left: styles.tooltipFloatingLeft,
    right: styles.tooltipFloatingRight,
  }[resolvedPosition];

  const updateLayout = useCallback(() => {
    const element = containerRef.current;
    if (!element) {
      return;
    }

    const rect = element.getBoundingClientRect();
    let nextPosition: ResolvedPosition;

    if (position === "auto") {
      const tooltipHeight = tooltipRef.current?.getBoundingClientRect().height ?? 0;
      nextPosition = resolveAutoVerticalPosition(rect, tooltipHeight, TOOLTIP_GAP);
    } else {
      nextPosition = position;
    }

    setResolvedPosition(nextPosition);
    setCoords(getFloatingCoords(rect, nextPosition, TOOLTIP_GAP));
    setIsPositioned(true);
  }, [position]);

  const showTooltip = () => {
    if (!shouldFloat) {
      return;
    }

    setIsPositioned(false);
    setVisible(true);
  };

  const hideTooltip = () => {
    if (!shouldFloat) {
      return;
    }

    setVisible(false);
    setIsPositioned(false);
  };

  useLayoutEffect(() => {
    if (!shouldFloat || !visible) {
      return;
    }

    updateLayout();

    if (position !== "auto") {
      return;
    }

    const frame = requestAnimationFrame(() => updateLayout());
    return () => cancelAnimationFrame(frame);
  }, [shouldFloat, visible, text, position, updateLayout]);

  useEffect(() => {
    if (!shouldFloat || !visible) {
      return;
    }

    const handleReposition = () => updateLayout();
    window.addEventListener("scroll", handleReposition, true);
    window.addEventListener("resize", handleReposition);

    return () => {
      window.removeEventListener("scroll", handleReposition, true);
      window.removeEventListener("resize", handleReposition);
    };
  }, [shouldFloat, visible, updateLayout]);

  if (!shouldFloat) {
    return (
      <div className={`${styles.tooltipContainer} ${className}`.trim()}>
        {children}
        <span
          className={`${styles.tooltip} ${positionClass}`}
          role="tooltip"
          aria-live="polite"
          data-component="tooltip"
          data-tooltip-position={staticPosition}
        >
          {text}
        </span>
      </div>
    );
  }

  const floatingTooltip =
    visible && typeof document !== "undefined"
      ? createPortal(
          <span
            ref={tooltipRef}
            id={tooltipId}
            className={`${styles.tooltip} ${styles.tooltipFloating} ${floatingPositionClass}`}
            role="tooltip"
            aria-live="polite"
            data-component="tooltip"
            data-tooltip-position={resolvedPosition}
            style={{
              top: coords.top,
              left: coords.left,
              transform: floatingTransforms[resolvedPosition],
              opacity: isPositioned ? 1 : 0,
            }}
          >
            {text}
          </span>,
          document.body
        )
      : null;

  return (
    <>
      <div
        ref={containerRef}
        className={`${styles.tooltipContainer} ${className}`.trim()}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        {children}
      </div>
      {floatingTooltip}
    </>
  );
}
