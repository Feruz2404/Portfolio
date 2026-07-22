import { ImageResponse } from "next/og";

const size = { width: 1200, height: 630 };

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          backgroundColor: "#05070A",
          backgroundImage:
            "radial-gradient(1000px 600px at 78% 25%, rgba(47,227,194,0.16), transparent 60%)",
          color: "#F2EFE6",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            fontSize: 34,
            letterSpacing: "0",
            textTransform: "uppercase",
            color: "rgba(242,239,230,0.6)",
          }}
        >
          <div style={{ display: "flex", width: 28, height: 3, backgroundColor: "#2FE3C2" }} />
          Digital Atelier
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 128, fontWeight: 700, letterSpacing: "0", lineHeight: 1 }}>
            Feruz<span style={{ color: "#2FE3C2" }}>.</span>
          </div>
          <div style={{ display: "flex", marginTop: 26, fontSize: 40, color: "rgba(242,239,230,0.7)", maxWidth: 900 }}>
            Web platforms, interactive 3D experiences and the systems behind them.
          </div>
        </div>

        <div style={{ display: "flex", gap: "14px", fontSize: 28, color: "rgba(242,239,230,0.5)" }}>
          UZ - EN - RU
        </div>
      </div>
    ),
    size,
  );
}
