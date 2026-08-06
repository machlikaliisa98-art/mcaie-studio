"use client";

export default function ConversationPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#F6F1E8",
        padding: "40px",
      }}
    >
      <div
        style={{
          maxWidth: 1500,
          margin: "0 auto",
        }}
      >
        {/* Empty State */}

        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 32,
            padding: "80px 60px",
            textAlign: "center",
            boxShadow: "0 16px 45px rgba(0,0,0,.05)",
          }}
        >
          <div
            style={{
              fontSize: 80,
              marginBottom: 30,
            }}
          >
            🎙️
          </div>

          <h1
            style={{
              margin: 0,
              color: "#153848",
              fontSize: 48,
            }}
          >
            No Conversation Loaded
          </h1>

          <p
            style={{
              marginTop: 24,
              color: "#666",
              fontSize: 20,
              lineHeight: 1.9,
              maxWidth: 760,
              marginInline: "auto",
            }}
          >
            Select a conversation from a creator, show or series.
            When a conversation is opened, FONS will display its audio,
            transcript, insights, speakers, chapters, quotes and every
            piece of knowledge generated from it.
          </p>
        </div>

        {/* Knowledge Sections */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: 30,
            marginTop: 40,
          }}
        >
          <Section title="Transcript" />
          <Section title="Summary" />

          <Section title="Chapters" />
          <Section title="Topics" />

          <Section title="Key Quotes" />
          <Section title="Speakers" />

          <Section title="Notes" />
          <Section title="Related Conversations" />
        </div>
      </div>
    </main>
  );
}

function Section({ title }: { title: string }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 28,
        padding: 30,
        minHeight: 240,
        boxShadow: "0 12px 35px rgba(0,0,0,.05)",
      }}
    >
      <h2
        style={{
          marginTop: 0,
          color: "#153848",
        }}
      >
        {title}
      </h2>

      <p
        style={{
          color: "#888",
          lineHeight: 1.8,
        }}
      >
        This section will populate automatically when conversation
        data is available.
      </p>
    </div>
  );
}