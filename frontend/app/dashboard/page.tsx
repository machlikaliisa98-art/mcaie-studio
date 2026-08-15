"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import DashboardLayout from "../../components/DashboardLayout";
import { API_URL } from "@/config/api";

type Creator = {
  id: number;
  full_name: string;
  username: string;
  email: string;
  country: string;
  creator_category: string;
  verified: boolean;
  active: boolean;
};

type Analytics = {
  creator_id: string;
  total_plays: number;
  unique_listeners: number;
  downloads: number;
  completions: number;
  listening_seconds: number;
};

type LiveAnalytics = {
  creator_id: string;
  episode_id: string | null;
  live_listeners: number;
  listeners: string[];
};

export default function DashboardPage() {
  const [creator, setCreator] =
    useState<Creator | null>(null);

  const [analytics, setAnalytics] =
    useState<Analytics | null>(null);

  const [live, setLive] =
    useState<LiveAnalytics | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      const token =
        localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        const authHeaders = {
          Authorization: `Bearer ${token}`,
        };

        const [
          creatorResponse,
          analyticsResponse,
          liveResponse,
        ] = await Promise.all([
          fetch(
            `${API_URL}/auth/me`,
            {
              headers: authHeaders,
            },
          ),

          fetch(
            `${API_URL}/creator-analytics/me`,
            {
              headers: authHeaders,
            },
          ),

          fetch(
            `${API_URL}/creator-analytics/me/live`,
            {
              headers: authHeaders,
            },
          ),
        ]);

        if (
          creatorResponse.status === 401 ||
          analyticsResponse.status === 401 ||
          liveResponse.status === 401
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("creator");

          window.location.href = "/login";
          return;
        }

        if (
          !creatorResponse.ok ||
          !analyticsResponse.ok ||
          !liveResponse.ok
        ) {
          throw new Error(
            "Unable to load creator dashboard.",
          );
        }

        const [
          creatorData,
          analyticsData,
          liveData,
        ] = await Promise.all([
          creatorResponse.json(),
          analyticsResponse.json(),
          liveResponse.json(),
        ]);

        if (!mounted) {
          return;
        }

        setCreator(creatorData);
        setAnalytics(analyticsData);
        setLive(liveData);
      } catch (err) {
        console.error(
          "Dashboard loading error:",
          err,
        );

        if (mounted) {
          setError(
            "Unable to load your creator dashboard.",
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      return;
    }

    const interval =
      window.setInterval(
        async () => {
          try {
            const response =
              await fetch(
                `${API_URL}/creator-analytics/me/live`,
                {
                  headers: {
                    Authorization:
                      `Bearer ${token}`,
                  },
                },
              );

            if (!response.ok) {
              return;
            }

            const data =
              await response.json();

            setLive(data);
          } catch (err) {
            console.error(
              "Live analytics refresh failed:",
              err,
            );
          }
        },
        15000,
      );

    return () => {
      window.clearInterval(
        interval,
      );
    };
  }, []);

  function formatListeningTime(
    seconds: number,
  ) {
    if (!seconds || seconds < 1) {
      return "0m";
    }

    const totalMinutes =
      Math.floor(seconds / 60);

    const hours =
      Math.floor(totalMinutes / 60);

    const minutes =
      totalMinutes % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }

    return `${minutes}m`;
  }

  function completionRate() {
    if (
      !analytics ||
      analytics.total_plays === 0
    ) {
      return 0;
    }

    return Math.round(
      (analytics.completions /
        analytics.total_plays) *
        100,
    );
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("creator");

    window.location.href = "/login";
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: "80px 20px",
            color: "#153848",
          }}
        >
          <div
            style={{
              color: "#B48A45",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 2,
              marginBottom: 12,
            }}
          >
            FONS CREATOR STUDIO
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: 48,
            }}
          >
            Loading your workspace...
          </h1>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: "80px 20px",
          }}
        >
          <div
            style={{
              background: "#FFE8E8",
              color: "#B00020",
              borderRadius: 20,
              padding: 24,
              fontWeight: 600,
            }}
          >
            {error}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          paddingBottom: 60,
        }}
      >
        {/* ==================================================
            HEADER
        ================================================== */}

        <section
          style={{
            marginBottom: 42,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 24,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: 2,
                  color: "#B48A45",
                  marginBottom: 12,
                }}
              >
                CREATOR WORKSPACE
              </div>

              <h1
                style={{
                  margin: 0,
                  fontSize: 56,
                  lineHeight: 1.1,
                  color: "#153848",
                }}
              >
                Welcome back
                {creator?.full_name
                  ? `, ${creator.full_name.split(" ")[0]}`
                  : ""}
                .
              </h1>

              <p
                style={{
                  marginTop: 18,
                  fontSize: 19,
                  lineHeight: 1.7,
                  color: "#666",
                  maxWidth: 760,
                }}
              >
                Your FONS creator workspace for
                publishing, audience intelligence
                and conversations that matter.
              </p>
            </div>

            <button
              onClick={handleLogout}
              style={{
                border: "1px solid #153848",
                background: "#FFFFFF",
                color: "#153848",
                padding: "12px 20px",
                borderRadius: 999,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Sign Out
            </button>
          </div>
        </section>

        {/* ==================================================
            CREATOR IDENTITY
        ================================================== */}

        {creator && (
          <section
            style={{
              background: "#153848",
              color: "#FFFFFF",
              borderRadius: 30,
              padding: 32,
              marginBottom: 30,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 20,
                flexWrap: "wrap",
              }}
            >
              <div>
                <div
                  style={{
                    color: "#B48A45",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: 2,
                    marginBottom: 8,
                  }}
                >
                  CREATOR ACCOUNT
                </div>

                <div
                  style={{
                    fontSize: 27,
                    fontWeight: 700,
                  }}
                >
                  {creator.full_name}
                </div>

                <div
                  style={{
                    marginTop: 7,
                    opacity: 0.75,
                  }}
                >
                  @{creator.username}
                  {" · "}
                  {creator.email}
                </div>
              </div>

              <div
                style={{
                  padding: "10px 16px",
                  borderRadius: 999,
                  background: creator.active
                    ? "rgba(180,138,69,.2)"
                    : "rgba(255,255,255,.1)",
                  color: creator.active
                    ? "#E6C98A"
                    : "#FFFFFF",
                  fontWeight: 700,
                }}
              >
                {creator.active
                  ? "Active Creator"
                  : "Inactive"}
              </div>
            </div>
          </section>
        )}

        {/* ==================================================
            ANALYTICS
        ================================================== */}

        <section
          style={{
            marginBottom: 36,
          }}
        >
          <div
            style={{
              color: "#B48A45",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 2,
              marginBottom: 12,
            }}
          >
            AUDIENCE INTELLIGENCE
          </div>

          <h2
            style={{
              margin: 0,
              color: "#153848",
              fontSize: 38,
            }}
          >
            Your audience
          </h2>

          <p
            style={{
              color: "#666",
              marginTop: 10,
              fontSize: 17,
            }}
          >
            Live performance from your published
            conversations.
          </p>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(190px, 1fr))",
            gap: 20,
            marginBottom: 30,
          }}
        >
          {[
            {
              label: "TOTAL PLAYS",
              value:
                analytics?.total_plays ?? 0,
            },
            {
              label: "UNIQUE LISTENERS",
              value:
                analytics?.unique_listeners ?? 0,
            },
            {
              label: "COMPLETIONS",
              value:
                analytics?.completions ?? 0,
            },
            {
              label: "LISTENING TIME",
              value: formatListeningTime(
                analytics?.listening_seconds ??
                  0,
              ),
            },
            {
              label: "DOWNLOADS",
              value:
                analytics?.downloads ?? 0,
            },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                background: "#FFFFFF",
                borderRadius: 26,
                padding: 26,
                boxShadow:
                  "0 12px 40px rgba(0,0,0,.05)",
              }}
            >
              <div
                style={{
                  color: "#B48A45",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 1.5,
                  marginBottom: 15,
                }}
              >
                {item.label}
              </div>

              <div
                style={{
                  color: "#153848",
                  fontSize: 34,
                  fontWeight: 700,
                }}
              >
                {item.value}
              </div>
            </div>
          ))}
        </section>

        {/* ==================================================
            PERFORMANCE + LIVE
        ================================================== */}

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "minmax(0, 2fr) minmax(300px, 1fr)",
            gap: 28,
            marginBottom: 36,
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: 30,
              padding: 34,
              boxShadow:
                "0 12px 40px rgba(0,0,0,.05)",
            }}
          >
            <div
              style={{
                color: "#B48A45",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 2,
              }}
            >
              ENGAGEMENT
            </div>

            <h3
              style={{
                color: "#153848",
                fontSize: 30,
                marginTop: 14,
                marginBottom: 12,
              }}
            >
              Completion rate
            </h3>

            <div
              style={{
                fontSize: 56,
                fontWeight: 700,
                color: "#153848",
              }}
            >
              {completionRate()}%
            </div>

            <div
              style={{
                height: 12,
                background: "#EEEEEE",
                borderRadius: 999,
                overflow: "hidden",
                marginTop: 20,
              }}
            >
              <div
                style={{
                  width: `${completionRate()}%`,
                  height: "100%",
                  background: "#B48A45",
                  borderRadius: 999,
                }}
              />
            </div>

            <p
              style={{
                color: "#666",
                lineHeight: 1.7,
                marginTop: 18,
              }}
            >
              Percentage of recorded plays that
              reached completion.
            </p>
          </div>

          <div
            style={{
              background: "#153848",
              color: "#FFFFFF",
              borderRadius: 30,
              padding: 34,
            }}
          >
            <div
              style={{
                color: "#B48A45",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 2,
              }}
            >
              LIVE NOW
            </div>

            <div
              style={{
                marginTop: 18,
                fontSize: 56,
                fontWeight: 700,
              }}
            >
              {live?.live_listeners ?? 0}
            </div>

            <div
              style={{
                fontSize: 19,
                fontWeight: 700,
              }}
            >
              active listeners
            </div>

            <p
              style={{
                opacity: 0.75,
                lineHeight: 1.7,
                marginTop: 18,
              }}
            >
              Live listener activity refreshes
              automatically every 15 seconds.
            </p>

            {live?.episode_id && (
              <div
                style={{
                  marginTop: 20,
                  padding: 14,
                  borderRadius: 14,
                  background:
                    "rgba(255,255,255,.08)",
                }}
              >
                Episode: {live.episode_id}
              </div>
            )}
          </div>
        </section>

        {/* ==================================================
            CREATOR TOOLS
        ================================================== */}

        <section
          style={{
            marginBottom: 36,
          }}
        >
          <div
            style={{
              color: "#B48A45",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 2,
              marginBottom: 10,
            }}
          >
            CREATOR TOOLS
          </div>

          <h2
            style={{
              color: "#153848",
              fontSize: 36,
              margin: 0,
            }}
          >
            Continue creating
          </h2>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 24,
            marginBottom: 40,
          }}
        >
          <Link
            href="/studio"
            style={{
              textDecoration: "none",
              background: "#153848",
              color: "#FFFFFF",
              borderRadius: 28,
              padding: 32,
            }}
          >
            <div
              style={{
                color: "#B48A45",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 2,
              }}
            >
              PRODUCTION
            </div>

            <h3
              style={{
                fontSize: 30,
                marginTop: 16,
                marginBottom: 10,
              }}
            >
              Creator Studio
            </h3>

            <p
              style={{
                opacity: 0.8,
                lineHeight: 1.7,
              }}
            >
              Upload conversations and let MCAIE
              transform them into publishable
              episodes.
            </p>
          </Link>

          <Link
            href="/library"
            style={{
              textDecoration: "none",
              background: "#FFFFFF",
              color: "#153848",
              borderRadius: 28,
              padding: 32,
              boxShadow:
                "0 12px 40px rgba(0,0,0,.05)",
            }}
          >
            <div
              style={{
                color: "#B48A45",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 2,
              }}
            >
              CONTENT
            </div>

            <h3
              style={{
                fontSize: 30,
                marginTop: 16,
                marginBottom: 10,
              }}
            >
              Library
            </h3>

            <p
              style={{
                color: "#666",
                lineHeight: 1.7,
              }}
            >
              Manage your conversations, episodes
              and published content.
            </p>
          </Link>

          <Link
            href="/shows/kyamagero-daily"
            style={{
              textDecoration: "none",
              background: "#FFFFFF",
              color: "#153848",
              borderRadius: 28,
              padding: 32,
              boxShadow:
                "0 12px 40px rgba(0,0,0,.05)",
            }}
          >
            <div
              style={{
                color: "#B48A45",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 2,
              }}
            >
              PUBLISHED SHOW
            </div>

            <h3
              style={{
                fontSize: 30,
                marginTop: 16,
                marginBottom: 10,
              }}
            >
              Kyamagero Daily
            </h3>

            <p
              style={{
                color: "#666",
                lineHeight: 1.7,
              }}
            >
              Open the public show and listen to
              published conversations.
            </p>
          </Link>
        </section>
      </div>
    </DashboardLayout>
  );
}