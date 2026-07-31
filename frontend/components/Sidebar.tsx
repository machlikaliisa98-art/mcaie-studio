"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { title: "Dashboard", href: "/" },
  { title: "Upload Studio", href: "/studio" },
  { title: "Projects", href: "/projects" },
  { title: "Episodes", href: "/episodes" },
  { title: "Library", href: "/library" },
  { title: "Semantic Search", href: "/search" },
  { title: "Analytics", href: "/analytics" },
  { title: "Live Studio", href: "/live" },
  { title: "Settings", href: "/settings" },
];

export default function Sidebar() {

  const pathname = usePathname();

  return (

    <aside
      style={{
        width: 285,
        minWidth: 285,
        background: "#0D1B2A",
        borderRight: "1px solid rgba(255,255,255,.06)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 24,
      }}
    >

      <div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 40,
          }}
        >

          <img
            src="/Mancave.jpeg"
            alt="Man Cave UG"
            style={{
              width: 110,
              height: 110,
              borderRadius: 24,
              objectFit: "cover",
              background: "#fff",
              padding: 6,
            }}
          />

          <h2
            style={{
              color: "#fff",
              marginTop: 18,
              marginBottom: 4,
            }}
          >
            Man Cave UG
          </h2>

          <div
            style={{
              color: "#9FB5CC",
              fontSize: 13,
            }}
          >
            Powered by MCAIE
          </div>

        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >

          {items.map((item) => {

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
                    padding: "15px 18px",
                    borderRadius: 16,
                    background: active
                      ? "#2E6EA6"
                      : "transparent",
                    color: "#FFFFFF",
                    fontWeight: 700,
                    transition: ".25s",
                    cursor: "pointer",
                  }}
                >

                  {item.title}

                </div>

              </Link>

            );

          })}

        </div>

      </div>

      <div
        style={{
          background: "#13263D",
          borderRadius: 18,
          padding: 18,
        }}
      >

        <div
          style={{
            color: "#FFFFFF",
            fontWeight: 700,
            marginBottom: 6,
          }}
        >
          MCAIE Studio
        </div>

        <div
          style={{
            color: "#AFC2D8",
            fontSize: 13,
            marginBottom: 16,
          }}
        >
          Professional AI Audio Production
        </div>

        <div
          style={{
            height: 8,
            borderRadius: 99,
            background: "#20364D",
            overflow: "hidden",
          }}
        >

          <div
            style={{
              width: "42%",
              height: "100%",
              background: "#4FA3D9",
            }}
          />

        </div>

        <div
          style={{
            marginTop: 10,
            color: "#AFC2D8",
            fontSize: 12,
          }}
        >
          Storage 42%
        </div>

      </div>

    </aside>

  );

}