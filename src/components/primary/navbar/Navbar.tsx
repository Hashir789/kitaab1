import Link from "next/link";
import Image from "next/image";
import WaitList from "./WaitList";
import styles from "./navbar.module.css";
import NavLinksClient from "./NavLinksClient";
import Tooltip from "@/components/secondary/tooltip/Tooltip";
import NavbarShadowController from "./NavbarShadowController";

export default function Navbar() {
  const navItems = [
    { label: "Home", href: "/" },
    { label: "Features", href: "/features" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <nav
      className={styles.nav}
      data-nav-root="true"
      aria-label="Primary site navigation"
      itemScope
      itemType="https://schema.org/SiteNavigationElement"
    >
      <NavbarShadowController />
      <Tooltip text="Be Your Own Accountant" position="right">
        <Link
          href="/"
          className={styles.logo}
          aria-label="Kitaab Islamic Deed Tracker home"
          title="Kitaab – Islamic Deed Tracker Home"
          itemProp="url"
        >
          <Image
            src="/kitaab-logo.png"
            alt="Kitaab – Islamic Deed Tracker logo"
            width={180}
            height={60}
            className={styles.logo}
          />
        </Link>
      </Tooltip>
      <NavLinksClient items={navItems} />
      <WaitList />
    </nav>
  );
}