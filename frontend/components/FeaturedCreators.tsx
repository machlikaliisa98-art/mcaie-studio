"use client";

export default function FeaturedCreators() {
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
            FEATURED CREATORS
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: 48,
              color: "#153848",
            }}
          >
            Meet remarkable voices
          </h2>

          <p
            style={{
              marginTop: 14,
              color: "#666",
              fontSize: 18,
              lineHeight: 1.8,
              maxWidth: 700,
            }}
          >
            Discover creators building communities through meaningful
            conversations, insightful stories and timeless knowledge.
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
          View All Creators
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 28,
        }}
      >
        {[1, 2, 3, 4].map((creator) => (
          <div
            key={creator}
            style={{
              background: "#FFFFFF",
              borderRadius: 30,
              overflow: "hidden",
              boxShadow: "0 18px 45px rgba(0,0,0,.05)",
              transition: ".25s",
              cursor: "pointer",
            }}
          >
            {/* Cover */}

            <div
              style={{
                height: 140,
                background:
                  "linear-gradient(135deg,#153848,#275D73)",
              }}
            />

            {/* Avatar */}

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: -52,
              }}
            >
              <div
                style={{
                  width: 104,
                  height: 104,
                  borderRadius: "50%",
                  background: "#F6F1E8",
                  border: "6px solid #FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 34,
                  fontWeight: 700,
                  color: "#153848",
                }}
              >
                AK
              </div>
            </div>

            <div
              style={{
                padding: "26px 26px 34px",
                textAlign: "center",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  color: "#153848",
                  fontSize: 24,
                }}
              >
                Andrew Kyamagero
              </h3>

              <div
                style={{
                  marginTop: 8,
                  color: "#B48A45",
                  fontWeight: 700,
                  letterSpacing: 1,
                  fontSize: 13,
                  textTransform: "uppercase",
                }}
              >
                Verified Creator
              </div>

              <p
                style={{
                  marginTop: 18,
                  color: "#666",
                  lineHeight: 1.8,
                  fontSize: 15,
                }}
              >
                Creator of Man Cave UG and conversations that inspire
                thoughtful discussion and lifelong learning.
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  marginTop: 28,
                  paddingTop: 22,
                  borderTop: "1px solid #ECE6DB",
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 20,
                      color: "#153848",
                    }}
                  >
                    124
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      color: "#777",
                    }}
                  >
                    Episodes
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 20,
                      color: "#153848",
                    }}
                  >
                    48K
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      color: "#777",
                    }}
                  >
                    Followers
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 20,
                      color: "#153848",
                    }}
                  >
                    5.0
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      color: "#777",
                    }}
                  >
                    Rating
                  </div>
                </div>
              </div>

              <button
                style={{
                  width: "100%",
                  marginTop: 26,
                  padding: "16px",
                  borderRadius: 999,
                  background: "#153848",
                  color: "#FFFFFF",
                  border: "none",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                View Creator
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}