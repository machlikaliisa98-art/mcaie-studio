const menu = [
  {
    icon: "🏠",
    title: "Dashboard",
  },
  {
    icon: "🎙",
    title: "Productions",
  },
  {
    icon: "🎧",
    title: "Episodes",
  },
  {
    icon: "📝",
    title: "Transcripts",
  },
  {
    icon: "📊",
    title: "Analytics",
  },
  {
    icon: "⚙",
    title: "Settings",
  },
];

export default function Sidebar() {
  return (
    <aside
      style={{
        width: 260,
        background: "#111111",
        borderRight: "1px solid #2b2b2b",
        padding: 25,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <h2
          style={{
            color: "#D4AF37",
            marginBottom: 35,
          }}
        >
          Navigation
        </h2>

        {menu.map((item) => (
          <div
            key={item.title}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 15,
              padding: "14px 16px",
              marginBottom: 10,
              borderRadius: 12,
              cursor: "pointer",
              color: "#ddd",
              background: item.title === "Dashboard" ? "#1E1E1E" : "transparent",
              transition: ".2s",
            }}
          >
            <span
              style={{
                fontSize: 22,
              }}
            >
              {item.icon}
            </span>

            <span
              style={{
                fontSize: 16,
                fontWeight: 500,
              }}
            >
              {item.title}
            </span>
          </div>
        ))}
      </div>

      <div
        style={{
          borderTop: "1px solid #2b2b2b",
          paddingTop: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 10,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#22c55e",
            }}
          />

          <strong
            style={{
              color: "#fff",
            }}
          >
            AI Engine Online
          </strong>
        </div>

        <p
          style={{
            color: "#888",
            fontSize: 13,
            margin: 0,
          }}
        >
          Version 0.1 MVP
        </p>
      </div>
    </aside>
  );
}