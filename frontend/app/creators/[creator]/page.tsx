"use client";

import Link from "next/link";
import Image from "next/image";
import CreatorAbout from "@/components/creator/CreatorAbout";
import CreatorCollections from "@/components/creator/CreatorCollections";

const shows = [
  {
    id: "kyamagero-daily",
    name: "Kyamagero Daily",
    description:
      "Daily conversations on leadership, business, governance, current affairs, personal growth and the ideas shaping our world.",
    logo: "/kd-logo.png",
    href: "/shows/kyamagero-daily",
    episodes: "Daily",
  },
  {
    id: "man-cave-ug",
    name: "Man Cave UG",
    description:
      "Long-form conversations, X Spaces, interviews, debates and thought-provoking discussions from Uganda and beyond.",
    logo: "/mancave-ug-logo.png",
    href: "/shows/man-cave-ug",
    episodes: "Conversations",
  },
];

const recentEpisodes = [
  {
    id: "kyamagero-daily",
    title: "Kyamagero Daily",
    subtitle: "Leadership, ideas and the conversations shaping our time",
    show: "Kyamagero Daily",
    date: "Latest episode",
    duration: "14 min",
    href: "/shows/kyamagero-daily",
    image: "/kd-logo.png",
  },
  {
    id: "man-cave-ug",
    title: "Man Cave UG",
    subtitle: "Long-form conversations and perspectives",
    show: "Man Cave UG",
    date: "Latest conversation",
    duration: "Conversation",
    href: "/shows/man-cave-ug",
    image: "/mancave-ug-logo.png",
  },
];

export default function CreatorPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#F6F1E8",
        color: "#153848",
      }}
    >
      {/* =========================================================
          CREATOR HERO
      ========================================================= */}

      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background:
            "radial-gradient(circle at 78% 20%, rgba(180,138,69,.30), transparent 28%), linear-gradient(135deg,#102F3B 0%,#153848 52%,#204F61 100%)",
          minHeight: 470,
          color: "#F6F1E8",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 500,
            height: 500,
            borderRadius: "50%",
            right: -180,
            top: -220,
            border: "1px solid rgba(246,241,232,.10)",
          }}
        />

        <div
          style={{
            position: "absolute",
            width: 340,
            height: 340,
            borderRadius: "50%",
            right: -80,
            top: -120,
            border: "1px solid rgba(246,241,232,.08)",
          }}
        />

        <div
          style={{
            position: "relative",
            maxWidth: 1450,
            margin: "0 auto",
            padding: "28px 42px 115px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 75,
            }}
          >
            <Link
              href="/dashboard"
              style={{
                color: "#F6F1E8",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: 17,
              }}
            >
              ← FONS
            </Link>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  opacity: 0.65,
                }}
              >
                Creator
              </span>

              <button
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: "50%",
                  border: "1px solid rgba(246,241,232,.25)",
                  background: "rgba(255,255,255,.07)",
                  color: "#F6F1E8",
                  fontSize: 18,
                  cursor: "pointer",
                }}
                aria-label="More creator options"
              >
                ⋯
              </button>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 34,
              maxWidth: 1050,
            }}
          >
            <div
              style={{
                width: 190,
                height: 190,
                flexShrink: 0,
                borderRadius: "50%",
                background:
                  "linear-gradient(145deg,#F6F1E8,#D9CDBA)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#153848",
                fontSize: 58,
                fontWeight: 800,
                boxShadow: "0 24px 60px rgba(0,0,0,.28)",
                border: "7px solid rgba(246,241,232,.95)",
              }}
            >
              AK
            </div>

            <div style={{ paddingBottom: 4 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 14,
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  color: "#D8B46A",
                }}
              >
                Verified Creator
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "#D8B46A",
                    color: "#153848",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                  }}
                >
                  ✓
                </span>
              </div>

              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(48px,6vw,78px)",
                  lineHeight: 0.98,
                  letterSpacing: -3,
                  color: "#F6F1E8",
                }}
              >
                Andrew Kyamagero
              </h1>

              <p
                style={{
                  margin: "22px 0 0",
                  maxWidth: 760,
                  fontSize: 18,
                  lineHeight: 1.7,
                  color: "rgba(246,241,232,.78)",
                }}
              >
                Journalist, broadcaster, public speaker and storyteller
                creating conversations that inform, challenge perspectives
                and inspire action.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CREATOR CONTENT
      ========================================================= */}

      <div
        style={{
          maxWidth: 1450,
          margin: "-55px auto 0",
          position: "relative",
          padding: "0 42px 90px",
        }}
      >
        {/* Action bar */}

        <section
          style={{
            background: "#FFFFFF",
            borderRadius: 24,
            padding: "20px 24px",
            display: "flex",
            alignItems: "center",
            gap: 16,
            boxShadow: "0 18px 45px rgba(21,56,72,.10)",
            marginBottom: 65,
          }}
        >
          <button
            style={{
              width: 58,
              height: 58,
              borderRadius: "50%",
              border: "none",
              background: "#B48A45",
              color: "#153848",
              fontSize: 22,
              cursor: "pointer",
              fontWeight: 800,
            }}
            aria-label="Play creator"
          >
            ▶
          </button>

          <button
            style={{
              padding: "14px 25px",
              borderRadius: 999,
              border: "2px solid #153848",
              background: "#153848",
              color: "#FFFFFF",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Follow
          </button>

          <button
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              border: "1px solid #DED6C9",
              background: "#FFFFFF",
              color: "#153848",
              fontSize: 22,
              cursor: "pointer",
            }}
            aria-label="Share creator"
          >
            ↗
          </button>

          <div style={{ flex: 1 }} />

          <div
            style={{
              display: "flex",
              gap: 28,
              alignItems: "center",
            }}
          >
            <div>
              <strong style={{ display: "block", fontSize: 20 }}>
                2
              </strong>
              <span style={{ color: "#777", fontSize: 12 }}>
                Shows
              </span>
            </div>

            <div>
              <strong style={{ display: "block", fontSize: 20 }}>
                Creator
              </strong>
              <span style={{ color: "#777", fontSize: 12 }}>
                Account
              </span>
            </div>
          </div>
        </section>

        {/* =====================================================
            SHOWS
        ===================================================== */}

        <section style={{ marginBottom: 78 }}>
          <div style={{ marginBottom: 28 }}>
            <div
              style={{
                color: "#B48A45",
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 9,
              }}
            >
              Shows
            </div>

            <h2
              style={{
                margin: 0,
                fontSize: 42,
                letterSpacing: -1.5,
              }}
            >
              Andrew's shows
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(420px,1fr))",
              gap: 26,
            }}
          >
            {shows.map((show) => (
              <Link
                href={show.href}
                key={show.id}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <article
                  style={{
                    background: "#FFFFFF",
                    borderRadius: 28,
                    padding: 24,
                    display: "flex",
                    gap: 24,
                    alignItems: "center",
                    minHeight: 190,
                    boxShadow: "0 12px 32px rgba(21,56,72,.06)",
                    transition: "transform .2s ease",
                  }}
                >
                  <div
                    style={{
                      width: 150,
                      height: 150,
                      flexShrink: 0,
                      borderRadius: 20,
                      overflow: "hidden",
                      background: "#153848",
                      boxShadow: "0 12px 25px rgba(0,0,0,.12)",
                    }}
                  >
                    <Image
                      src={show.logo}
                      alt={show.name}
                      width={150}
                      height={150}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#B48A45",
                        fontWeight: 800,
                        letterSpacing: 1.5,
                        textTransform: "uppercase",
                      }}
                    >
                      {show.episodes}
                    </div>

                    <h3
                      style={{
                        margin: "8px 0 10px",
                        fontSize: 27,
                      }}
                    >
                      {show.name}
                    </h3>

                    <p
                      style={{
                        margin: 0,
                        color: "#6F7477",
                        lineHeight: 1.55,
                        fontSize: 14,
                      }}
                    >
                      {show.description}
                    </p>
                  </div>

                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: "50%",
                      background: "#153848",
                      color: "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    →
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>

        {/* =====================================================
            LATEST CONTENT
        ===================================================== */}

        <section style={{ marginBottom: 75 }}>
          <div
            style={{
              display: "flex",
              alignItems: "end",
              justifyContent: "space-between",
              marginBottom: 25,
            }}
          >
            <div>
              <div
                style={{
                  color: "#B48A45",
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  marginBottom: 9,
                }}
              >
                Content
              </div>

              <h2
                style={{
                  margin: 0,
                  fontSize: 42,
                  letterSpacing: -1.5,
                }}
              >
                Latest from Andrew
              </h2>
            </div>

            <span
              style={{
                color: "#6F7477",
                fontSize: 14,
              }}
            >
              All content
            </span>
          </div>

          <div
            style={{
              background: "#FFFFFF",
              borderRadius: 28,
              overflow: "hidden",
              boxShadow: "0 12px 32px rgba(21,56,72,.05)",
            }}
          >
            {recentEpisodes.map((episode, index) => (
              <Link
                href={episode.href}
                key={episode.id}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "42px 64px 1fr 160px 110px 52px",
                    alignItems: "center",
                    gap: 18,
                    padding: "18px 25px",
                    borderBottom:
                      index !== recentEpisodes.length - 1
                        ? "1px solid #ECE7DE"
                        : "none",
                  }}
                >
                  <span
                    style={{
                      color: "#9A9A96",
                      fontSize: 14,
                      textAlign: "center",
                    }}
                  >
                    {index + 1}
                  </span>

                  <Image
                    src={episode.image}
                    alt=""
                    width={64}
                    height={64}
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 10,
                      objectFit: "cover",
                    }}
                  />

                  <div>
                    <strong
                      style={{
                        display: "block",
                        fontSize: 16,
                        marginBottom: 5,
                      }}
                    >
                      {episode.title}
                    </strong>

                    <span
                      style={{
                        color: "#777",
                        fontSize: 13,
                      }}
                    >
                      {episode.subtitle}
                    </span>
                  </div>

                  <span
                    style={{
                      color: "#777",
                      fontSize: 13,
                    }}
                  >
                    {episode.show}
                  </span>

                  <span
                    style={{
                      color: "#777",
                      fontSize: 13,
                    }}
                  >
                    {episode.duration}
                  </span>

                  <span
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#F1ECE3",
                      color: "#153848",
                    }}
                  >
                    ▶
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* =====================================================
            ABOUT + COLLECTIONS
        ===================================================== */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 28,
          }}
        >
          <CreatorAbout />

          <CreatorCollections />
        </div>
      </div>
    </main>
  );
}