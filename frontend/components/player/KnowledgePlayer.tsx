"use client";

type Props = {
  title?: string;
  creator?: string;
  show?: string;
  series?: string;
  artwork?: string;
  duration?: string;
};

export default function KnowledgePlayer({
  title = "No conversation selected",
  creator = "",
  show = "",
  series = "",
  artwork,
  duration = "00:00",
}: Props) {
  return (
    <section
      style={{
        background: "#FFFFFF",
        borderRadius: 34,
        padding: 34,
        boxShadow: "0 14px 40px rgba(0,0,0,.05)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "340px 1fr",
          gap: 40,
        }}
      >
        {/* Artwork */}

        <div
          style={{
            width: "100%",
            aspectRatio: "1",
            borderRadius: 26,
            overflow: "hidden",
            background: "#E8DED1",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {artwork ? (
            <img
              src={artwork}
              alt={title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                color: "#777",
                fontWeight: 700,
              }}
            >
              Cover Artwork
            </div>
          )}
        </div>

        {/* Conversation */}

        <div>
          <div
            style={{
              color: "#B48A45",
              fontWeight: 700,
              letterSpacing: 2,
              marginBottom: 10,
            }}
          >
            CONVERSATION
          </div>

          <h1
            style={{
              margin: 0,
              color: "#153848",
              fontSize: 46,
            }}
          >
            {title}
          </h1>

          <div
            style={{
              marginTop: 18,
              color: "#666",
              fontSize: 18,
            }}
          >
            {creator}
          </div>

          <div
            style={{
              marginTop: 6,
              color: "#999",
            }}
          >
            {show}
            {series && ` • ${series}`}
          </div>

          {/* PLAYER */}

          <div
            style={{
              marginTop: 40,
              background: "#F8F4EE",
              borderRadius: 22,
              padding: 26,
            }}
          >
            {/* Controls */}

            <div
              style={{
                display: "flex",
                gap: 18,
                alignItems: "center",
              }}
            >
              <PlayerButton>⏮</PlayerButton>

              <PlayButton />

              <PlayerButton>⏭</PlayerButton>

              <PlayerButton>1×</PlayerButton>

              <PlayerButton>🔖</PlayerButton>

              <PlayerButton>📝</PlayerButton>

              <PlayerButton>⬇</PlayerButton>

              <PlayerButton>🔗</PlayerButton>
            </div>

            {/* Progress */}

            <div
              style={{
                marginTop: 34,
              }}
            >
              <div
                style={{
                  height: 8,
                  background: "#DDD3C6",
                  borderRadius: 999,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: "35%",
                    height: "100%",
                    background: "#153848",
                  }}
                />
              </div>

              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#777",
                  fontWeight: 600,
                }}
              >
                <span>05:18</span>

                <span>{duration}</span>
              </div>
            </div>
          </div>

          {/* Timeline */}

          <div
            style={{
              marginTop: 35,
            }}
          >
            <div
              style={{
                color: "#153848",
                fontWeight: 700,
                marginBottom: 18,
              }}
            >
              Conversation Timeline
            </div>

            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              {[
                "Introduction",
                "Speaker Change",
                "Quote",
                "Topic",
                "Chapter",
                "Book",
                "Note",
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    background: "#F6F1E8",
                    borderRadius: 999,
                    padding: "12px 18px",
                    color: "#153848",
                    fontWeight: 600,
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PlayerButton({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <button
      style={{
        width: 52,
        height: 52,
        borderRadius: "50%",
        border: "none",
        background: "#FFFFFF",
        cursor: "pointer",
        fontWeight: 700,
        boxShadow: "0 6px 16px rgba(0,0,0,.08)",
      }}
    >
      {children}
    </button>
  );
}

function PlayButton() {
  return (
    <button
      style={{
        width: 70,
        height: 70,
        borderRadius: "50%",
        border: "none",
        background: "#153848",
        color: "#FFFFFF",
        cursor: "pointer",
        fontSize: 24,
        fontWeight: 700,
      }}
    >
      ▶
    </button>
  );
}