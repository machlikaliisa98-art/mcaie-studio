"use client";

import Link from "next/link";

export default function BecomeCreator() {
  return (
    <section
      style={{
        maxWidth: 1450,
        margin: "0 auto",
        padding: "0 42px 120px",
      }}
    >
      <div
        style={{
          background: "#153848",
          borderRadius: 42,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -120,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "rgba(255,255,255,.05)",
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: -120,
            left: -80,
            width: 280,
            height: 280,
            borderRadius: "50%",
            background: "rgba(180,138,69,.12)",
          }}
        />

        <div
          style={{
            position: "relative",
            padding: "80px",
            display: "grid",
            gridTemplateColumns: "1.2fr .8fr",
            gap: 60,
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                color: "#B48A45",
                fontSize: 13,
                letterSpacing: 3,
                fontWeight: 700,
                marginBottom: 18,
              }}
            >
              CREATE • PRESERVE • INSPIRE
            </div>

            <h2
              style={{
                margin: 0,
                fontSize: 60,
                lineHeight: 1.1,
                color: "#FFFFFF",
              }}
            >
              Build your community around conversations that matter.
            </h2>

            <p
              style={{
                marginTop: 30,
                color: "rgba(255,255,255,.82)",
                fontSize: 19,
                lineHeight: 1.9,
                maxWidth: 720,
              }}
            >
              Publish conversations, organize knowledge, engage your
              audience, grow your community and preserve ideas for
              generations with AI-powered creator tools.
            </p>

            <div
              style={{
                display: "flex",
                gap: 18,
                marginTop: 42,
              }}
            >
              <Link
                href="/register"
                style={{
                  textDecoration: "none",
                }}
              >
                <button
                  style={{
                    background: "#B48A45",
                    color: "#153848",
                    border: "none",
                    borderRadius: 999,
                    padding: "18px 34px",
                    fontWeight: 700,
                    fontSize: 16,
                    cursor: "pointer",
                  }}
                >
                  Become a Creator
                </button>
              </Link>

              <Link
                href="/explore"
                style={{
                  textDecoration: "none",
                }}
              >
                <button
                  style={{
                    background: "transparent",
                    color: "#FFFFFF",
                    border: "1px solid rgba(255,255,255,.18)",
                    borderRadius: 999,
                    padding: "18px 34px",
                    fontWeight: 700,
                    fontSize: 16,
                    cursor: "pointer",
                  }}
                >
                  Explore FONS
                </button>
              </Link>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <img
              src="/fohns-logo.png"
              alt="FONS"
              style={{
                width: 320,
                maxWidth: "100%",
                opacity: .95,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}