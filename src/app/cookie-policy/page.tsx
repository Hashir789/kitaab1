import type { Metadata } from "next";
import styles from "./cookie-policy.module.css";
import { cookiePolicyText, footerText, legalPageText } from "@/constants/placeholders";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Learn about how Kitaab uses cookies to enhance your experience. Our Cookie Policy explains the types of cookies we use, their purpose, and how you can manage them.",
  keywords: [
    "cookie policy",
    "cookies",
    "web cookies",
    "tracking cookies",
    "cookie management",
    "privacy cookies",
    "Kitaab cookies",
    "cookie settings",
  ],
  alternates: {
    canonical: "https://www.kitaab.me/cookie-policy",
  },
  openGraph: {
    title: "Cookie Policy | Kitaab",
    description:
      "Learn about how Kitaab uses cookies to enhance your experience and how you can manage them.",
    url: "https://www.kitaab.me/cookie-policy",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Cookie Policy | Kitaab",
    description:
      "Learn about how Kitaab uses cookies to enhance your experience and how you can manage them.",
  },
};

export default function CookiePolicy() {
  const lastUpdated = new Date().toISOString();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: cookiePolicyText.TITLE,
            description: cookiePolicyText.DESCRIPTION,
            url: "https://www.kitaab.me/cookie-policy",
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
                  name: cookiePolicyText.TITLE,
                  item: "https://www.kitaab.me/cookie-policy",
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
          {cookiePolicyText.TITLE}
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
          <h2 className={styles.sectionTitle}>{cookiePolicyText.WHAT_ARE_COOKIES}</h2>
          <p>
            {cookiePolicyText.WHAT_ARE_COOKIES_BODY}
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{cookiePolicyText.HOW_WE_USE_COOKIES}</h2>
          <p>
            {cookiePolicyText.HOW_WE_USE_COOKIES_BODY}
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{cookiePolicyText.TYPES_OF_COOKIES}</h2>

          <h3 className={styles.subsectionTitle}>{cookiePolicyText.ESSENTIAL_COOKIES}</h3>
          <p>
            {cookiePolicyText.ESSENTIAL_COOKIES_BODY}
          </p>

          <h3 className={styles.subsectionTitle}>{cookiePolicyText.ANALYTICS_COOKIES}</h3>
          <p>
            {cookiePolicyText.ANALYTICS_COOKIES_BODY}
          </p>

          <h3 className={styles.subsectionTitle}>{cookiePolicyText.FUNCTIONAL_COOKIES}</h3>
          <p>
            {cookiePolicyText.FUNCTIONAL_COOKIES_BODY}
          </p>

          <h3 className={styles.subsectionTitle}>{cookiePolicyText.MARKETING_COOKIES}</h3>
          <p>
            {cookiePolicyText.MARKETING_COOKIES_BODY}
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{cookiePolicyText.THIRD_PARTY_COOKIES}</h2>
          <p>
            {cookiePolicyText.THIRD_PARTY_COOKIES_BODY}
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{cookiePolicyText.MANAGING_COOKIES}</h2>
          <p>
            {cookiePolicyText.MANAGING_COOKIES_BODY}
          </p>
          <ul>
            <li>{cookiePolicyText.DELETE_COOKIES}</li>
            <li>{cookiePolicyText.BLOCK_COOKIES}</li>
            <li>{cookiePolicyText.NOTIFY_COOKIES}</li>
            <li>{cookiePolicyText.EXTENSIONS_COOKIES}</li>
          </ul>
          <p>
            {cookiePolicyText.MANAGING_COOKIES_NOTE}
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{cookiePolicyText.COOKIE_DURATION}</h2>
          <p>
            {cookiePolicyText.COOKIE_DURATION_BODY}
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{cookiePolicyText.UPDATES}</h2>
          <p>
            {cookiePolicyText.UPDATES_BODY}
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{legalPageText.CONTACT_US}</h2>
          <p>
            {cookiePolicyText.CONTACT_BODY}
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
