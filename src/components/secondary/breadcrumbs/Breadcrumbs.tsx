"use client";

import Link from "next/link";
import styles from "./breadcrumbs.module.css";
import { useAppSelector } from "@/store/hooks";
import { BreadcrumbsProps } from "./breadcrumbs.interface";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import ButtonGroup from "@/components/secondary/buttongroup/ButtonGroup";
import { breadcrumbAria } from "@/constants/placeholders";
import { useParams, usePathname } from "next/navigation";
import {
  getBreadcrumbButtonWidth,
  getBreadcrumbConfig,
  getBreadcrumbStripWidth,
} from "@/utils/breadcrumbs";
import { useScaleItems } from "@/hooks/scales";

const Breadcrumbs = ({
  gap = 12,
  padding = 5,
  className = "",
  buttonHeight = 35,
  mobileOffset = 74,
  ariaLabel = breadcrumbAria.BREADCRUMBS,
}: BreadcrumbsProps) => {
  const pathname = usePathname();
  const params = useParams<{ id: string; deedItemId?: string }>();
  const isBelow880 = useAppSelector((state) => state.ui.isBelow880);
  const stripRef = useRef<HTMLDivElement>(null);
  const hasScrolledToEndRef = useRef(false);
  const [stripScrollable, setStripScrollable] = useState(false);
  const deedItemId = params.deedItemId;
  const isDeedRoute = Boolean(deedItemId && pathname.includes(`/deeds/${deedItemId}`));
  const { data: scaleItems = [] } = useScaleItems(deedItemId ?? "", isDeedRoute);
  const hasScales = scaleItems.length > 0;

  const { items, activeIndex } = useMemo(
    () =>
      getBreadcrumbConfig(pathname, params.id, {
        hasScales,
      }),
    [pathname, params.id, hasScales]
  );
  const buttonWidth = items.length
    ? Math.max(...items.map((item) => getBreadcrumbButtonWidth(item.label)))
    : 0;
  const stripWidth = getBreadcrumbStripWidth(items.length, buttonWidth, gap, padding);

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
  }, [stripWidth, items.length]);

  useLayoutEffect(() => {
    if (!stripScrollable) return;

    const strip = stripRef.current;
    if (!strip) return;

    strip.scrollLeft = strip.scrollWidth - strip.clientWidth;
  }, [stripScrollable, items.length]);

  if (items.length === 0) {
    return null;
  }

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
          {items.map((item, index) => {
            const isActive = index === activeIndex;

            if (item.disabled || isActive) {
              return (
                <button key={`${item.href}-${item.label}`} type="button" disabled={item.disabled}>
                  {item.label}
                </button>
              );
            }

            if (items.length === 1) {
              return (
                <button key={`${item.href}-${item.label}`} type="button">
                  {item.label}
                </button>
              );
            }

            return (
              <Link key={`${item.href}-${item.label}`} href={item.href}>
                {item.label}
              </Link>
            );
          })}
        </ButtonGroup>
      </div>
    </div>
  );
};

export default Breadcrumbs;
