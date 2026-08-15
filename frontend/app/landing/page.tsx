"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Creator = {
  id: number;
  full_name: string;
  username: string;
  creator_category: string;
  country: string;
  verified: boolean;
};

const quickLinks = [
  {
    label: "Explore conversations",
    href: "/search",
    icon: "⌕",
  },
  {
    label: "Browse episodes",
    href: "/episodes",
    icon: "▶",
  },
  {
    label: "Open library",
    href: "/library",
    icon: "▣",
  },
  {
    label: "Listen live",
    href: "/live",
    icon: "◉",
  },
];

export default function LandingPage() {
  const [creator, setCreator] =
    useState<Creator | null>(null);

  useEffect(() => {
    async function loadCreator() {
      try {
        const response = await fetch(
          "/api/creator"
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        if (data) {
          setCreator(data);
        }
      } catch {
        /*
         * Public landing page does not depend
         * on creator discovery being available.
         */
      }
    }

    void loadCreator();
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#F6F1E8",
        color: "#153848",
      }}
    >
      {/* ================================================== */}
      {/* APPLICATION HEADER */}
      {/* ================================================== */}

      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          height: 76,
          background: "rgba(246,241,232,.96)",
          backdropFilter: "blur(18px)",
          borderBottom:
            "1px solid rgba(21,56,72,.08)",
        }}
      >
        <div
          style={{
            height: "100%",
            maxWidth: 1500,
            margin: "0 auto",
            padding: "0 32px",
            display: "flex",
            alignItems: "center",
            gap: 28,
          }}
        >
          <Link
            href="/landing"
            style={{
              display: "flex",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <img
              src="/fons-logo.png"
              alt="FONS"
              style={{
                width: 150,
                height: "auto",
              }}
            />
          </Link>

          <form
            action="/search"
            method="GET"
            style={{
              flex: 1,
              maxWidth: 650,
              height: 46,
              background: "#FFFFFF",
              border:
                "1px solid #E6DDD0",
              borderRadius: 999,
              display: "flex",
              alignItems: "center",
              padding: "0 18px",
              gap: 12,
            }}
          >
            <span
              style={{
                color: "#777",
                fontSize: 18,
              }}
            >
              ⌕
            </span>

            <input
              name="q"
              placeholder="Search FONS..."
              aria-label="Search FONS"
              style={{
                flex: 1,
                minWidth: 0,
                border: "none",
                outline: "none",
                background:
                  "transparent",
                color: "#153848",
                fontSize: 14,
              }}
            />
          </form>

          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Link
              href="/login"
              style={{
                textDecoration: "none",
                color: "#153848",
                fontWeight: 700,
                fontSize: 14,
                padding: "12px 16px",
              }}
            >
              Sign in
            </Link>

            <Link
              href="/register"
              style={{
                textDecoration: "none",
                background: "#153848",
                color: "#FFFFFF",
                borderRadius: 999,
                padding: "13px 22px",
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              Join FONS
            </Link>
          </div>
        </div>
      </header>

      {/* ================================================== */}
      {/* APPLICATION BODY */}
      {/* ================================================== */}

      <div
        style={{
          maxWidth: 1500,
          margin: "0 auto",
          padding: "52px 32px 100px",
        }}
      >
        {/* ================================================== */}
        {/* WELCOME */}
        {/* ================================================== */}

        <section>
          <div
            style={{
              color: "#B48A45",
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: 2.5,
              marginBottom: 12,
            }}
          >
            FONS
          </div>

          <h1
            style={{
              margin: 0,
              fontSize:
                "clamp(38px, 5vw, 68px)",
              lineHeight: 1,
              letterSpacing: "-2px",
              maxWidth: 850,
            }}
          >
            Conversations worth
            returning to.
          </h1>

          <p
            style={{
              marginTop: 20,
              marginBottom: 0,
              maxWidth: 700,
              color: "#666",
              fontSize: 17,
              lineHeight: 1.8,
            }}
          >
            Discover conversations, listen to
            ideas, follow creators and build a
            personal library of knowledge.
          </p>
        </section>

        {/* ================================================== */}
        {/* QUICK ACCESS */}
        {/* ================================================== */}

        <section
          style={{
            marginTop: 46,
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(190px,1fr))",
            gap: 14,
          }}
        >
          {quickLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                textDecoration: "none",
                background: "#FFFFFF",
                border:
                  "1px solid #E6DDD0",
                borderRadius: 20,
                padding: 22,
                minHeight: 120,
                display: "flex",
                flexDirection: "column",
                justifyContent:
                  "space-between",
                color: "#153848",
                boxShadow:
                  "0 10px 30px rgba(0,0,0,.035)",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: "#F6F1E8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                }}
              >
                {item.icon}
              </div>

              <div
                style={{
                  marginTop: 18,
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                {item.label}
              </div>
            </Link>
          ))}
        </section>

        {/* ================================================== */}
        {/* DISCOVERY */}
        {/* ================================================== */}

        <section
          style={{
            marginTop: 70,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "end",
              justifyContent:
                "space-between",
              gap: 20,
              marginBottom: 22,
            }}
          >
            <div>
              <div
                style={{
                  color: "#B48A45",
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: 2,
                }}
              >
                DISCOVER
              </div>

              <h2
                style={{
                  margin:
                    "8px 0 0",
                  fontSize: 32,
                }}
              >
                Find something worth
                your time.
              </h2>
            </div>

            <Link
              href="/search"
              style={{
                color: "#153848",
                fontWeight: 700,
                textDecoration:
                  "none",
                fontSize: 14,
              }}
            >
              Explore all →
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "minmax(0,1.5fr) minmax(280px,.8fr)",
              gap: 18,
            }}
          >
            <Link
              href="/episodes"
              style={{
                textDecoration: "none",
                color: "#FFFFFF",
                background: "#153848",
                borderRadius: 28,
                minHeight: 340,
                padding: 34,
                display: "flex",
                flexDirection: "column",
                justifyContent:
                  "space-between",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  color: "#B48A45",
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: 2,
                }}
              >
                EPISODES
              </div>

              <div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 38,
                    lineHeight: 1.1,
                    maxWidth: 650,
                  }}
                >
                  Explore published
                  conversations.
                </h3>

                <p
                  style={{
                    color:
                      "rgba(255,255,255,.68)",
                    lineHeight: 1.8,
                    maxWidth: 580,
                    marginTop: 18,
                  }}
                >
                  Browse the conversations
                  already preserved on FONS.
                </p>
              </div>

              <div
                style={{
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                Browse episodes →
              </div>
            </Link>

            <Link
              href="/creators/andrew"
              style={{
                textDecoration: "none",
                color: "#153848",
                background: "#FFFFFF",
                border:
                  "1px solid #E6DDD0",
                borderRadius: 28,
                minHeight: 340,
                padding: 30,
                display: "flex",
                flexDirection: "column",
                justifyContent:
                  "space-between",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  color: "#B48A45",
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: 2,
                }}
              >
                CREATORS
              </div>

              <div>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: "#153848",
                    color: "#F6F1E8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                      "center",
                    fontWeight: 800,
                    fontSize: 20,
                  }}
                >
                  AK
                </div>

                <h3
                  style={{
                    margin:
                      "22px 0 8px",
                    fontSize: 27,
                  }}
                >
                  Discover creators
                </h3>

                <p
                  style={{
                    color: "#777",
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  Follow people whose ideas
                  are worth returning to.
                </p>
              </div>

              <div
                style={{
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                View creator →
              </div>
            </Link>
          </div>
        </section>

        {/* ================================================== */}
        {/* LIVE */}
        {/* ================================================== */}

        <section
          style={{
            marginTop: 70,
            background: "#FFFFFF",
            border:
              "1px solid #E6DDD0",
            borderRadius: 28,
            padding: 30,
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",
            gap: 30,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                color: "#B48A45",
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 2,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#B48A45",
                }}
              />
              LIVE
            </div>

            <h2
              style={{
                margin:
                  "10px 0 6px",
                fontSize: 27,
              }}
            >
              Conversations happening now.
            </h2>

            <p
              style={{
                color: "#777",
                margin: 0,
                lineHeight: 1.7,
              }}
            >
              Join live conversations when
              creators open the room.
            </p>
          </div>

          <Link
            href="/live"
            style={{
              textDecoration: "none",
              background: "#153848",
              color: "#FFFFFF",
              padding:
                "14px 24px",
              borderRadius: 999,
              fontWeight: 700,
              fontSize: 14,
              whiteSpace: "nowrap",
            }}
          >
            Open Live
          </Link>
        </section>

        {/* ================================================== */}
        {/* CREATOR ENTRY */}
        {/* ================================================== */}

        <section
          style={{
            marginTop: 70,
            padding:
              "34px 36px",
            borderRadius: 28,
            background:
              "rgba(180,138,69,.10)",
            border:
              "1px solid rgba(180,138,69,.18)",
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",
            gap: 30,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                color: "#B48A45",
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 2,
              }}
            >
              FOR CREATORS
            </div>

            <h2
              style={{
                margin:
                  "9px 0 7px",
                fontSize: 27,
              }}
            >
              Have a conversation worth
              preserving?
            </h2>

            <p
              style={{
                margin: 0,
                color: "#666",
                lineHeight: 1.7,
              }}
            >
              Create your FONS workspace and
              build your audience around ideas.
            </p>
          </div>

          <Link
            href="/register"
            style={{
              textDecoration: "none",
              background: "#153848",
              color: "#FFFFFF",
              padding:
                "15px 25px",
              borderRadius: 999,
              fontWeight: 700,
              fontSize: 14,
              whiteSpace: "nowrap",
            }}
          >
            Join as Creator
          </Link>
        </section>
      </div>
    </main>
  );
}