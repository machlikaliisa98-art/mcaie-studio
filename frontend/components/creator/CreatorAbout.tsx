"use client";

export default function CreatorAbout() {
  return (
    <section
      style={{
        background: "#153848",
        color: "#F6F1E8",
        borderRadius: 30,
        padding: 38,
        minHeight: 270,
      }}
    >
      <div
        style={{
          color: "#D8B46A",
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: 2,
          textTransform: "uppercase",
          marginBottom: 12,
        }}
      >
        About the creator
      </div>

      <h2
        style={{
          margin: 0,
          fontSize: 34,
          letterSpacing: -1,
        }}
      >
        Conversations with purpose.
      </h2>

      <p
        style={{
          marginTop: 22,
          color: "rgba(246,241,232,.76)",
          lineHeight: 1.8,
          fontSize: 15,
          maxWidth: 620,
        }}
      >
        Andrew Kyamagero is a journalist, broadcaster, public speaker
        and storyteller whose work brings together leadership, business,
        governance, current affairs, personal development and the
        conversations shaping society.
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          marginTop: 25,
        }}
      >
        {[
          "Leadership",
          "Business",
          "Governance",
          "Current Affairs",
          "Personal Growth",
        ].map((topic) => (
          <span
            key={topic}
            style={{
              border: "1px solid rgba(246,241,232,.18)",
              background: "rgba(255,255,255,.06)",
              borderRadius: 999,
              padding: "8px 13px",
              fontSize: 12,
              color: "rgba(246,241,232,.82)",
            }}
          >
            {topic}
          </span>
        ))}
      </div>
    </section>
  );
}