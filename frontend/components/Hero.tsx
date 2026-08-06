"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section
      style={{
        maxWidth: 1450,
        margin: "0 auto",
        padding: "90px 42px 100px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr .9fr",
          gap: 70,
          alignItems: "center",
        }}
      >
        {/* LEFT */}

        <div>
          <div
            style={{
              color: "#B48A45",
              letterSpacing: 4,
              fontWeight: 700,
              fontSize: 13,
              marginBottom: 22,
              textTransform: "uppercase",
            }}
          >
            RETURN FOR WISDOM
          </div>

          <h1
            style={{
              fontSize: 82,
              lineHeight: 1,
              margin: 0,
              color: "#153848",
              fontWeight: 700,
              maxWidth: 760,
            }}
          >
            Every conversation
            <br />
            deserves to live
            <br />
            forever.
          </h1>

          <p
            style={{
              marginTop: 36,
              fontSize: 21,
              lineHeight: 1.9,
              color: "#666",
              maxWidth: 720,
            }}
          >
            FONS is where creators preserve knowledge, publish meaningful
            conversations and build communities around ideas that matter.
          </p>

          <div
            style={{
              display: "flex",
              gap: 20,
              marginTop: 48,
            }}
          >
            <Link
              href="/explore"
              style={{ textDecoration: "none" }}
            >
              <button
                style={{
                  background: "#153848",
                  color: "#FFFFFF",
                  border: "none",
                  padding: "18px 34px",
                  borderRadius: 999,
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Explore Conversations
              </button>
            </Link>

            <Link
              href="/register"
              style={{ textDecoration: "none" }}
            >
              <button
                style={{
                  background: "#FFFFFF",
                  color: "#153848",
                  border: "1px solid #DDD2C5",
                  padding: "18px 34px",
                  borderRadius: 999,
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Become a Creator
              </button>
            </Link>
          </div>

          <div
            style={{
              marginTop: 60,
              background: "#FFFFFF",
              borderRadius: 999,
              padding: "12px",
              display: "flex",
              alignItems: "center",
              boxShadow: "0 15px 45px rgba(0,0,0,.06)",
            }}
          >
            <input
              placeholder="Search creators, conversations, episodes, collections..."
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                background: "transparent",
                padding: "18px 24px",
                fontSize: 17,
                color: "#153848",
              }}
            />

            <button
              style={{
                background: "#153848",
                color: "#FFFFFF",
                border: "none",
                borderRadius: 999,
                padding: "18px 34px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Search
            </button>
          </div>
        </div>

        {/* RIGHT */}

        <div
          style={{
            position: "relative",
            height: 760,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 42,
              background:
                "linear-gradient(160deg,#123848,#1F5268)",
              boxShadow: "0 40px 100px rgba(0,0,0,.18)",
            }}
          />

          <div
            style={{
              position: "absolute",
              top: 40,
              left: 40,
              right: 40,
              background: "#FFFFFF",
              borderRadius: 28,
              padding: 26,
              boxShadow: "0 20px 50px rgba(0,0,0,.10)",
            }}
          >
            <div
              style={{
                fontWeight: 700,
                color: "#153848",
                fontSize: 22,
                marginBottom: 14,
              }}
            >
              Conversations Worth Returning To
            </div>

            <div
              style={{
                color: "#666",
                lineHeight: 1.8,
              }}
            >
              Timeless conversations, intelligent search,
              AI-powered knowledge, and creators building
              communities around ideas.
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              bottom: 40,
              right: 40,
              width: 280,
              background: "#FFFFFF",
              borderRadius: 24,
              padding: 24,
              boxShadow: "0 18px 40px rgba(0,0,0,.10)",
            }}
          >
            <div
              style={{
                fontSize: 48,
                fontWeight: 700,
                color: "#153848",
              }}
            >
              120K+
            </div>

            <div
              style={{
                marginTop: 10,
                color: "#666",
                lineHeight: 1.7,
              }}
            >
              Hours of conversations preserved through FONS.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}