import "./globals.css";
import Script from "next/script";
import type { Metadata } from "next";
import { headers } from "next/headers";
import ClientLayout from "./ClientLayout";
import StoreProvider from "@/store/StoreProvider";

export async function generateMetadata(): Promise<Metadata> {
  const hdrs = await headers();
  const host = hdrs.get("host") ?? "";
  const isStaging = host.includes("staging.kitaab.me");

  const base: Metadata = {
    metadataBase: new URL(isStaging ? `https://${host}` : "https://www.kitaab.me"),

    title: {
      default: "Kitaab – Islamic Deed Tracker | Track Hasanaat & Sayyiaat",
      template: "%s | Kitaab",
    },

    description:
      "Kitaab is an Islamic self-accountability app that helps Muslims track daily Hasanaat (good deeds) and Sayyiaat (bad deeds). Monitor progress, build consistency, and strengthen your spiritual growth.",

    alternates: isStaging
      ? { canonical: undefined }
      : { canonical: "https://www.kitaab.me" },

    keywords: [
      "Islamic app",
      "Deed tracker",
      "Hasanaat tracker",
      "Sayyiat tracker",
      "Muslim productivity app",
      "Islamic self accountability",
      "Daily Islamic journal",
    ],

    authors: [{ name: "Muhammad Hashir Malik" }],
    creator: "Muhammad Hashir Malik",
    publisher: "Kitaab",

    themeColor: "#646464",

    openGraph: {
      type: "website",
      locale: "en_US",
      url: isStaging ? `https://${host}` : "https://www.kitaab.me",
      siteName: "Kitaab",
      title: "Kitaab – Islamic Deed Tracker",
      description:
        "Track your daily good and bad deeds. Build consistency and improve spiritually.",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Kitaab - Islamic Deed Tracker",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: "Kitaab – Islamic Deed Tracker",
      description:
        "Track Hasanaat and Sayyiaat daily and strengthen your spiritual journey.",
      images: ["/og-image.png"],
    },

    robots: isStaging
      ? {
          index: false,
          follow: false,
          nocache: true,
          googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
          },
        }
      : {
          index: true,
          follow: true,
        },

    icons: {
      icon: [
        { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: "/apple-icon.png",
    },

    manifest: "/site.webmanifest",
    category: "productivity",
  };

  return base;
}
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const hdrs = await headers();
  const host = hdrs.get("host") ?? "";
  const isStaging = host.includes("staging.kitaab.me");
  return (
    <html lang="en">
      <body>
        {!isStaging ? (
          <>
            <Script
              src="https://www.googletagmanager.com/gtag/js?id=G-B54XB3CG5Z"
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-B54XB3CG5Z');
              `}
            </Script>
          </>
        ) : null}
        <StoreProvider>
          <ClientLayout>{children}</ClientLayout>
        </StoreProvider>
      </body>
    </html>
  );
}