"use client";

export default function TrendingCollections() {
  return (
    <section
      style={{
        maxWidth: 1450,
        margin: "0 auto",
        padding: "0 42px 100px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "end",
          marginBottom: 40,
        }}
      >
        <div>
          <div
            style={{
              color: "#B48A45",
              letterSpacing: 3,
              fontWeight: 700,
              fontSize: 13,
              marginBottom: 12,
            }}
          >
            COLLECTIONS
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: 48,
              color: "#153848",
            }}
          >
            Explore curated knowledge
          </h2>

          <p
            style={{
              marginTop: 14,
              fontSize: 18,
              color: "#666",
              lineHeight: 1.8,
              maxWidth: 700,
            }}
          >
            Collections bring together conversations around a common
            idea, helping you learn deeply instead of consuming content
            randomly.
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
          View Collections
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 28,
        }}
      >
        {[
          "Leadership",
          "Technology",
          "Business",
          "Philosophy",
          "Health",
          "History",
          "Science",
          "Creativity",
        ].map((topic) => (
          <div
            key={topic}
            style={{
              background: "#FFFFFF",
              borderRadius: 28,
              overflow: "hidden",
              boxShadow: "0 18px 45px rgba(0,0,0,.05)",
              cursor: "pointer",
              transition: ".25s",
            }}
          >
            <div
              style={{
                height: 180,
                background:
                  "linear-gradient(135deg,#123848,#245B71)",
              }}
            />

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
                  marginBottom: 12,
                }}
              >
                COLLECTION
              </div>

              <h3
                style={{
                  margin: 0,
                  fontSize: 28,
                  color: "#153848",
                }}
              >
                {topic}
              </h3>

              <p
                style={{
                  marginTop: 16,
                  color: "#666",
                  lineHeight: 1.8,
                  fontSize: 15,
                }}
              >
                Curated conversations designed to help you explore
                {` ${topic.toLowerCase()} `} from multiple perspectives.
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 28,
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
                    142
                  </div>

                  <div
                    style={{
                      color: "#777",
                      fontSize: 12,
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
                    padding: "12px 20px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Explore
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}