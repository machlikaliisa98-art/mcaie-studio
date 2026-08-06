"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header
      style={{
        background: "#F6F1E8",
        padding: "28px 48px 22px",
        borderBottom: "1px solid #E7DED2",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 30,
        }}
      >
        {/* LEFT */}

        <div
          style={{
            flex: 1,
            maxWidth: 720,
          }}
        >
          <div
            style={{
              color: "#B48A45",
              fontWeight: 700,
              letterSpacing: 2,
              fontSize: 12,
              marginBottom: 8,
            }}
          >
            WELCOME BACK
          </div>

          <h1
            style={{
              margin: 0,
              color: "#153848",
              fontSize: 34,
              fontWeight: 700,
            }}
          >
            Good Evening, Andrew.
          </h1>

          <div
            style={{
              marginTop: 22,
              background: "#FFFFFF",
              borderRadius: 999,
              border: "1px solid #E6DDD0",
              display: "flex",
              alignItems: "center",
              padding: "8px 8px 8px 22px",
              boxShadow: "0 10px 30px rgba(0,0,0,.04)",
            }}
          >
            <span
              style={{
                fontSize: 20,
                marginRight: 16,
              }}
            >
              🔍
            </span>

            <input
              placeholder="Search conversations, creators, episodes..."
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                background: "transparent",
                color: "#153848",
                fontSize: 16,
              }}
            />

            <div
              style={{
                background: "#F4EFE7",
                padding: "10px 16px",
                borderRadius: 999,
                color: "#777",
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              Ctrl + K
            </div>
          </div>
        </div>

        {/* RIGHT */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <button
            style={{
              width: 54,
              height: 54,
              borderRadius: "50%",
              border: "1px solid #E7DED2",
              background: "#FFFFFF",
              cursor: "pointer",
              fontSize: 20,
            }}
          >
            🔔
          </button>

          <button
            style={{
              width: 54,
              height: 54,
              borderRadius: "50%",
              border: "1px solid #E7DED2",
              background: "#FFFFFF",
              cursor: "pointer",
              fontSize: 20,
            }}
          >
            ✉️
          </button>

          <Link
            href="/studio"
            style={{
              textDecoration: "none",
            }}
          >
            <button
              style={{
                background: "#153848",
                color: "#FFFFFF",
                border: "none",
                padding: "16px 28px",
                borderRadius: 999,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              + New Production
            </button>
          </Link>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              background: "#FFFFFF",
              border: "1px solid #E7DED2",
              borderRadius: 999,
              padding: "8px 10px 8px 8px",
              cursor: "pointer",
              boxShadow: "0 8px 24px rgba(0,0,0,.04)",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "#D9D9D9",
                overflow: "hidden",
              }}
            >
              {/* Uploaded profile photo */}
            </div>

            <div>
              <div
                style={{
                  color: "#153848",
                  fontWeight: 700,
                  fontSize: 15,
                }}
              >
                Andrew Kyamagero
              </div>

              <div
                style={{
                  color: "#8B8B8B",
                  fontSize: 12,
                }}
              >
                Creator
              </div>
            </div>

            <div
              style={{
                fontSize: 18,
                color: "#777",
                padding: "0 6px",
              }}
            >
              ▼
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}