import Link from "next/link";
import type { Metadata } from "next";
import styles from "./features.module.css";
import ButtonGroup from "@/components/secondary/buttongroup/ButtonGroup";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Discover the powerful features of Kitaab - an Islamic deed tracking app that helps you track Hasanaat and Sayyi'aat, monitor your spiritual progress, and build consistency in your daily Islamic practice.",
  keywords: [
    "Kitaab features",
    "Islamic app features",
    "deed tracker features",
    "Hasanaat tracker",
    "Sayyi'aat tracker",
    "spiritual tracking",
    "Islamic productivity",
  ],
  alternates: {
    canonical: "https://www.kitaab.me/features",
  },
  openGraph: {
    title: "Features | Kitaab",
    description:
      "Discover the powerful features of Kitaab - an Islamic deed tracking app.",
    url: "https://www.kitaab.me/features",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Features | Kitaab",
    description: "Discover the powerful features of Kitaab - an Islamic deed tracking app.",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function Features() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <p className={styles.message}>This page is coming soon.</p>
        <p className={styles.description}>
          We're working hard to bring you detailed information about all the amazing features of Kitaab.
        </p>
        <ButtonGroup buttonWidth={150} buttonHeight={40} activeIndex={-1}>
          <Link href="/">Return to Home</Link>
        </ButtonGroup>
      </div>
    </div>
  );
}
