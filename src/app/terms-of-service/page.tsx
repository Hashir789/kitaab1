import type { Metadata } from "next";
import styles from "./terms-of-service.module.css";

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
            name: "Terms of Service",
            description:
              "Read Kitaab's Terms of Service to understand the rules and guidelines for using our Islamic deed tracking application.",
            url: "https://www.kitaab.me/terms-of-service",
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
                  name: "Terms of Service",
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
          Terms of Service
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
          <h2 className={styles.sectionTitle}>Agreement to Terms</h2>
          <p>
            By accessing or using Kitaab, you agree to be bound by these Terms
            of Service and all applicable laws and regulations. If you do not
            agree with any of these terms, you are prohibited from using or
            accessing this application.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Use License</h2>
          <p>
            Permission is granted to temporarily use Kitaab for personal,
            non-commercial transitory viewing only. This is the grant of a
            license, not a transfer of title, and under this license you may
            not:
          </p>
          <ul>
            <li>Modify or copy the materials</li>
            <li>
              Use the materials for any commercial purpose or for any public
              display
            </li>
            <li>
              Attempt to reverse engineer any software contained in the
              application
            </li>
            <li>
              Remove any copyright or other proprietary notations from the
              materials
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>User Accounts</h2>
          <p>
            When you create an account with us, you must provide information
            that is accurate, complete, and current at all times. You are
            responsible for safeguarding the password and for all activities
            that occur under your account.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>User Content</h2>
          <p>
            Our application allows you to track and store your personal deeds
            (Hasanaat and Sayyiaat). You retain ownership of any intellectual
            property rights that you hold in the content you submit. By
            submitting content, you grant us a license to use, store, and
            process that content.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Prohibited Uses</h2>
          <p>You may not use our application:</p>
          <ul>
            <li>In any way that violates any applicable law or regulation</li>
            <li>To transmit any malicious code or viruses</li>
            <li>To impersonate or attempt to impersonate another user</li>
            <li>
              In any manner that could disable, overburden, or impair the
              application
            </li>
            <li>To engage in any unauthorized framing or linking</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Intellectual Property</h2>
          <p>
            The application and its original content, features, and
            functionality are owned by Kitaab and are protected by international
            copyright, trademark, patent, trade secret, and other intellectual
            property laws.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Termination</h2>
          <p>
            We may terminate or suspend your account and bar access to the
            application immediately, without prior notice or liability, for any
            reason whatsoever, including without limitation if you breach the
            Terms.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Disclaimer</h2>
          <p>
            The information on this application is provided on an "as is" basis.
            To the fullest extent permitted by law, Kitaab excludes all
            representations, warranties, and conditions relating to our
            application and the use of this application.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Limitation of Liability</h2>
          <p>
            In no event shall Kitaab, nor its directors, employees, partners,
            agents, suppliers, or affiliates, be liable for any indirect,
            incidental, special, consequential, or punitive damages, including
            without limitation, loss of profits, data, use, goodwill, or other
            intangible losses.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Governing Law</h2>
          <p>
            These Terms shall be interpreted and governed by the laws of the
            jurisdiction in which Kitaab operates, without regard to its
            conflict of law provisions.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace
            these Terms at any time. If a revision is material, we will provide
            at least 30 days notice prior to any new terms taking effect.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Contact Us</h2>
          <p>
            If you have any questions about these Terms of Service, please
            contact us at:
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
