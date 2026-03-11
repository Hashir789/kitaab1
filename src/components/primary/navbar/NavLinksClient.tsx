"use client";
import Link from "next/link";
import { TiHome } from "react-icons/ti";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import styles from "./navlinksclient.module.css";
import { IoIosPaperPlane } from "react-icons/io";
import { BsClipboard2Fill } from "react-icons/bs";
import { useState, useEffect, useRef } from "react";
import { RiDashboardHorizontalFill } from "react-icons/ri";
import Tooltip from "@/components/secondary/tooltip/Tooltip";
import ButtonGroup from "../../secondary/buttongroup/ButtonGroup";

type NavItem = { label: string; href: string };
type NavLinksClientProps = { 
  items: NavItem[];
  buttonWidth?: number;
  buttonHeight?: number;
};

function getIconByIndex(index: number) {
  switch (index) {
    case 0:
      return TiHome;
    case 1:
      return RiDashboardHorizontalFill;
    case 2:
      return BsClipboard2Fill;
    case 3:
    default:
      return IoIosPaperPlane;
  }
}

export default function NavLinksClient({ 
  items, 
  buttonWidth = 100, 
  buttonHeight = 35 
}: NavLinksClientProps) {
  const pathname = usePathname();
  const activeIndex = items.findIndex(item => item.href === pathname);
  const isBelow1124 = useAppSelector((state) => state.ui.isBelow1124);
  const isBelow710 = useAppSelector((state) => state.ui.isBelow710);
  const [iconButtonWidth, setIconButtonWidth] = useState(40);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (isBelow710 && containerRef.current) {
        const groupWidth = containerRef.current.offsetWidth;
        const computed = (groupWidth - 46) / 4;
        setIconButtonWidth(computed);
      } else {
        setIconButtonWidth(40);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isBelow710]);

  return (
    <div ref={containerRef} className={styles.navListContainer}>
      { !isBelow1124 ? (
        <ButtonGroup
          activeIndex={activeIndex}
          buttonWidth={buttonWidth}
          buttonHeight={buttonHeight}
        >
          {items.map((item, index) => {
            const Icon = getIconByIndex(index);
            const isActive = index === activeIndex;

            return (
              <Link 
                key={item.href}
                href={item.href}
                itemProp="url"
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
              >
                <span itemProp="name">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </ButtonGroup>):
        (<ButtonGroup 
          activeIndex={activeIndex} 
          buttonWidth={iconButtonWidth} 
          buttonHeight={35}
        >
          {items.map((item, index) => {
            const iconSize = index === 2 ? 20 : 23;
            const Icon = getIconByIndex(index);
            const isActive = index === activeIndex;

            return (
              <Tooltip text={item.label} position="bottom">
                <Link
                  key={item.href}
                  href={item.href}
                  itemProp="url"
                  aria-label={item.label}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon size={iconSize} />
                </Link>
              </Tooltip>
            );
          })}
        </ButtonGroup>
      )}
    </div>
  );
}