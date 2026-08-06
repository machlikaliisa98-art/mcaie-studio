"use client";

import Link from "next/link";

export default function LandingFooter() {
  return (
    <footer
      style={{
        background: "#102F3B",
        color: "#F6F1E8",
        marginTop: 80,
      }}
    >
      <div
        style={{
          maxWidth: 1450,
          margin: "0 auto",
          padding: "70px 42px 40px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 60,
            marginBottom: 60,
          }}
        >
          {/* BRAND */}

          <div>
            <img
              src="/fohns-logo.png"
              alt="FONS"
              style={{
                width: 190,
                marginBottom: 24,
              }}
            />

            <p
              style={{
                color: "rgba(255,255,255,.72)",
                lineHeight: 1.9,
                fontSize: 16,
                maxWidth: 430,
              }}
            >
              FONS is a global platform for discovering,
              preserving and sharing meaningful conversations.
              Return for Wisdom.
            </p>
          </div>

          {/* PLATFORM */}

          <div>
            <h3
              style={{
                marginBottom: 20,
                fontSize: 18,
              }}
            >
              Platform
            </h3>

            {[
              "Explore",
              "Creators",
              "Collections",
              "Topics",
            ].map((item) => (
              <div
                key={item}
                style={{
                  marginBottom: 14,
                }}
              >
                <Link
                  href="#"
                  style={{
                    color: "rgba(255,255,255,.75)",
                    textDecoration: "none",
                  }}
                >
                  {item}
                </Link>
              </div>
            ))}
          </div>

          {/* CREATORS */}

          <div>
            <h3
              style={{
                marginBottom: 20,
                fontSize: 18,
              }}
            >
              Creators
            </h3>

            {[
              "Creator Studio",
              "Publish",
              "Analytics",
              "Community",
            ].map((item) => (
              <div
                key={item}
                style={{
                  marginBottom: 14,
                }}
              >
                <Link
                  href="#"
                  style={{
                    color: "rgba(255,255,255,.75)",
                    textDecoration: "none",
                  }}
                >
                  {item}
                </Link>
              </div>
            ))}
          </div>

          {/* COMPANY */}

          <div>
            <h3
              style={{
                marginBottom: 20,
                fontSize: 18,
              }}
            >
              Company
            </h3>

            {[
              "About",
              "Careers",
              "Privacy",
              "Terms",
            ].map((item) => (
              <div
                key={item}
                style={{
                  marginBottom: 14,
                }}
              >
                <Link
                  href="#"
                  style={{
                    color: "rgba(255,255,255,.75)",
                    textDecoration: "none",
                  }}
                >
                  {item}
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,.08)",
            paddingTop: 30,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "rgba(255,255,255,.55)",
            fontSize: 14,
          }}
        >
          <div>
            © {new Date().getFullYear()} FONS. All rights reserved.
          </div>

          <div
            style={{
              display: "flex",
              gap: 30,
            }}
          >
            <span>LinkedIn</span>
            <span>X</span>
            <span>YouTube</span>
            <span>GitHub</span>
          </div>
        </div>
      </div>
    </footer>
  );
}