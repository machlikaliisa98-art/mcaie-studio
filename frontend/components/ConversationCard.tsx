"use client";

type Props = {
  title?: string;
  creator?: string;
  category?: string;
  duration?: string;
  published?: string;
  artwork?: string;
};

export default function ConversationCard({
  title = "Untitled Conversation",
  creator = "Unknown Creator",
  category = "Conversation",
  duration = "--:--",
  published = "Draft",
  artwork,
}: Props) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 28,
        overflow: "hidden",
        boxShadow: "0 12px 35px rgba(0,0,0,.05)",
        transition: ".25s",
        cursor: "pointer",
      }}
    >
      {/* Artwork */}

      <div
        style={{
          height: 220,
          background: artwork
            ? `url(${artwork}) center/cover`
            : "#EFE7DB",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {!artwork && (
          <div
            style={{
              color: "#B48A45",
              fontWeight: 700,
              letterSpacing: 2,
            }}
          >
            FONS
          </div>
        )}
      </div>

      {/* Content */}

      <div
        style={{
          padding: 24,
        }}
      >
        <div
          style={{
            color: "#B48A45",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          {category}
        </div>

        <h3
          style={{
            margin: 0,
            color: "#153848",
            fontSize: 26,
            lineHeight: 1.35,
          }}
        >
          {title}
        </h3>

        <div
          style={{
            marginTop: 18,
            color: "#666",
            lineHeight: 1.7,
          }}
        >
          {creator}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 24,
            color: "#888",
            fontSize: 14,
          }}
        >
          <span>{duration}</span>

          <span>{published}</span>
        </div>
      </div>
    </div>
  );
}