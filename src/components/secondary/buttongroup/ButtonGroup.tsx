"use client";

import styles from "./buttongroup.module.css";
import { ReactNode, Children, isValidElement, cloneElement } from "react";

type ButtonGroupProps = {
  gap?: number;
  padding?: number;
  fontSize?: number;
  className?: string;
  ariaLabel?: string;
  children: ReactNode;
  activeIndex?: number;
  buttonWidth?: number;
  buttonHeight?: number;
};

export default function ButtonGroup({
  children,
  activeIndex = -1,
  buttonWidth = 100,
  buttonHeight = 35,
  gap = 12,
  padding = 5,
  fontSize = 16,
  className = "",
  ariaLabel,
}: ButtonGroupProps) {
  const childrenArray = Children.toArray(children).filter(isValidElement);
  const leftPos = padding + (activeIndex === -1 ? 0 : activeIndex * (buttonWidth + gap));
  const containerWidth =
    padding * 2 + childrenArray.length * buttonWidth + (childrenArray.length - 1) * gap + 2;
  const containerHeight = padding * 2 + buttonHeight + 2;

  const hasActive = activeIndex !== -1;

  return (
    <ul
      className={`${styles.buttonGroup} ${!hasActive ? styles.noActive : ""} ${className}`}
      role="list"
      aria-label={ariaLabel}
      style={{
        "--active-left": `${leftPos}px`,
        "--button-width": `${buttonWidth}px`,
        "--button-height": `${buttonHeight}px`,
        "--gap": `${gap}px`,
        "--padding": `${padding}px`,
        "--container-width": `${containerWidth}px`,
        "--container-height": `${containerHeight}px`,
        "--font-size": `${fontSize}px`,
      } as React.CSSProperties}
    >
      {childrenArray.map((child, index) => {
        const leftPosition = padding + index * (buttonWidth + gap);
        const isActive = index === activeIndex;
        const itemClass = `${styles.buttonItem} ${isActive ? styles.buttonItemActive : ""}`;

        return (
          <li
            key={index}
            className={itemClass}
            role="listitem"
            style={{ left: `${leftPosition}px` }}
          >
            {cloneElement(child as any, {
              "aria-current": isActive ? "page" : undefined,
            } as any)}
          </li>
        );
      })}
    </ul>
  );
}
