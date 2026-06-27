import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "MilliyPrep - Milliy Sertifikatga tayyorlash";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f8fafc",
          color: "#0f172a",
          padding: 72,
          fontFamily: "Inter, Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            fontSize: 34,
            fontWeight: 800,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 14,
              background: "#0f766e",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            M
          </div>
          MilliyPrep
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 72, lineHeight: 1.05, fontWeight: 900 }}>
            Milliy Sertifikatga tayyorlash
          </div>
          <div style={{ maxWidth: 860, fontSize: 30, lineHeight: 1.35, color: "#334155" }}>
            CEFR B1, B2 va C1 uchun shaxsiy reja, mock testlar va AI tutor.
          </div>
        </div>
      </div>
    ),
    size
  );
}
