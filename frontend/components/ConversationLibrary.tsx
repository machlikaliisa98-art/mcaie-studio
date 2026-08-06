"use client";

import ConversationCard from "./ConversationCard";

type Conversation = {
  id: string;
  title: string;
  creator: string;
  category: string;
  duration: string;
  published: string;
  artwork?: string;
};

type Props = {
  conversations?: Conversation[];
};

export default function ConversationLibrary({
  conversations = [],
}: Props) {
  return (
    <section
      style={{
        marginTop: 40,
      }}
    >
      {/* Header */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "end",
          marginBottom: 32,
        }}
      >
        <div>
          <div
            style={{
              color: "#B48A45",
              fontWeight: 700,
              letterSpacing: 2,
              fontSize: 13,
              marginBottom: 8,
              textTransform: "uppercase",
            }}
          >
            Library
          </div>

          <h2
            style={{
              margin: 0,
              color: "#153848",
              fontSize: 42,
              fontWeight: 700,
            }}
          >
            Conversation Library
          </h2>

          <p
            style={{
              marginTop: 14,
              color: "#666",
              maxWidth: 700,
              lineHeight: 1.8,
              fontSize: 17,
            }}
          >
            Browse every conversation you've created, saved or published.
            Search, organize and return to knowledge whenever you need it.
          </p>
        </div>

        <button
          style={{
            background: "#153848",
            color: "#FFFFFF",
            border: "none",
            borderRadius: 999,
            padding: "16px 28px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          New Conversation
        </button>
      </div>

      {/* Empty State */}

      {conversations.length === 0 ? (
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 30,
            padding: "80px 40px",
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
            💬
          </div>

          <h2
            style={{
              margin: 0,
              color: "#153848",
              fontSize: 34,
            }}
          >
            Your library is empty.
          </h2>

          <p
            style={{
              marginTop: 18,
              color: "#777",
              lineHeight: 1.8,
              maxWidth: 620,
              marginInline: "auto",
            }}
          >
            Every conversation you create or publish will appear here,
            ready to be explored, organized into collections and shared
            with your audience.
          </p>

          <button
            style={{
              marginTop: 34,
              background: "#153848",
              color: "#FFFFFF",
              border: "none",
              borderRadius: 999,
              padding: "18px 34px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Start Your First Conversation
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill,minmax(360px,1fr))",
            gap: 28,
          }}
        >
          {conversations.map((conversation) => (
            <ConversationCard
              key={conversation.id}
              title={conversation.title}
              creator={conversation.creator}
              category={conversation.category}
              duration={conversation.duration}
              published={conversation.published}
              artwork={conversation.artwork}
            />
          ))}
        </div>
      )}
    </section>
  );
}