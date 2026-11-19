import { ImageResponse } from "next/og";

export const alt = "MONTSERRAT_AI. Menos tareas. Más negocio.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px",
        background: "#0C0D10",
        color: "white",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            background: "#E60A2F",
            width: 64,
            height: 64,
            borderRadius: "45% 55% 40% 60%",
          }}
        >
          <div
            style={{
              width: 7,
              height: 17,
              borderRadius: 5,
              background: "white",
            }}
          />
          <div
            style={{
              width: 7,
              height: 17,
              borderRadius: 5,
              background: "white",
            }}
          />
        </div>
        <div style={{ fontSize: 26, fontWeight: 600 }}>MONTSERRAT_AI</div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 88,
          lineHeight: 1.05,
          letterSpacing: "-4px",
          fontWeight: 700,
        }}
      >
        <span>Menos tareas.</span>
        <span style={{ color: "#8A8D93" }}>Más negocio.</span>
      </div>
      <div style={{ display: "flex", color: "#C9CBD0", fontSize: 25 }}>
        Automatizaciones con IA a la medida de tu operación{" "}
        <span style={{ color: "#E60A2F", marginLeft: 24 }}>↗</span>
      </div>
    </div>,
    { ...size },
  );
}
