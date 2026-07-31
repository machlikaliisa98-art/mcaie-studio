export default function Header() {
  return (
    <header
      style={{
        height: 80,
        background: "#111111",
        borderBottom: "1px solid #2b2b2b",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 35px",
      }}
    >
      <div>
        <h1
          style={{
            color: "#D4AF37",
            margin: 0,
            fontSize: 28,
            fontWeight: 700,
          }}
        >
          🎙 Kyamagero's Man Cave UG AI Studio
        </h1>

        <p
          style={{
            margin: 0,
            color: "#888",
            fontSize: 13,
          }}
        >
          AI Podcast Production Platform
        </p>
      </div>

      <div
        style={{
          textAlign: "right",
        }}
      >
        <h3
          style={{
            margin: 0,
            color: "white",
          }}
        >
          Nexus Inc.
        </h3>

        <p
          style={{
            margin: 0,
            color: "#777",
            fontSize: 13,
          }}
        >
          Designed & Developed
        </p>
      </div>
    </header>
  );
}