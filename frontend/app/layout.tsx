import type { Metadata } from "next";
import "./globals.css";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://postwing-production.up.railway.app";
// Kept under 160 characters for the meta description.
const DESCRIPTION =
  "Schedule once, publish everywhere. Postwing is the affordable social scheduler for creators and small teams — plan and cross-post from one dashboard.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Postwing — Schedule once. Publish everywhere.",
    template: "%s · Postwing",
  },
  description: DESCRIPTION,
  applicationName: "Postwing",
  keywords: [
    "social media scheduler",
    "cross-post to social media",
    "schedule Instagram TikTok YouTube",
    "content calendar",
    "social media management tool",
    "affordable social scheduler",
  ],
  authors: [{ name: "Postwing" }],
  creator: "Postwing",
  publisher: "Postwing",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    type: "website",
    siteName: "Postwing",
    title: "Postwing — Schedule once. Publish everywhere.",
    description: DESCRIPTION,
    url: SITE_URL,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Postwing — Schedule once. Publish everywhere.",
    description: DESCRIPTION,
  },
  category: "technology",
  verification: {
    other: {
      "ahrefs-site-verification":
        "2dbe70a44809a05f3084b805440d36779a2549848d26d18ad2272ce2a9e60457",
    },
  },
};

// Site-wide structured data — helps SEO, AEO (answer engines) and GEO (generative engines).
const orgLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Postwing",
      url: SITE_URL,
      description: DESCRIPTION,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Postwing",
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en",
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Font stylesheet only. Preconnect hints to the bare font domains were
            removed because they resolve to 404 (no page at the domain root) and
            Ahrefs flags them as broken links; the stylesheet URL below is 200. */}
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Instrument+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
