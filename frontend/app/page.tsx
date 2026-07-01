import type { Metadata } from "next";
import PwInteractions from "@/components/PwInteractions";
import { landingHtml } from "@/lib/screens/landing";

export const metadata: Metadata = {
  title: "Postwing — Schedule once. Publish everywhere.",
  description:
    "The affordable way for creators and small teams to plan, schedule and cross-post to Instagram, TikTok, YouTube, X, LinkedIn, Facebook, Threads, Pinterest and Bluesky from one dashboard.",
  alternates: { canonical: "/" },
};

// Product + FAQ structured data (verbatim intent from the design) — strengthens
// SEO, answer-engine (AEO) and generative-engine (GEO) understanding.
const landingLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "Postwing",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description:
        "Postwing lets creators, small businesses and founders schedule and cross-post content to every social platform from one simple dashboard — without the enterprise price tag.",
      offers: { "@type": "Offer", price: "15", priceCurrency: "USD" },
      aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", ratingCount: "1284" },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Which social platforms does Postwing support?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Postwing supports Instagram, TikTok, YouTube, X (Twitter), LinkedIn, Facebook, Threads, Pinterest and Bluesky — schedule once and publish everywhere.",
          },
        },
        {
          "@type": "Question",
          name: "How much does Postwing cost?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Postwing starts free. The Pro plan is $15/mo billed annually for unlimited scheduled posts across all connected accounts.",
          },
        },
        {
          "@type": "Question",
          name: "Do I need a separate tool for each network?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Postwing is a single dashboard for every network, so you compose once and Postwing adapts and publishes to each platform.",
          },
        },
        {
          "@type": "Question",
          name: "Is there a free trial?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes — you can start on the free plan with no credit card required and upgrade whenever you are ready.",
          },
        },
      ],
    },
  ],
};

export default function LandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(landingLd) }}
      />
      <div dangerouslySetInnerHTML={{ __html: landingHtml }} />
      <PwInteractions />
    </>
  );
}
