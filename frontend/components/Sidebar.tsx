"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
  { title: "Home", href: "/dashboard", icon: "⌂" },
  { title: "Explore", href: "/explore", icon: "◈" },
  { title: "Creator Studio", href: "/studio", icon: "◉" },
  { title: "Conversations", href: "/conversations", icon: "◌" },
  { title: "Episodes", href: "/episodes", icon: "▶" },
  { title: "Collections", href: "/collections", icon: "▣" },
  { title: "Audience", href: "/audience", icon: "◍" },
  { title: "Analytics", href: "/analytics", icon: "◔" },
  { title: "Notifications", href: "/notifications", icon: "🔔" },
  { title: "Messages", href: "/messages", icon: "✉" },
  { title: "Profile", href: "/profile", icon: "☺" },
  { title: "Settings", href: "/settings", icon: "⚙" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: 320,
        minWidth: 320,
        background: "#153848",
        color: "#F6F1E8",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      {/* ===================================================== */}
      {/* Logo */}
      {/* ===================================================== */}

      <div
        style={{
          height: 165,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "18px 18px 14px",
          borderBottom: "1px solid rgba(255,255,255,.08)",
          flexShrink: 0,
        }}
      >
        <img
          src="/fons-logo.png"
          alt="FONS"
          style={{
            width: 285,
            maxWidth: "100%",
            height: "auto",
            display: "block",
            objectFit: "contain",
          }}
        />
      </div>

      {/* ===================================================== */}
      {/* Navigation */}
      {/* ===================================================== */}

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "18px 16px",
        }}
      >
        {menu.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  marginBottom: 8,
                  padding: "15px 18px",
                  borderRadius: 18,
                  background: active ? "#F6F1E8" : "transparent",
                  color: active ? "#153848" : "#F6F1E8",
                  transition: ".2s",
                  fontWeight: active ? 700 : 500,
                }}
              >
                <span
                  style={{
                    width: 24,
                    textAlign: "center",
                    fontSize: 18,
                  }}
                >
                  {item.icon}
                </span>

                <span>{item.title}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ===================================================== */}
      {/* User */}
      {/* ===================================================== */}

      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,.08)",
          padding: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 22,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "#F6F1E8",
              overflow: "hidden",
              flexShrink: 0,
            }}
          />

          <div>
            <div
              style={{
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              Andrew Kyamagero
            </div>

            <div
              style={{
                color: "rgba(246,241,232,.70)",
                fontSize: 13,
              }}
            >
              Verified Creator
            </div>
          </div>
        </div>

        <button
          style={{
            width: "100%",
            background: "#B48A45",
            color: "#153848",
            border: "none",
            padding: "15px",
            borderRadius: 16,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </aside>
  );
}