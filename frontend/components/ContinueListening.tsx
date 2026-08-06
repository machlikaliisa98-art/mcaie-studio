"use client";

export default function ContinueListening() {
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
              fontWeight: 700,
              letterSpacing: 3,
              fontSize: 13,
              marginBottom: 12,
            }}
          >
            CONTINUE LISTENING
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: 48,
              color: "#153848",
            }}
          >
            Pick up where you left off
          </h2>

          <p
            style={{
              marginTop: 14,
              color: "#666",
              fontSize: 18,
              lineHeight: 1.8,
              maxWidth: 720,
            }}
          >
            Your recent conversations, saved episodes and unfinished
            discussions are always waiting for you.
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
          Open Library
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 28,
        }}
      >
        {[1, 2, 3].map((episode) => (
          <div
            key={episode}
            style={{
              background: "#FFFFFF",
              borderRadius: 28,
              overflow: "hidden",
              boxShadow: "0 18px 45px rgba(0,0,0,.05)",
            }}
          >
            <div
              style={{
                height: 210,
                background:
                  "linear-gradient(135deg,#173B4A,#2D6278)",
              }}
            />

            <div
              style={{
                padding: 28,
              }}
            >
              <div
                style={{
                  color: "#B48A45",
                  fontWeight: 700,
                  fontSize: 12,
                  letterSpacing: 2,
                  marginBottom: 12,
                }}
              >
                CONTINUE
              </div>

              <h3
                style={{
                  margin: 0,
                  color: "#153848",
                  fontSize: 28,
                  lineHeight: 1.3,
                }}
              >
                Every conversation leaves a mark.
              </h3>

              <p
                style={{
                  marginTop: 18,
                  color: "#666",
                  lineHeight: 1.8,
                }}
              >
                Resume listening exactly where you stopped across all
                your devices.
              </p>

              <div
                style={{
                  marginTop: 28,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 10,
                    color: "#666",
                    fontSize: 14,
                  }}
                >
                  <span>Progress</span>

                  <span>62%</span>
                </div>

                <div
                  style={{
                    height: 8,
                    background: "#ECE6DB",
                    borderRadius: 999,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: "62%",
                      height: "100%",
                      background: "#B48A45",
                    }}
                  />
                </div>
              </div>

              <button
                style={{
                  marginTop: 28,
                  width: "100%",
                  background: "#153848",
                  color: "#FFFFFF",
                  border: "none",
                  padding: "16px",
                  borderRadius: 999,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Continue Listening
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}