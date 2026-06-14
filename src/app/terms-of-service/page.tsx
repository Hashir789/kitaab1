import type { Metadata } from "next";
import styles from "./terms-of-service.module.css";
import { footerText, legalPageText, termsOfServiceText } from "@/constants/placeholders";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read Kitaab's Terms of Service to understand the rules and guidelines for using our Islamic deed tracking application. Learn about user rights, responsibilities, and service terms.",
  keywords: [
    "terms of service",
    "terms and conditions",
    "user agreement",
    "service terms",
    "legal terms",
    "Kitaab terms",
    "user rights",
    "service agreement",
  ],
  alternates: {
    canonical: "https://www.kitaab.me/terms-of-service",
  },
  openGraph: {
    title: "Terms of Service | Kitaab",
    description:
      "Read Kitaab's Terms of Service to understand the rules and guidelines for using our Islamic deed tracking application.",
    url: "https://www.kitaab.me/terms-of-service",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Terms of Service | Kitaab",
    description:
      "Read Kitaab's Terms of Service to understand the rules and guidelines for using our Islamic deed tracking application.",
  },
};

export default function TermsOfService() {
  const lastUpdated = new Date().toISOString();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: termsOfServiceText.TITLE,
            description: termsOfServiceText.DESCRIPTION,
            url: "https://www.kitaab.me/terms-of-service",
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
                  name: termsOfServiceText.TITLE,
                  item: "https://www.kitaab.me/terms-of-service",
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
          {termsOfServiceText.TITLE}
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
          <h2 className={styles.sectionTitle}>{termsOfServiceText.AGREEMENT}</h2>
          <p>
            {termsOfServiceText.AGREEMENT_BODY}
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{termsOfServiceText.USE_LICENSE}</h2>
          <p>
            {termsOfServiceText.USE_LICENSE_BODY}
          </p>
          <ul>
            <li>{termsOfServiceText.MODIFY_MATERIALS}</li>
            <li>{termsOfServiceText.COMMERCIAL_USE}</li>
            <li>{termsOfServiceText.REVERSE_ENGINEER}</li>
            <li>{termsOfServiceText.REMOVE_NOTATIONS}</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{termsOfServiceText.USER_ACCOUNTS}</h2>
          <p>
            {termsOfServiceText.USER_ACCOUNTS_BODY}
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{termsOfServiceText.USER_CONTENT}</h2>
          <p>
            {termsOfServiceText.USER_CONTENT_BODY}
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{termsOfServiceText.PROHIBITED_USES}</h2>
          <p>{termsOfServiceText.PROHIBITED_USES_BODY}</p>
          <ul>
            <li>{termsOfServiceText.VIOLATE_LAW}</li>
            <li>{termsOfServiceText.MALICIOUS_CODE}</li>
            <li>{termsOfServiceText.IMPERSONATE}</li>
            <li>{termsOfServiceText.IMPAIR_APP}</li>
            <li>{termsOfServiceText.UNAUTHORIZED_LINKING}</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{termsOfServiceText.INTELLECTUAL_PROPERTY}</h2>
          <p>
            {termsOfServiceText.INTELLECTUAL_PROPERTY_BODY}
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{termsOfServiceText.TERMINATION}</h2>
          <p>
            {termsOfServiceText.TERMINATION_BODY}
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{termsOfServiceText.DISCLAIMER}</h2>
          <p>
            {termsOfServiceText.DISCLAIMER_BODY}
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{termsOfServiceText.LIMITATION_OF_LIABILITY}</h2>
          <p>
            {termsOfServiceText.LIMITATION_OF_LIABILITY_BODY}
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{termsOfServiceText.GOVERNING_LAW}</h2>
          <p>
            {termsOfServiceText.GOVERNING_LAW_BODY}
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{termsOfServiceText.CHANGES}</h2>
          <p>
            {termsOfServiceText.CHANGES_BODY}
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{legalPageText.CONTACT_US}</h2>
          <p>
            {termsOfServiceText.CONTACT_BODY}
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
