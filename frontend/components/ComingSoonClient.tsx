"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { me } from "@/lib/api";
import PwInteractions from "@/components/PwInteractions";
import { soonHtml } from "@/lib/screens/soon";

// Browser-side auth guard. The session cookie lives on the backend domain, so the
// check must run in the browser (which sends that cookie to the backend), not on the
// Next.js server — otherwise it can't see the cookie across domains.
export default function ComingSoonClient() {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "authed">("checking");

  useEffect(() => {
    let active = true;
    me().then((user) => {
      if (!active) return;
      if (user) setStatus("authed");
      else router.replace("/login");
    });
    return () => {
      active = false;
    };
  }, [router]);

  // Dark placeholder matches the coming-soon background to avoid a white flash.
  if (status !== "authed") {
    return <div style={{ minHeight: "100vh", background: "#14130F" }} />;
  }

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: soonHtml }} />
      <PwInteractions />
    </>
  );
}
