"use client";

import Link from "next/link";

const navigation = [
  {
    label: "Explore",
    href: "/search",
  },
  {
    label: "Creators",
    href: "/creators/andrew",
  },
  {
    label: "Library",
    href: "/library",
  },
  {
    label: "Episodes",
    href: "/episodes",
  },
  {
    label: "About",
    href: "/landing",
  },
];

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
          gap: 30,
        }}
      >
        {/* ================================================== */}
        {/* LOGO */}
        {/* ================================================== */}

        <Link
          href="/landing"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <img
            src="/fons-logo.png"
            alt="FONS"
            style={{
              width: 190,
              height: "auto",
              display: "block",
              objectFit: "contain",
            }}
          />
        </Link>

        {/* ================================================== */}
        {/* NAVIGATION */}
        {/* ================================================== */}

        <nav
          aria-label="FONS navigation"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 34,
          }}
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                textDecoration: "none",
                color: "#153848",
                fontWeight: 600,
                fontSize: 15,
                transition: "opacity .2s ease",
                whiteSpace: "nowrap",
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* ================================================== */}
        {/* RIGHT SIDE */}
        {/* ================================================== */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexShrink: 0,
          }}
        >
          {/* Search */}

          <Link
            href="/search"
            aria-label="Search FONS"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 48,
              height: 48,
              borderRadius: "50%",
              border: "1px solid #E6DDD0",
              background: "#FFFFFF",
              color: "#153848",
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            ⌕
          </Link>

          {/* Sign In */}

          <Link
            href="/login"
            style={{
              textDecoration: "none",
            }}
          >
            <span
              style={{
                display: "inline-block",
                background: "transparent",
                color: "#153848",
                fontWeight: 700,
                fontSize: 15,
                padding: "14px 8px",
                whiteSpace: "nowrap",
              }}
            >
              Sign In
            </span>
          </Link>

          {/* Become Creator */}

          <Link
            href="/register"
            style={{
              textDecoration: "none",
            }}
          >
            <span
              style={{
                display: "inline-block",
                background: "#153848",
                color: "#FFFFFF",
                borderRadius: 999,
                padding: "14px 28px",
                fontWeight: 700,
                fontSize: 15,
                boxShadow: "0 10px 30px rgba(21,56,72,.18)",
                whiteSpace: "nowrap",
              }}
            >
              Become a Creator
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}