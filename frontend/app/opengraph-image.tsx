import { ImageResponse } from "next/og";

// Site-wide Open Graph / social preview image, generated at build time.
// Using a generated image (rather than a static file) guarantees the og:image
// URL resolves 200 — so it completes the OG tags without risking a broken asset.
export const alt = "Postwing — Schedule once. Publish everywhere.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#14130F",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div
            style={{
              width: 68,
              height: 68,
              background: "#5B3BEE",
              borderRadius: 18,
              display: "flex",
            }}
          />
          <div style={{ fontSize: 44, fontWeight: 700 }}>Postwing</div>
        </div>
        <div style={{ fontSize: 78, fontWeight: 800, marginTop: 44, lineHeight: 1.05 }}>
          Schedule once.
        </div>
        <div style={{ fontSize: 78, fontWeight: 800, lineHeight: 1.05 }}>Publish everywhere.</div>
        <div style={{ fontSize: 32, color: "#C8C4B8", marginTop: 28 }}>
          The affordable social scheduler for creators &amp; small teams.
        </div>
      </div>
    ),
    { ...size }
  );
}
