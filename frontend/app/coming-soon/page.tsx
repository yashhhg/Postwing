import type { Metadata } from "next";
import { redirect } from "next/navigation";
import PwInteractions from "@/components/PwInteractions";
import { getCurrentUser } from "@/lib/serverAuth";
import { soonHtml } from "@/lib/screens/soon";

export const metadata: Metadata = {
  title: "You're on the list",
  description: "Your Postwing account is ready — the full dashboard is landing very soon.",
  robots: { index: false, follow: false },
};

export default async function ComingSoonPage() {
  // Route guard: only authenticated users can see the coming-soon screen.
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: soonHtml }} />
      <PwInteractions />
    </>
  );
}
