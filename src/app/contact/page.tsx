import type { Metadata } from "next";
import styles from "./contact.module.css";
import ContactForm from "@/app/sections/contact/ContactForm";

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
    canonical: "https://www.kitaab.me/contact",
  },
  openGraph: {
    title: "Contact Us | Kitaab",
    description:
      "Get in touch with Kitaab for support, questions, feedback, or partnership inquiries.",
    url: "https://www.kitaab.me/contact",
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
      <div className={styles.layout}>
        <aside className={styles.infoCard}>
          <header className={styles.cardHeader}>
            <p className={styles.cardKicker}>Get in touch</p>
            <h2 className={styles.cardTitle}>Talk to the Kitaab team</h2>
            <p className={styles.cardBody}>
              We’re here to support you on your journey with Kitaab, whether you have questions, need help, or want to share feedback.
            </p>
          </header>

          <div className={styles.cardSection}>
            <div className={styles.cardEmailItem}>
              <div className={styles.cardIconWrap}>
                <span className={styles.cardIcon}>@</span>
              </div>
              <div className={styles.cardEmailMeta}>
                <p className={styles.cardLabel}>Email</p>
                <div className={styles.cardValue}>
                  <a href="mailto:support.kitaab@gmail.com">support.kitaab@gmail.com</a>
                </div>
              </div>
            </div>

            <div className={styles.cardDivider} />

            <div className={styles.cardStats}>
              <div className={styles.cardStat}>
                <span className={styles.cardDotGreen} />
                <span>Typical response time: within 24 hours</span>
              </div>
            </div>
          </div>
        </aside>
        <section className={styles.formPanel}>
          <p className={styles.description}>
            Share your questions, feedback, or partnership ideas and we’ll respond as soon as possible.
          </p>
          <ContactForm />
        </section>
      </div>
    </div>
  );
}
