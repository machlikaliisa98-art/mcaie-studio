"use client";

export default function ConversationWorkspace() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: 30,
      }}
    >
      {/* LEFT */}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 30,
        }}
      >
        {/* Audio */}

        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 30,
            padding: 32,
            boxShadow: "0 14px 40px rgba(0,0,0,.05)",
          }}
        >
          <div
            style={{
              color: "#B48A45",
              fontWeight: 700,
              letterSpacing: 2,
              fontSize: 13,
              marginBottom: 10,
            }}
          >
            CONVERSATION
          </div>

          <h2
            style={{
              marginTop: 0,
              color: "#153848",
              fontSize: 34,
            }}
          >
            Audio Player
          </h2>

          <div
            style={{
              height: 170,
              marginTop: 30,
              borderRadius: 20,
              background: "#F8F5EF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#888",
            }}
          >
            Waveform will appear here
          </div>

          <div
            style={{
              marginTop: 30,
              display: "flex",
              justifyContent: "center",
              gap: 20,
            }}
          >
            <button style={buttonStyle}>⏮</button>
            <button style={playButton}>▶</button>
            <button style={buttonStyle}>⏭</button>
          </div>
        </div>

        {/* Transcript */}

        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 30,
            padding: 32,
            minHeight: 500,
            boxShadow: "0 14px 40px rgba(0,0,0,.05)",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              color: "#153848",
            }}
          >
            Transcript
          </h2>

          <p
            style={{
              color: "#777",
              lineHeight: 1.9,
            }}
          >
            The transcript will appear here after the conversation has
            been processed. Selecting text will later allow users to
            create notes, bookmarks and highlights.
          </p>
        </div>
      </div>

      {/* RIGHT */}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {[
          "Summary",
          "Topics",
          "Key Quotes",
          "Bookmarks",
          "Notes",
          "Related Conversations",
        ].map((section) => (
          <div
            key={section}
            style={{
              background: "#FFFFFF",
              borderRadius: 24,
              padding: 24,
              boxShadow: "0 14px 40px rgba(0,0,0,.05)",
            }}
          >
            <h3
              style={{
                marginTop: 0,
                color: "#153848",
              }}
            >
              {section}
            </h3>

            <p
              style={{
                color: "#777",
                lineHeight: 1.8,
                marginBottom: 0,
              }}
            >
              This section will populate automatically once the
              conversation has been processed.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

const buttonStyle: React.CSSProperties = {
  width: 54,
  height: 54,
  borderRadius: "50%",
  border: "1px solid #E6DDD0",
  background: "#FFFFFF",
  cursor: "pointer",
  fontSize: 18,
};

const playButton: React.CSSProperties = {
  width: 72,
  height: 72,
  borderRadius: "50%",
  border: "none",
  background: "#153848",
  color: "#FFFFFF",
  cursor: "pointer",
  fontSize: 26,
};