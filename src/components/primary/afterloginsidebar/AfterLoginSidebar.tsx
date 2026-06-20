"use client";

import Link from "next/link";
import Image from "next/image";
import { logout } from "@/utils/session";
import { FaNoteSticky } from "react-icons/fa6";
import { IoClose, IoMenu } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import styles from "./afterloginsidebar.module.css";
import type { UserSession } from "@/interfaces/user";
import { BiSolidBarChartAlt2 } from "react-icons/bi";
import { FaFolderOpen, FaUser } from "react-icons/fa";
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import ButtonGroup from "@/components/secondary/buttongroup/ButtonGroup";

interface AfterLoginSidebarProps {
  user: UserSession;
  userId: string;
}

const menuItems = [
  { label: "Dashboard", icon: BsFillGrid3X3GapFill },
  { label: "Records", icon: FaNoteSticky },
  { label: "Scorecards", icon: BiSolidBarChartAlt2 },
  { label: "Deeds", icon: FaFolderOpen },
  { label: "Profile", icon: FaUser },
];

function getInitials(value: string): string {
  const parts = value
    .replace(/@.*/, "")
    .split(/\s|[._-]/)
    .filter(Boolean);

  if (parts.length === 0) return "U";
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function AfterLoginSidebar({ user, userId }: AfterLoginSidebarProps) {
  const sidebarBottomRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [actionWidth, setActionWidth] = useState(240);
  const profileName = user.full_name || user.email || "Profile";
  const profileEmail = user.email || "Signed in";
  const safeActionWidth = Math.max(actionWidth, 180);

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
        className={styles.mobileToggle}
        onClick={() => setSidebarOpen((open) => !open)}
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        aria-expanded={sidebarOpen}
      >
        {sidebarOpen ? <IoClose aria-hidden="true" /> : <IoMenu aria-hidden="true" />}
      </button>

      {sidebarOpen ? (
        <button
          type="button"
          className={styles.mobileBackdrop}
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      ) : null}

      <aside
        className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}
        aria-label="After login sidebar"
      >
        <Link href={`/user/${userId}`} className={styles.logo} aria-label="Kitaab dashboard">
          <Image
            priority
            width={180}
            height={60}
            src="/kitaab-logo.png"
            alt="Kitaab logo"
            className={styles.logoImage}
          />
        </Link>

        <nav className={styles.menu} aria-label="User menu">
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
            <button type="button">Hasanaat</button>
            <button type="button">Saiyyiaat</button>
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
              Logout
            </button>
          </ButtonGroup>
        </div>
      </aside>
    </>
  );
}
