import Link from "next/link";
import type { Metadata } from "next";
import styles from "./about.module.css";
import ButtonGroup from "@/components/secondary/buttongroup/ButtonGroup";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Kitaab - an Islamic deed tracking application inspired by the concept of Amaal Naama (Book of Deeds). Discover our mission to help Muslims track Hasanaat and Sayyiaat for spiritual growth.",
  keywords: [
    "about Kitaab",
    "Islamic app",
    "Amaal Naama",
    "Book of Deeds",
    "Muslim app",
    "spiritual growth",
    "Islamic accountability",
  ],
  alternates: {
    canonical: "https://www.kitaab.me/about",
  },
  openGraph: {
    title: "About | Kitaab",
    description:
      "Learn about Kitaab - an Islamic deed tracking application inspired by the concept of Amaal Naama.",
    url: "https://www.kitaab.me/about",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "About | Kitaab",
    description:
      "Learn about Kitaab - an Islamic deed tracking application inspired by the concept of Amaal Naama.",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function About() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <p className={styles.message}>This page is coming soon.</p>
        <p className={styles.description}>
          We're preparing to share our story, mission, and vision with you. Check back soon!
        </p>
        <ButtonGroup buttonWidth={150} buttonHeight={40} activeIndex={-1}>
          <Link href="/">Return to Home</Link>
        </ButtonGroup>
      </div>
    </div>
  );
}
