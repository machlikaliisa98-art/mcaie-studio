"use client";

import Image from "next/image";

export default function ManCaveUGPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#081426",
        color: "#FFFFFF",
      }}
    >
      {/* HERO */}

      <section
        style={{
          background:
            "linear-gradient(135deg,#081426 0%,#0B1E3D 35%,#113B73 100%)",
          padding: "70px 70px 90px",
        }}
      >
        <div
          style={{
            maxWidth: 1450,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "220px 1fr",
            gap: 45,
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 220,
              height: 220,
              borderRadius: 30,
              background: "#FFFFFF",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              src="/mancave-ug-logo.png"
              alt="Man Cave UG"
              width={170}
              height={170}
            />
          </div>

          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                background: "rgba(255,255,255,.08)",
                padding: "10px 18px",
                borderRadius: 999,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#FF3B30",
                }}
              />

              LIVE STUDIO
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: 72,
                fontWeight: 700,
              }}
            >
              Man Cave UG
            </h1>

            <p
              style={{
                marginTop: 25,
                maxWidth: 850,
                lineHeight: 1.9,
                color: "#D5E2F2",
                fontSize: 19,
              }}
            >
              Long-form conversations, live X Spaces,
              interviews and discussions professionally
              engineered into timeless knowledge.
            </p>

            <div
              style={{
                display: "flex",
                gap: 18,
                marginTop: 35,
              }}
            >
              <button
                style={{
                  background: "#1E4E9A",
                  color: "#FFFFFF",
                  border: "none",
                  padding: "18px 34px",
                  borderRadius: 999,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Watch Live
              </button>

              <button
                style={{
                  background: "transparent",
                  color: "#FFFFFF",
                  border: "1px solid rgba(255,255,255,.25)",
                  padding: "18px 34px",
                  borderRadius: 999,
                  cursor: "pointer",
                }}
              >
                Follow Show
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED */}

      <section
        style={{
          maxWidth: 1450,
          margin: "60px auto",
          padding: "0 40px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: 30,
          }}
        >
          <div
            style={{
              background: "#0F223F",
              borderRadius: 30,
              padding: 35,
            }}
          >
            <div
              style={{
                color: "#4DB7A8",
                fontWeight: 700,
                marginBottom: 12,
              }}
            >
              FEATURED CONVERSATION
            </div>

            <h2
              style={{
                marginTop: 0,
                fontSize: 40,
              }}
            >
              The Future of Africa
            </h2>

            <p
              style={{
                color: "#C8D7E8",
                lineHeight: 1.8,
              }}
            >
              4 Hours 12 Minutes
            </p>

            <button
              style={{
                marginTop: 30,
                background: "#1E4E9A",
                color: "#FFFFFF",
                border: "none",
                padding: "16px 28px",
                borderRadius: 999,
              }}
            >
              Continue Listening
            </button>
          </div>

          <div
            style={{
              background: "#10294A",
              borderRadius: 30,
              padding: 30,
            }}
          >
            <h3>Guests</h3>

            <div style={{ marginTop: 20 }}>Andrew Kyamagero</div>
            <div style={{ marginTop: 14 }}>Guest 1</div>
            <div style={{ marginTop: 14 }}>Guest 2</div>
            <div style={{ marginTop: 14 }}>Guest 3</div>
          </div>
        </div>
      </section>

      {/* EPISODES */}

      <section
        style={{
          maxWidth: 1450,
          margin: "0 auto 80px",
          padding: "0 40px",
        }}
      >
        <h2
          style={{
            fontSize: 42,
            marginBottom: 35,
          }}
        >
          Split Episodes
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2,1fr)",
            gap: 24,
          }}
        >
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              style={{
                background: "#10294A",
                borderRadius: 24,
                padding: 28,
              }}
            >
              <div
                style={{
                  color: "#4DB7A8",
                  fontWeight: 700,
                }}
              >
                Episode {index + 1}
              </div>

              <h3
                style={{
                  marginTop: 14,
                }}
              >
                The Future of Africa
              </h3>

              <p
                style={{
                  color: "#D0D9E4",
                }}
              >
                20 Minutes
              </p>

              <button
                style={{
                  marginTop: 20,
                  background: "#1E4E9A",
                  border: "none",
                  color: "#FFFFFF",
                  padding: "14px 24px",
                  borderRadius: 999,
                }}
              >
                Listen
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}