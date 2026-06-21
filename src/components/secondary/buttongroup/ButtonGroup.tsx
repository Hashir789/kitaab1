"use client";

import styles from "./buttongroup.module.css";
import { ButtonGroupProps } from "./buttongroup.interface";
import { Children, isValidElement, cloneElement } from "react";

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
}: ButtonGroupProps) {
  const childrenArray = Children.toArray(children).filter(isValidElement);
  const borderOffset = bordered ? 2 : 0;
  const leftPos = padding + (activeIndex === -1 ? 0 : activeIndex * (buttonWidth + gap));
  const containerWidth = padding * 2 + childrenArray.length * buttonWidth + (childrenArray.length - 1) * gap + borderOffset;
  const containerHeight = padding * 2 + buttonHeight + borderOffset;

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
