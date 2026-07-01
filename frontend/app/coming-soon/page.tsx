import type { Metadata } from "next";
import ComingSoonClient from "@/components/ComingSoonClient";

export const metadata: Metadata = {
  title: "You're on the list",
  description: "Your Postwing account is ready — the full dashboard is landing very soon.",
  robots: { index: false, follow: false },
};

export default function ComingSoonPage() {
  // Auth is verified in the browser (see ComingSoonClient) because the session
  // cookie is set on the backend domain, which the Next.js server can't read.
  return <ComingSoonClient />;
}
