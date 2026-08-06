"use client";

import Link from "next/link";

export default function CreatorPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#F6F1E8",
      }}
    >
      {/* Cover */}

      <div
        style={{
          height: 340,
          background:
            "linear-gradient(135deg,#153848 0%, #204F61 100%)",
          position: "relative",
        }}
      >
        <img
          src="/fons-logo.png"
          alt="FONS"
          style={{
            position: "absolute",
            top: 40,
            left: 50,
            width: 170,
          }}
        />
      </div>

      {/* Profile */}

      <section
        style={{
          maxWidth: 1400,
          margin: "-90px auto 0",
          padding: "0 40px 60px",
        }}
      >
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 34,
            padding: 40,
            boxShadow: "0 18px 45px rgba(0,0,0,.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 30,
            }}
          >
            <div
              style={{
                width: 150,
                height: 150,
                borderRadius: "50%",
                background: "#D8D8D8",
                border: "6px solid white",
              }}
            />

            <div style={{ flex: 1 }}>
              <h1
                style={{
                  margin: 0,
                  color: "#153848",
                  fontSize: 52,
                }}
              >
                Andrew Kyamagero ✓
              </h1>

              <p
                style={{
                  marginTop: 14,
                  color: "#666",
                  fontSize: 18,
                  lineHeight: 1.8,
                  maxWidth: 760,
                }}
              >
                Journalist • Broadcaster • Public Speaker •
                Storyteller dedicated to conversations that inform,
                inspire and challenge perspectives.
              </p>

              <div
                style={{
                  display: "flex",
                  gap: 30,
                  marginTop: 26,
                  color: "#153848",
                  fontWeight: 700,
                }}
              >
                <span>2 Shows</span>
                <span>125 Conversations</span>
                <span>14.2K Followers</span>
              </div>
            </div>

            <button
              style={{
                background: "#153848",
                color: "#FFFFFF",
                border: "none",
                borderRadius: 999,
                padding: "18px 32px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Follow
            </button>
          </div>
        </div>

        {/* Shows */}

        <section
          style={{
            marginTop: 50,
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
            SHOWS
          </div>

          <h2
            style={{
              margin: 0,
              color: "#153848",
              fontSize: 42,
            }}
          >
            Explore Andrew's Shows
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 30,
              marginTop: 35,
            }}
          >
            {/* Kyamagero Daily */}

            <Link
              href="/shows/kyamagero-daily"
              style={{
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: 30,
                  overflow: "hidden",
                  boxShadow: "0 14px 40px rgba(0,0,0,.05)",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    height: 220,
                    background: "#204F61",
                  }}
                />

                <div
                  style={{
                    padding: 30,
                  }}
                >
                  <h3
                    style={{
                      marginTop: 0,
                      color: "#153848",
                      fontSize: 32,
                    }}
                  >
                    Kyamagero Daily
                  </h3>

                  <p
                    style={{
                      color: "#666",
                      lineHeight: 1.8,
                    }}
                  >
                    Daily reflections on leadership, business,
                    governance, current affairs and personal growth.
                  </p>

                  <button
                    style={{
                      marginTop: 22,
                      background: "#153848",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: 999,
                      padding: "16px 26px",
                      fontWeight: 700,
                    }}
                  >
                    Enter Show
                  </button>
                </div>
              </div>
            </Link>

            {/* Man Cave */}

            <Link
              href="/shows/man-cave-ug"
              style={{
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: 30,
                  overflow: "hidden",
                  boxShadow: "0 14px 40px rgba(0,0,0,.05)",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    height: 220,
                    background: "#153848",
                  }}
                />

                <div
                  style={{
                    padding: 30,
                  }}
                >
                  <h3
                    style={{
                      marginTop: 0,
                      color: "#153848",
                      fontSize: 32,
                    }}
                  >
                    Man Cave UG
                  </h3>

                  <p
                    style={{
                      color: "#666",
                      lineHeight: 1.8,
                    }}
                  >
                    Long-form conversations, X Spaces,
                    interviews and thought-provoking discussions.
                  </p>

                  <button
                    style={{
                      marginTop: 22,
                      background: "#153848",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: 999,
                      padding: "16px 26px",
                      fontWeight: 700,
                    }}
                  >
                    Enter Show
                  </button>
                </div>
              </div>
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}