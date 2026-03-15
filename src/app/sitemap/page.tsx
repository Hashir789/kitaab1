import type { Metadata } from "next";
import Link from "next/link";
import styles from "./sitemap.module.css";

export const metadata: Metadata = {
  title: "Sitemap",
  description:
    "Browse all pages and sections of the Kitaab website. Find links to features, about, contact, legal pages, and resources for our Islamic deed tracking application.",
  keywords: [
    "sitemap",
    "site map",
    "website navigation",
    "Kitaab pages",
    "website structure",
    "page index",
  ],
  alternates: {
    canonical: "https://kitaab.me/sitemap",
  },
  openGraph: {
    title: "Sitemap | Kitaab",
    description: "Browse all pages and sections of the Kitaab website.",
    url: "https://kitaab.me/sitemap",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Sitemap | Kitaab",
    description: "Browse all pages and sections of the Kitaab website.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Sitemap() {
  const mainPages = [
    { label: "Home", href: "/" },
    { label: "Features", href: "/features" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const resourcePages = [
    { label: "FAQs", href: "/faqs" },
    { label: "Support", href: "/support" },
  ];

  const legalPages = [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
    { label: "Cookie Policy", href: "/cookie-policy" },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Sitemap",
            description: "Browse all pages and sections of the Kitaab website.",
            url: "https://kitaab.me/sitemap",
            publisher: {
              "@type": "Organization",
              name: "Kitaab",
              url: "https://kitaab.me",
            },
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://kitaab.me",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Sitemap",
                  item: "https://kitaab.me/sitemap",
                },
              ],
            },
            mainEntity: {
              "@type": "SiteNavigationElement",
              name: "Kitaab Website Navigation",
            },
          }),
        }}
      />
      <nav
        className={styles.container}
        aria-label="Site map"
        itemScope
        itemType="https://schema.org/SiteNavigationElement"
      >
        <h1 className={styles.title} itemProp="name">
          Sitemap
        </h1>
        <p className={styles.description} itemProp="description">
          Find all pages and sections of the Kitaab website.
        </p>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Main Pages</h2>
          <ul className={styles.linkList}>
            {mainPages.map((page) => (
              <li key={page.href}>
                <Link href={page.href} className={styles.link}>
                  {page.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Resources</h2>
          <ul className={styles.linkList}>
            {resourcePages.map((page) => (
              <li key={page.href}>
                <Link href={page.href} className={styles.link}>
                  {page.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Legal</h2>
          <ul className={styles.linkList}>
            {legalPages.map((page) => (
              <li key={page.href}>
                <Link href={page.href} className={styles.link}>
                  {page.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </nav>
    </>
  );
}
