import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const DESCRIPTION =
  "Postwing lets creators, small businesses and founders schedule and cross-post content to Instagram, TikTok, YouTube, X, LinkedIn and more — from one simple dashboard, without the enterprise price tag.";

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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
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
