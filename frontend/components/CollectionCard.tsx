"use client";

type Props = {
  title?: string;
  description?: string;
  cover?: string;
  conversations?: number;
};

export default function CollectionCard({
  title = "Untitled Collection",
  description = "No description available.",
  cover,
  conversations = 0,
}: Props) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 30,
        overflow: "hidden",
        boxShadow: "0 14px 40px rgba(0,0,0,.05)",
        transition: ".25s",
        cursor: "pointer",
      }}
    >
      {/* Cover */}

      <div
        style={{
          height: 220,
          background: cover
            ? `url(${cover}) center/cover`
            : "#EFE7DB",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {!cover && (
          <div
            style={{
              color: "#153848",
              fontSize: 34,
              fontWeight: 700,
              letterSpacing: 3,
            }}
          >
            FONS
          </div>
        )}
      </div>

      {/* Body */}

      <div
        style={{
          padding: 28,
        }}
      >
        <div
          style={{
            color: "#B48A45",
            fontWeight: 700,
            letterSpacing: 2,
            fontSize: 12,
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          Collection
        </div>

        <h2
          style={{
            margin: 0,
            color: "#153848",
            fontSize: 28,
            lineHeight: 1.3,
          }}
        >
          {title}
        </h2>

        <p
          style={{
            marginTop: 18,
            color: "#666",
            lineHeight: 1.8,
            minHeight: 70,
          }}
        >
          {description}
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 26,
          }}
        >
          <div>
            <div
              style={{
                color: "#153848",
                fontWeight: 700,
                fontSize: 22,
              }}
            >
              {conversations}
            </div>

            <div
              style={{
                color: "#888",
                fontSize: 13,
              }}
            >
              Conversations
            </div>
          </div>

          <button
            style={{
              background: "#153848",
              color: "#FFFFFF",
              border: "none",
              borderRadius: 999,
              padding: "14px 24px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Open
          </button>
        </div>
      </div>
    </div>
  );
}