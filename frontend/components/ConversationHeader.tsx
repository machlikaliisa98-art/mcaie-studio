"use client";

type Props = {
  title?: string;
  creator?: string;
  duration?: string;
  published?: string;
  category?: string;
};

export default function ConversationHeader({
  title = "Untitled Conversation",
  creator = "Unknown Creator",
  duration = "--:--",
  published = "Draft",
  category = "Conversation",
}: Props) {
  return (
    <section
      style={{
        background: "#FFFFFF",
        borderRadius: 30,
        padding: 34,
        marginBottom: 30,
        boxShadow: "0 14px 40px rgba(0,0,0,.05)",
      }}
    >
      <div
        style={{
          color: "#B48A45",
          letterSpacing: 2,
          fontWeight: 700,
          fontSize: 13,
          marginBottom: 12,
          textTransform: "uppercase",
        }}
      >
        {category}
      </div>

      <h1
        style={{
          margin: 0,
          color: "#153848",
          fontSize: 44,
          lineHeight: 1.2,
          fontWeight: 700,
        }}
      >
        {title}
      </h1>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          marginTop: 24,
          alignItems: "center",
        }}
      >
        <span
          style={{
            color: "#153848",
            fontWeight: 700,
          }}
        >
          {creator}
        </span>

        <span style={{ color: "#B8B8B8" }}>•</span>

        <span style={{ color: "#666" }}>
          {duration}
        </span>

        <span style={{ color: "#B8B8B8" }}>•</span>

        <span style={{ color: "#666" }}>
          {published}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          gap: 16,
          marginTop: 34,
        }}
      >
        <button
          style={{
            background: "#153848",
            color: "#FFFFFF",
            border: "none",
            padding: "16px 28px",
            borderRadius: 999,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          ▶ Play Conversation
        </button>

        <button
          style={{
            background: "#F6F1E8",
            color: "#153848",
            border: "1px solid #E7DED2",
            padding: "16px 28px",
            borderRadius: 999,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Save
        </button>

        <button
          style={{
            background: "#F6F1E8",
            color: "#153848",
            border: "1px solid #E7DED2",
            padding: "16px 28px",
            borderRadius: 999,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Share
        </button>
      </div>
    </section>
  );
}