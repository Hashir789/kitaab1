import type { Metadata } from "next";
import styles from "./cookie-policy.module.css";

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
            name: "Cookie Policy",
            description:
              "Learn about how Kitaab uses cookies to enhance your experience and how you can manage them.",
            url: "https://www.kitaab.me/cookie-policy",
            dateModified: lastUpdated,
            publisher: {
              "@type": "Organization",
              name: "Kitaab",
              url: "https://www.kitaab.me",
            },
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://www.kitaab.me",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Cookie Policy",
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
          Cookie Policy
        </h1>
        <p className={styles.lastUpdated}>
          Last updated:{" "}
          <time dateTime={lastUpdated} itemProp="dateModified">
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </p>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>What Are Cookies</h2>
          <p>
            Cookies are small text files that are placed on your computer or
            mobile device when you visit a website. They are widely used to make
            websites work more efficiently and provide information to the
            website owners.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>How We Use Cookies</h2>
          <p>
            Kitaab uses cookies to enhance your experience, analyze site usage,
            and assist in our marketing efforts. We use both session cookies
            (which expire when you close your browser) and persistent cookies
            (which remain on your device until deleted or expired).
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Types of Cookies We Use</h2>

          <h3 className={styles.subsectionTitle}>Essential Cookies</h3>
          <p>
            These cookies are necessary for the website to function properly.
            They enable core functionality such as security, network management,
            and accessibility. You cannot opt-out of these cookies.
          </p>

          <h3 className={styles.subsectionTitle}>Analytics Cookies</h3>
          <p>
            These cookies help us understand how visitors interact with our
            website by collecting and reporting information anonymously. This
            helps us improve our website and user experience.
          </p>

          <h3 className={styles.subsectionTitle}>Functional Cookies</h3>
          <p>
            These cookies enable enhanced functionality and personalization,
            such as remembering your preferences and settings. They may be set
            by us or by third-party providers whose services we have added to
            our pages.
          </p>

          <h3 className={styles.subsectionTitle}>Marketing Cookies</h3>
          <p>
            These cookies are used to track visitors across websites to display
            relevant advertisements and measure the effectiveness of our
            marketing campaigns.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Third-Party Cookies</h2>
          <p>
            In addition to our own cookies, we may also use various third-party
            cookies to report usage statistics of the service, deliver
            advertisements, and so on. These third-party cookies are governed by
            the respective privacy policies of those third parties.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Managing Cookies</h2>
          <p>
            Most web browsers allow you to control cookies through their
            settings preferences. However, limiting cookies may impact your
            ability to use our website. You can:
          </p>
          <ul>
            <li>Delete cookies from your browser settings</li>
            <li>Block cookies through your browser settings</li>
            <li>Set your browser to notify you when cookies are being set</li>
            <li>Use browser extensions or add-ons to manage cookies</li>
          </ul>
          <p>
            Please note that if you disable cookies, some features of our
            website may not function properly.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Cookie Duration</h2>
          <p>
            Cookies may be either "persistent" cookies or "session" cookies. A
            persistent cookie remains on your device after you close your
            browser and may be used by your browser on subsequent visits to our
            website. A session cookie is temporary and disappears after you
            close your browser.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Updates to This Cookie Policy</h2>
          <p>
            We may update this Cookie Policy from time to time to reflect
            changes in technology, legislation, or our data use practices. We
            will notify you of any material changes by posting the new Cookie
            Policy on this page and updating the "Last updated" date.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Contact Us</h2>
          <p>
            If you have any questions about our use of cookies or this Cookie
            Policy, please contact us at:
          </p>
          <p className={styles.contact}>
            Email: <a href="mailto:support@kitaab.me">support@kitaab.me</a>
            <br />
            Phone: <a href="tel:+923338701145">+92 333 8701145</a>
          </p>
        </section>
      </article>
    </>
  );
}
