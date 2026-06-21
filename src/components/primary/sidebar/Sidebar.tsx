"use client";

import Link from "next/link";
import Image from "next/image";
import { logout } from "@/utils/session";
import styles from "./sidebar.module.css";
import { FaNoteSticky } from "react-icons/fa6";
import { IoClose, IoMenu } from "react-icons/io5";
import { SidebarProps } from "./sidebar.interface";
import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { BiSolidBarChartAlt2 } from "react-icons/bi";
import { FaFolderOpen, FaUser } from "react-icons/fa";
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import ButtonGroup from "@/components/secondary/buttongroup/ButtonGroup";
import { authAria, homeCharlieText, sidebarAria, sidebarLabel, sidebarMisc} from "@/constants/placeholders";

const menuItems = [
  { label: sidebarLabel.DASHBOARD, icon: BsFillGrid3X3GapFill },
  { label: sidebarLabel.RECORDS, icon: FaNoteSticky },
  { label: sidebarLabel.SCORECARDS, icon: BiSolidBarChartAlt2 },
  { label: sidebarLabel.DEEDS, icon: FaFolderOpen },
  { label: sidebarLabel.PROFILE, icon: FaUser }
];

function getInitials(value: string): string {
  const parts = value
    .replace(/@.*/, "")
    .split(/\s|[._-]/)
    .filter(Boolean);

  if (parts.length === 0) return sidebarMisc.INITIALS_FALLBACK;
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function Sidebar({ user, userId }: SidebarProps) {
  const isBelow880 = useAppSelector((state) => state.ui.isBelow880);
  const sidebarBottomRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [actionWidth, setActionWidth] = useState(240);
  const profileName = user.full_name || user.email || sidebarMisc.PROFILE_FALLBACK;
  const profileEmail = user.email || sidebarMisc.SIGNED_IN_FALLBACK;
  const safeActionWidth = Math.max(actionWidth, 180);

  useEffect(() => {
    if (!isBelow880) setSidebarOpen(false);
  }, [isBelow880]);

  useEffect(() => {
    const updateActionWidth = () => {
      const width = sidebarBottomRef.current?.offsetWidth;
      if (width) setActionWidth(width);
    };

    updateActionWidth();
    window.addEventListener("resize", updateActionWidth);
    return () => window.removeEventListener("resize", updateActionWidth);
  }, []);

  return (
    <>
      <button
        type="button"
        className={`${styles.mobileToggle} ${isBelow880 ? styles.mobileToggleVisible : ""}`}
        onClick={() => setSidebarOpen((open) => !open)}
        aria-label={sidebarOpen ? sidebarAria.CLOSE_SIDEBAR : sidebarAria.OPEN_SIDEBAR}
        aria-expanded={sidebarOpen}
      >
        {sidebarOpen ? <IoClose aria-hidden="true" /> : <IoMenu aria-hidden="true" />}
      </button>

      {sidebarOpen && isBelow880 ? (
        <button
          type="button"
          className={`${styles.mobileBackdrop} ${styles.mobileBackdropVisible}`}
          onClick={() => setSidebarOpen(false)}
          aria-label={sidebarAria.CLOSE_SIDEBAR}
        />
      ) : null}

      <aside
        className={`${styles.sidebar} ${isBelow880 ? styles.sidebarMobile : styles.sidebarDesktop} ${sidebarOpen ? styles.sidebarOpen : ""}`}
        aria-label={sidebarAria.AFTER_LOGIN_SIDEBAR}
      >
        <Link href={`/user/${userId}`} className={styles.logo} aria-label={sidebarAria.KITAAB_DASHBOARD}>
          <Image
            priority
            width={180}
            height={60}
            src="/kitaab-logo.png"
            alt={authAria.KITAAB_LOGO}
            className={styles.logoImage}
          />
        </Link>

        <nav className={styles.menu} aria-label={sidebarAria.USER_MENU}>
          {menuItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                type="button"
                className={`${styles.menuItem} ${index === 0 ? styles.menuItemActive : ""}`}
                aria-current={index === 0 ? "page" : undefined}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div ref={sidebarBottomRef} className={styles.sidebarBottom}>
          <ButtonGroup
            activeIndex={0}
            buttonHeight={34}
            gap={8}
            fontSize={13}
            buttonWidth={Math.floor((safeActionWidth - 20) / 2)}
          >
            <button type="button">{homeCharlieText.HASANAAT}</button>
            <button type="button">{homeCharlieText.SAYYIAAT}</button>
          </ButtonGroup>

          <div className={styles.profile}>
            <div className={styles.profilePhoto} aria-hidden="true">
              {getInitials(profileName)}
            </div>
            <div className={styles.profileText}>
              <span className={styles.profileName}>{profileName}</span>
              <span className={styles.profileEmail}>{profileEmail}</span>
            </div>
          </div>

          <ButtonGroup activeIndex={-1} buttonWidth={safeActionWidth - 12} buttonHeight={36} fontSize={14}>
            <button type="button" onClick={logout}>
              {sidebarLabel.LOGOUT}
            </button>
          </ButtonGroup>
        </div>
      </aside>
    </>
  );
}