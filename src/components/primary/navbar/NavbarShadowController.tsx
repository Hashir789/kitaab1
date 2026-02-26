"use client";

import { useEffect } from "react";
import styles from "./navbarshadowcontroller.module.css";

export default function NavbarShadowController() {
  useEffect(() => {
    const nav = document.querySelector('[data-nav-root="true"]');

    if (!(nav instanceof HTMLElement)) {
      return;
    }

    const handleScroll = () => {
      if (window.scrollY > 100) {
        nav.classList.add(styles.navShadow);
      } else {
        nav.classList.remove(styles.navShadow);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return null;
}

