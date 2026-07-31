export default function Header() {

  return (

    <header
      style={{
        background: "rgba(17,28,45,.92)",
        borderBottom: "1px solid rgba(255,255,255,.08)",
        padding: "22px 34px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 100,
        backdropFilter: "blur(18px)",
      }}
    >

      <div>

        <div
          style={{
            color: "#94A3B8",
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 6,
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          Powered by MCAIE
        </div>

        <h1
          style={{
            fontSize: 30,
            fontWeight: 800,
            color: "#FFFFFF",
            margin: 0,
          }}
        >
          Man Cave UG AI Studio
        </h1>

      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >

        <input
          placeholder="Search episodes, transcripts, summaries..."
          style={{
            width: 420,
            padding: "15px 22px",
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,.08)",
            background: "#0E1726",
            color: "#FFFFFF",
            fontSize: 15,
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >

          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#10B981",
              boxShadow: "0 0 12px #10B981",
            }}
          />

          <span
            style={{
              color: "#FFFFFF",
              fontWeight: 700,
            }}
          >
            MCAIE Online
          </span>

        </div>

        <button
          style={{
            background: "#F59E0B",
            color: "#08101B",
            fontWeight: 800,
            padding: "15px 28px",
            borderRadius: 14,
            border: "none",
          }}
        >
          + New Production
        </button>

      </div>

    </header>

  );

}