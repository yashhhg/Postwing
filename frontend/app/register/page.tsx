import type { Metadata } from "next";
import PwInteractions from "@/components/PwInteractions";
import { registerHtml } from "@/lib/screens/register";

export const metadata: Metadata = {
  title: "Create your account",
  description:
    "Create your free Postwing account and start scheduling to all nine social networks in minutes.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/register" },
};

export default function RegisterPage() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: registerHtml }} />
      <PwInteractions />
    </>
  );
}
