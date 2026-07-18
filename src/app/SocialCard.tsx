import couplePhoto from "@/imports/DSC08168.jpg";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

export default function SocialCard() {
  return (
    <div
      style={{
        width: 1200,
        height: 630,
        display: "flex",
        fontFamily: "'DM Sans', sans-serif",
        background: "#ffffff",
        flexShrink: 0,
      }}
    >
      {/* LEFT — typographic panel */}
      <div
        style={{
          width: 560,
          height: 630,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "52px 56px",
          background: "#ffffff",
          borderRight: "1px solid rgba(0,0,0,0.12)",
          boxSizing: "border-box",
        }}
      >
        {/* Top row — label */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(0,0,0,0.35)",
            }}
          >
            Wedding Invitation
          </span>
          <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.1)" }} />
        </div>

        {/* Middle — names */}
        <div>
          <p
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(0,0,0,0.35)",
              marginBottom: 20,
            }}
          >
            14 · 09 · 2025
          </p>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 88,
              fontWeight: 400,
              lineHeight: 0.92,
              color: "#0a0a0a",
              margin: 0,
              letterSpacing: "-0.01em",
            }}
          >
            Elena
            <br />
            <span style={{ fontStyle: "italic" }}>&amp; Marcus</span>
          </h1>
        </div>

        {/* Bottom — venue */}
        <div>
          <div style={{ height: 1, background: "rgba(0,0,0,0.1)", marginBottom: 20 }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <p
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 11,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(0,0,0,0.35)",
                margin: 0,
              }}
            >
              Château Beaumont
            </p>
            <p
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 11,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(0,0,0,0.25)",
                margin: 0,
              }}
            >
              Saint-Émilion, Bordeaux
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT — photo */}
      <div
        style={{
          width: 640,
          height: 630,
          overflow: "hidden",
          position: "relative",
          background: "#d0d0d0",
        }}
      >
        <ImageWithFallback
          src={couplePhoto}
          alt="Elena and Marcus — couple portrait"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 15%",
            filter: "grayscale(100%)",
            display: "block",
          }}
        />
        {/* Subtle right-edge vignette so it doesn't feel raw */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to right, rgba(255,255,255,0.08) 0%, transparent 30%)",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}
