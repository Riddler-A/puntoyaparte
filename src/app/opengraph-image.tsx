import { ImageResponse } from "next/og";
import { lema } from "@/lib/evento";

// Imagen que aparece al compartir el sitio en WhatsApp, Facebook, LinkedIn, etc. (1200 x 630).
export const alt = "Punto y Aparte · Conversaciones sobre empresa, prosperidad y humanidad";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
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
          background: "#faf6f0",
          color: "#1e1c1c",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "32px",
              background: "#f94441",
            }}
          />
          <div style={{ display: "flex", fontSize: "36px", fontWeight: 700 }}>Punto y Aparte</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: "72px", fontWeight: 700, lineHeight: 1.1, maxWidth: "1000px" }}>
            Hagamos que el éxito signifique algo más.
          </div>
          <div style={{ display: "flex", marginTop: "32px", fontSize: "32px", color: "#5a5552" }}>{lema}.</div>
        </div>
        <div style={{ display: "flex", fontSize: "26px", color: "#f94441", fontWeight: 700 }}>
          Encuentros para dueños y directivos · Guadalajara
        </div>
      </div>
    ),
    { ...size },
  );
}
