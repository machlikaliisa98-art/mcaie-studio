"use client";

export default function FeaturedConversations() {
  return (
    <section
      style={{
        maxWidth: 1450,
        margin: "0 auto",
        padding: "0 42px 90px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 42,
        }}
      >
        <div>
          <div
            style={{
              color: "#B48A45",
              fontSize: 13,
              letterSpacing: 3,
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            DISCOVER
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: 48,
              color: "#153848",
            }}
          >
            Conversations Worth Returning To
          </h2>

          <p
            style={{
              marginTop: 14,
              color: "#6A6A6A",
              fontSize: 18,
              lineHeight: 1.8,
              maxWidth: 650,
            }}
          >
            Explore ideas, stories, interviews and discussions from
            creators around the world.
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
          Browse Library
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 30,
        }}
      >
        {/* Featured Conversation */}

        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 34,
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,.06)",
          }}
        >
          <div
            style={{
              height: 340,
              background:
                "linear-gradient(135deg,#123848,#20546A)",
            }}
          />

          <div
            style={{
              padding: 36,
            }}
          >
            <div
              style={{
                color: "#B48A45",
                fontWeight: 700,
                letterSpacing: 2,
                marginBottom: 12,
              }}
            >
              FEATURED
            </div>

            <h3
              style={{
                margin: 0,
                fontSize: 36,
                color: "#153848",
              }}
            >
              Conversations that change perspectives.
            </h3>

            <p
              style={{
                marginTop: 20,
                color: "#666",
                lineHeight: 1.9,
                fontSize: 17,
              }}
            >
              Discover conversations across business,
              entrepreneurship, science, technology,
              philosophy, leadership, health,
              education, politics, culture, history,
              creativity, sports and every subject
              worth exploring.
            </p>

            <button
              style={{
                marginTop: 30,
                background: "#153848",
                color: "#FFFFFF",
                border: "none",
                borderRadius: 999,
                padding: "16px 28px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Start Listening
            </button>
          </div>
        </div>

        {/* Side Cards */}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              style={{
                background: "#FFFFFF",
                borderRadius: 26,
                padding: 24,
                boxShadow: "0 15px 40px rgba(0,0,0,.05)",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: 120,
                  borderRadius: 18,
                  background:
                    "linear-gradient(135deg,#204F64,#153848)",
                  marginBottom: 18,
                }}
              />

              <div
                style={{
                  color: "#153848",
                  fontSize: 19,
                  fontWeight: 700,
                }}
              >
                Featured Conversation
              </div>

              <div
                style={{
                  marginTop: 12,
                  color: "#666",
                  lineHeight: 1.8,
                }}
              >
                Explore inspiring conversations from verified creators.
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}