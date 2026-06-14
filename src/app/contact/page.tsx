import type { Metadata } from "next";
import styles from "./contact.module.css";
import ContactForm from "@/app/sections/contact/ContactForm";
import { contactPageText, footerText } from "@/constants/placeholders";

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
            <p className={styles.cardKicker}>{contactPageText.KICKER}</p>
            <h2 className={styles.cardTitle}>{contactPageText.TITLE}</h2>
            <p className={styles.cardBody}>
              {contactPageText.BODY}
            </p>
          </header>

          <div className={styles.cardSection}>
            <div className={styles.cardEmailItem}>
              <div className={styles.cardIconWrap}>
                <span className={styles.cardIcon}>@</span>
              </div>
              <div className={styles.cardEmailMeta}>
                <p className={styles.cardLabel}>{contactPageText.EMAIL_LABEL}</p>
                <div className={styles.cardValue}>
                  <a href="mailto:support@kitaab.me">{footerText.EMAIL}</a>
                </div>
              </div>
            </div>

            <div className={styles.cardDivider} />

            <div className={styles.cardStats}>
              <div className={styles.cardStat}>
                <span className={styles.cardDotGreen} />
                <span>{contactPageText.RESPONSE_TIME}</span>
              </div>
            </div>
          </div>
        </aside>
        <section className={styles.formPanel}>
          <p className={styles.description}>
            {contactPageText.DESCRIPTION}
          </p>
          <ContactForm />
        </section>
      </div>
    </div>
  );
}
