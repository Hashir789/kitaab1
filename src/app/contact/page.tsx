import Link from "next/link";
import type { Metadata } from "next";
import styles from "./contact.module.css";
import ButtonGroup from "@/components/secondary/buttongroup/ButtonGroup";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Kitaab. Contact us for support, questions, feedback, or partnership inquiries about our Islamic deed tracking application.",
  keywords: [
    "contact Kitaab",
    "Kitaab support",
    "get in touch",
    "customer support",
    "Islamic app contact",
    "deed tracker support",
    "help center",
  ],
  alternates: {
    canonical: "https://kitaab.me/contact",
  },
  openGraph: {
    title: "Contact Us | Kitaab",
    description:
      "Get in touch with Kitaab for support, questions, feedback, or partnership inquiries.",
    url: "https://kitaab.me/contact",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Contact Us | Kitaab",
    description:
      "Get in touch with Kitaab for support, questions, feedback, or partnership inquiries.",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function Contact() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <p className={styles.message}>This page is coming soon.</p>
        <p className={styles.description}>
          We're preparing our contact form and support channels to better serve you. Check back soon!
        </p>
        <ButtonGroup buttonWidth={150} buttonHeight={40} activeIndex={-1}>
          <Link href="/">Return to Home</Link>
        </ButtonGroup>
      </div>
    </div>
  );
}
