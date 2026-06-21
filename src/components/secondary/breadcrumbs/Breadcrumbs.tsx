"use client";

import styles from "./breadcrumbs.module.css";
import { useAppSelector } from "@/store/hooks";
import { BreadcrumbsProps } from "./breadcrumbs.interface";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ButtonGroup from "@/components/secondary/buttongroup/ButtonGroup";
import { breadcrumbAria, breadcrumbTabLabel } from "@/constants/placeholders";

function getStripWidth(count: number, buttonWidth: number, gap: number, padding: number) {
  return padding * 2 + buttonWidth * count + gap * (count - 1);
}

const Breadcrumbs = ({
  count = 5,
  gap = 12,
  padding = 5,
  className = "",
  buttonWidth = 110,
  buttonHeight = 35,
  mobileOffset = 74,
  ariaLabel = breadcrumbAria.BREADCRUMBS,
  getLabel = breadcrumbTabLabel,
}: BreadcrumbsProps) => {
  const isBelow880 = useAppSelector((state) => state.ui.isBelow880);
  const stripRef = useRef<HTMLDivElement>(null);
  const hasScrolledToEndRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(count - 1);
  const [stripScrollable, setStripScrollable] = useState(false);

  const stripWidth = getStripWidth(count, buttonWidth, gap, padding);

  useEffect(() => {
    setActiveIndex(count - 1);
  }, [count]);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;

    hasScrolledToEndRef.current = false;

    const updateScrollable = () => {
      const isScrollable = strip.scrollWidth > strip.clientWidth + 1;
      setStripScrollable(isScrollable);

      if (!isScrollable) {
        hasScrolledToEndRef.current = false;
        strip.scrollLeft = 0;
        return;
      }

      if (!hasScrolledToEndRef.current) {
        strip.scrollLeft = strip.scrollWidth - strip.clientWidth;
        hasScrolledToEndRef.current = true;
      }
    };

    updateScrollable();

    const observer = new ResizeObserver(updateScrollable);
    observer.observe(strip);

    return () => observer.disconnect();
  }, [stripWidth, count]);

  useLayoutEffect(() => {
    if (!stripScrollable) return;

    const strip = stripRef.current;
    if (!strip) return;

    strip.scrollLeft = strip.scrollWidth - strip.clientWidth;
  }, [stripScrollable, count]);

  return (
    <div
      className={`${styles.wrap} ${isBelow880 ? styles.wrapMobile : ""} ${className}`}
      style={{ "--mobile-offset": `${mobileOffset}px` } as React.CSSProperties}
    >
      <div
        ref={stripRef}
        className={`${styles.strip} ${stripScrollable ? styles.stripScrollable : ""} ${isBelow880 ? styles.stripMobile : ""}`}
        aria-label={ariaLabel}
        style={{ "--strip-width": `${stripWidth}px` } as React.CSSProperties}
      >
        <ButtonGroup
          activeIndex={activeIndex}
          buttonWidth={buttonWidth}
          buttonHeight={buttonHeight}
          gap={gap}
          padding={padding}
          bordered={false}
          ariaLabel={ariaLabel}
          className={styles.stripGroup}
        >
          {Array.from({ length: count }, (_, index) => (
            <button key={index} type="button" onClick={() => setActiveIndex(index)}>
              {getLabel(index)}
            </button>
          ))}
        </ButtonGroup>
      </div>
    </div>
  );
};

export default Breadcrumbs;