"use client";

export default function ConversationLibrary() {
  return (
    <main>
      {/* Header */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 40,
        }}
      >
        <div>
          <div
            style={{
              color: "#B48A45",
              fontWeight: 700,
              letterSpacing: 2,
            }}
          >
            LIBRARY
          </div>

          <h1
            style={{
              marginTop: 10,
              color: "#153848",
              fontSize: 48,
            }}
          >
            Conversation Library
          </h1>

          <p
            style={{
              color: "#666",
              lineHeight: 1.8,
              maxWidth: 700,
            }}
          >
            Every conversation is automatically organized into a structured knowledge library. Browse, manage and publish from one place.
          </p>
        </div>

        <button
          style={{
            background: "#153848",
            color: "#FFFFFF",
            border: "none",
            padding: "18px 34px",
            borderRadius: 999,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          + New Conversation
        </button>
      </div>

      {/* Filters */}

      <div
        style={{
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 40,
        }}
      >
        {[
          "All",
          "Drafts",
          "Processing",
          "Published",
          "Scheduled",
          "Series",
          "Standalone",
          "Archived",
        ].map((item) => (
          <button
            key={item}
            style={{
              background: "#FFFFFF",
              border: "1px solid #DDD3C6",
              borderRadius: 999,
              padding: "14px 24px",
              color: "#153848",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Empty State */}

      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 30,
          padding: "80px 50px",
          textAlign: "center",
          boxShadow: "0 14px 40px rgba(0,0,0,.05)",
        }}
      >
        <div
          style={{
            fontSize: 70,
            marginBottom: 24,
          }}
        >
          📚
        </div>

        <h2
          style={{
            margin: 0,
            color: "#153848",
          }}
        >
          Your library is empty.
        </h2>

        <p
          style={{
            marginTop: 20,
            color: "#777",
            lineHeight: 1.8,
            maxWidth: 700,
            marginInline: "auto",
          }}
        >
          Publish your first conversation and FONS will automatically
          organize the original recording, episodes, highlights,
          transcript, summaries, topics, quotes and every generated
          knowledge asset into your library.
        </p>

        <button
          style={{
            marginTop: 35,
            background: "#153848",
            color: "#FFFFFF",
            border: "none",
            padding: "18px 34px",
            borderRadius: 999,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Create First Conversation
        </button>
      </div>
    </main>
  );
}