import Link from "next/link";
import type { Metadata } from "next";
import styles from "./not-found.module.css";
import ButtonGroup from "@/components/secondary/buttongroup/ButtonGroup";

export const metadata: Metadata = {
  title: "Page Not Found",
  description:
    "The page you're looking for doesn't exist. Return to Kitaab home page to continue tracking your Hasanaat and Saiyyiaat.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>404</h1>
        <p className={styles.message}>Page Not Found</p>
        <p className={styles.description}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <ButtonGroup buttonWidth={150} buttonHeight={40} activeIndex={-1}>
          <Link href="/">Return to Home</Link>
        </ButtonGroup>
      </div>
    </div>
  );
}
