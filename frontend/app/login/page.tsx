import type { Metadata } from "next";
import PwInteractions from "@/components/PwInteractions";
import { loginHtml } from "@/lib/screens/login";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your Postwing dashboard to schedule and cross-post to every network.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/login" },
};

export default function LoginPage() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: loginHtml }} />
      <PwInteractions />
    </>
  );
}
