import { NextResponse } from "next/server";

export async function GET() {
  const robotsTxt = `User-agent: *
Allow: /

# Sitemap
Sitemap: https://kitaab.me/sitemap.xml

# Disallow admin and API routes
Disallow: /api/
Disallow: /_next/
Disallow: /admin/

# Allow all public pages
Allow: /
Allow: /features
Allow: /about
Allow: /contact
Allow: /faqs
Allow: /support
Allow: /privacy-policy
Allow: /terms-of-service
Allow: /cookie-policy
Allow: /sitemap
`;

  return new NextResponse(robotsTxt, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
