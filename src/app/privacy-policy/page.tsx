import type { Metadata } from "next";
import styles from "./privacy-policy.module.css";

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
            name: "Privacy Policy",
            description:
              "Learn how Kitaab protects your privacy and handles your personal information.",
            url: "https://www.kitaab.me/privacy-policy",
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
                  name: "Privacy Policy",
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
          Privacy Policy
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
          <h2 className={styles.sectionTitle}>Introduction</h2>
          <p>
            At Kitaab, we are committed to protecting your privacy. This Privacy
            Policy explains how we collect, use, disclose, and safeguard your
            information when you use our Islamic deed tracking application.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Information We Collect</h2>
          <p>
            We may collect information that you provide directly to us,
            including:
          </p>
          <ul>
            <li>Account information (name, email address)</li>
            <li>Deed tracking data (Hasanaat and Sayyiaat entries)</li>
            <li>Usage data and preferences</li>
            <li>Device information</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide and maintain our services</li>
            <li>Process your transactions and manage your account</li>
            <li>Improve and personalize your experience</li>
            <li>Send you important updates and notifications</li>
            <li>Ensure the security and integrity of our platform</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to
            protect your personal information against unauthorized access,
            alteration, disclosure, or destruction. However, no method of
            transmission over the internet is 100% secure.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Data Retention</h2>
          <p>
            We retain your personal information for as long as necessary to
            provide our services and fulfill the purposes outlined in this
            Privacy Policy, unless a longer retention period is required by law.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access and receive a copy of your personal data</li>
            <li>Rectify inaccurate or incomplete information</li>
            <li>Request deletion of your personal data</li>
            <li>Object to or restrict processing of your data</li>
            <li>Data portability</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Third-Party Services</h2>
          <p>
            Our application may contain links to third-party websites or
            services. We are not responsible for the privacy practices of these
            third parties. We encourage you to review their privacy policies.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Children's Privacy</h2>
          <p>
            Our services are not intended for children under the age of 13. We
            do not knowingly collect personal information from children under
            13. If you become aware that a child has provided us with personal
            information, please contact us.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            Changes to This Privacy Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the "Last updated" date.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at:
          </p>
          <p className={styles.contact}>
            Email: <a href="mailto:support.kitaab@gmail.com">support.kitaab@gmail.com</a>
            <br />
            Phone: <a href="tel:+923338701145">+92 333 8701145</a>
          </p>
        </section>
      </article>
    </>
  );
}
