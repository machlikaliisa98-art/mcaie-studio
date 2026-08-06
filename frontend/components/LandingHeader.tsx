"use client";

import Link from "next/link";

export default function LandingHeader() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(246,241,232,.96)",
        backdropFilter: "blur(18px)",
        borderBottom: "1px solid rgba(21,56,72,.08)",
      }}
    >
      <div
        style={{
          maxWidth: 1450,
          margin: "0 auto",
          padding: "18px 42px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* LOGO */}

        <Link
          href="/landing"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            src="/fohns-logo.png"
            alt="FONS"
            style={{
              width: 190,
              height: "auto",
              display: "block",
              objectFit: "contain",
            }}
          />
        </Link>

        {/* NAVIGATION */}

        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: 38,
          }}
        >
          {[
            "Explore",
            "Creators",
            "Collections",
            "Topics",
            "About",
          ].map((item) => (
            <a
              key={item}
              href="#"
              style={{
                textDecoration: "none",
                color: "#153848",
                fontWeight: 600,
                fontSize: 15,
                transition: ".2s",
              }}
            >
              {item}
            </a>
          ))}
        </nav>

        {/* RIGHT SIDE */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <button
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              border: "1px solid #E6DDD0",
              background: "#FFFFFF",
              cursor: "pointer",
              fontSize: 18,
            }}
          >
            🔍
          </button>

          <Link
            href="/login"
            style={{
              textDecoration: "none",
            }}
          >
            <button
              style={{
                background: "transparent",
                color: "#153848",
                border: "none",
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer",
                padding: "14px 8px",
              }}
            >
              Sign In
            </button>
          </Link>

          <Link
            href="/register"
            style={{
              textDecoration: "none",
            }}
          >
            <button
              style={{
                background: "#153848",
                color: "#FFFFFF",
                border: "none",
                borderRadius: 999,
                padding: "14px 28px",
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer",
                boxShadow: "0 10px 30px rgba(21,56,72,.18)",
              }}
            >
              Become a Creator
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}