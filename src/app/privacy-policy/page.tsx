import type { Metadata } from "next";
import styles from "./privacy-policy.module.css";
import { footerText, legalPageText, privacyPolicyText } from "@/constants/placeholders";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Kitaab protects your privacy and handles your personal information. Our Privacy Policy explains data collection, usage, security, and your rights regarding your Islamic deed tracking data.",
  keywords: [
    "privacy policy",
    "data protection",
    "user privacy",
    "data security",
    "personal information",
    "GDPR",
    "data rights",
    "Kitaab privacy",
  ],
  alternates: {
    canonical: "https://www.kitaab.me/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy | Kitaab",
    description:
      "Learn how Kitaab protects your privacy and handles your personal information.",
    url: "https://www.kitaab.me/privacy-policy",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy | Kitaab",
    description:
      "Learn how Kitaab protects your privacy and handles your personal information.",
  },
};

export default function PrivacyPolicy() {
  const lastUpdated = new Date().toISOString();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: privacyPolicyText.TITLE,
            description: privacyPolicyText.DESCRIPTION,
            url: "https://www.kitaab.me/privacy-policy",
            dateModified: lastUpdated,
            publisher: {
              "@type": "Organization",
              name: legalPageText.ORGANIZATION_NAME,
              url: legalPageText.ORGANIZATION_URL,
            },
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: legalPageText.HOME,
                  item: legalPageText.ORGANIZATION_URL,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: privacyPolicyText.TITLE,
                  item: "https://www.kitaab.me/privacy-policy",
                },
              ],
            },
          }),
        }}
      />
      <article
        className={styles.container}
        itemScope
        itemType="https://schema.org/WebPage"
      >
        <h1 className={styles.title} itemProp="name">
          {privacyPolicyText.TITLE}
        </h1>
        <p className={styles.lastUpdated}>
          {legalPageText.LAST_UPDATED}
          <time dateTime={lastUpdated} itemProp="dateModified">
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </p>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{privacyPolicyText.INTRODUCTION}</h2>
          <p>
            {privacyPolicyText.INTRODUCTION_BODY}
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{privacyPolicyText.INFORMATION_WE_COLLECT}</h2>
          <p>
            {privacyPolicyText.INFORMATION_WE_COLLECT_BODY}
          </p>
          <ul>
            <li>{privacyPolicyText.ACCOUNT_INFORMATION}</li>
            <li>{privacyPolicyText.DEED_TRACKING_DATA}</li>
            <li>{privacyPolicyText.USAGE_DATA}</li>
            <li>{privacyPolicyText.DEVICE_INFORMATION}</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{privacyPolicyText.HOW_WE_USE_INFORMATION}</h2>
          <p>{privacyPolicyText.HOW_WE_USE_INFORMATION_BODY}</p>
          <ul>
            <li>{privacyPolicyText.PROVIDE_SERVICES}</li>
            <li>{privacyPolicyText.PROCESS_TRANSACTIONS}</li>
            <li>{privacyPolicyText.IMPROVE_EXPERIENCE}</li>
            <li>{privacyPolicyText.SEND_UPDATES}</li>
            <li>{privacyPolicyText.ENSURE_SECURITY}</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{privacyPolicyText.DATA_SECURITY}</h2>
          <p>
            {privacyPolicyText.DATA_SECURITY_BODY}
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{privacyPolicyText.DATA_RETENTION}</h2>
          <p>
            {privacyPolicyText.DATA_RETENTION_BODY}
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{privacyPolicyText.YOUR_RIGHTS}</h2>
          <p>{privacyPolicyText.YOUR_RIGHTS_BODY}</p>
          <ul>
            <li>{privacyPolicyText.ACCESS_DATA}</li>
            <li>{privacyPolicyText.RECTIFY_DATA}</li>
            <li>{privacyPolicyText.REQUEST_DELETION}</li>
            <li>{privacyPolicyText.OBJECT_PROCESSING}</li>
            <li>{privacyPolicyText.DATA_PORTABILITY}</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{privacyPolicyText.THIRD_PARTY_SERVICES}</h2>
          <p>
            {privacyPolicyText.THIRD_PARTY_SERVICES_BODY}
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{privacyPolicyText.CHILDREN_PRIVACY}</h2>
          <p>
            {privacyPolicyText.CHILDREN_PRIVACY_BODY}
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            {privacyPolicyText.CHANGES}
          </h2>
          <p>
            {privacyPolicyText.CHANGES_BODY}
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{legalPageText.CONTACT_US}</h2>
          <p>
            {privacyPolicyText.CONTACT_BODY}
          </p>
          <p className={styles.contact}>
            {legalPageText.EMAIL}: <a href="mailto:support@kitaab.me">{footerText.EMAIL}</a>
            <br />
            {legalPageText.PHONE}: <a href="tel:+923338701145">{footerText.PHONE}</a>
          </p>
        </section>
      </article>
    </>
  );
}
