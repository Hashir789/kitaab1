"use client";

import styles from "./buttongroup.module.css";
import { ButtonGroupProps } from "./buttongroup.interface";
import Tooltip from "@/components/secondary/tooltip/Tooltip";
import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type ReactElement,
} from "react";

function getSegmentLabelWidth(label: string): number {
  return Math.max(48, Math.ceil(label.length * 8.5) + 16);
}

function wrapSegmentLabel(
  label: string,
  showTooltip: boolean,
  tooltipPosition: "top" | "bottom" | "left" | "right"
) {
  const text = <span className={styles.segmentLabel}>{label}</span>;

  if (!showTooltip) {
    return text;
  }

  return (
    <Tooltip
      text={label}
      position={tooltipPosition}
      floating
      className={styles.segmentTooltip}
    >
      {text}
    </Tooltip>
  );
}

export default function ButtonGroup({
  children,
  gap = 12,
  ariaLabel,
  padding = 5,
  fontSize = 16,
  className = "",
  bordered = true,
  activeIndex = -1,
  buttonWidth = 100,
  buttonHeight = 35,
  fullWidth = false,
  truncateLabels = false,
  tooltipPosition = "top",
}: ButtonGroupProps) {
  const groupRef = useRef<HTMLUListElement | null>(null);
  const [measuredWidth, setMeasuredWidth] = useState(0);
  const childrenArray = Children.toArray(children).filter(isValidElement);
  const borderOffset = bordered ? 2 : 0;
  const hasActive = activeIndex !== -1;

  useEffect(() => {
    if (!fullWidth || !groupRef.current) return;

    const element = groupRef.current;
    const updateWidth = () => setMeasuredWidth(element.offsetWidth);
    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);
    return () => observer.disconnect();
  }, [fullWidth, childrenArray.length, gap, padding, bordered]);

  const resolvedButtonWidth = fullWidth && measuredWidth > 0
    ? Math.max(
        0,
        (measuredWidth - padding * 2 - gap * Math.max(childrenArray.length - 1, 0) - borderOffset) /
          Math.max(childrenArray.length, 1)
      )
    : buttonWidth;

  const leftPos =
    padding + (activeIndex === -1 ? 0 : activeIndex * (resolvedButtonWidth + gap));
  const containerWidth = fullWidth
    ? measuredWidth || "100%"
    : padding * 2 +
      childrenArray.length * resolvedButtonWidth +
      (childrenArray.length - 1) * gap +
      borderOffset;
  const containerHeight = padding * 2 + buttonHeight + borderOffset;

  return (
    <ul
      ref={groupRef}
      className={`${styles.buttonGroup} ${fullWidth ? styles.buttonGroupFullWidth : ""} ${truncateLabels ? styles.truncateLabels : ""} ${!hasActive ? styles.noActive : ""} ${className}`.trim()}
      role="list"
      aria-label={ariaLabel}
      style={{
        "--active-left": `${leftPos}px`,
        "--button-width": `${resolvedButtonWidth}px`,
        "--button-height": `${buttonHeight}px`,
        "--gap": `${gap}px`,
        "--padding": `${padding}px`,
        "--container-width": typeof containerWidth === "number" ? `${containerWidth}px` : containerWidth,
        "--container-height": `${containerHeight}px`,
        "--font-size": `${fontSize}px`,
      } as React.CSSProperties}
    >
      {childrenArray.map((child, index) => {
        const leftPosition = padding + index * (resolvedButtonWidth + gap);
        const isActive = index === activeIndex;
        const itemClass = `${styles.buttonItem} ${isActive ? styles.buttonItemActive : ""}`;
        const childElement = child as ReactElement<{ children?: React.ReactNode }>;
        const label =
          typeof childElement.props.children === "string"
            ? childElement.props.children
            : "";
        const showTooltip =
          truncateLabels &&
          Boolean(label) &&
          getSegmentLabelWidth(label) > resolvedButtonWidth;
        const childrenContent =
          truncateLabels && label
            ? wrapSegmentLabel(label, showTooltip, tooltipPosition)
            : childElement.props.children;

        return (
          <li
            key={index}
            className={itemClass}
            role="listitem"
            style={{ left: `${leftPosition}px` }}
          >
            {cloneElement(childElement, {
              "aria-current": isActive ? "page" : undefined,
              children: childrenContent,
            } as Record<string, unknown>)}
          </li>
        );
      })}
    </ul>
  );
}
