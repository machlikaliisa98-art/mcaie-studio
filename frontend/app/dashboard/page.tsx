"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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
  const [creator, setCreator] = useState<Creator | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [live, setLive] = useState<LiveAnalytics | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [
          creatorResponse,
          analyticsResponse,
          liveResponse,
        ] = await Promise.all([
          fetch(`${API_URL}/auth/me`, {
            headers,
          }),
          fetch(`${API_URL}/creator-analytics/me`, {
            headers,
          }),
          fetch(`${API_URL}/creator-analytics/me/live`, {
            headers,
          }),
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
          throw new Error("Unable to load creator dashboard.");
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

        if (!mounted) return;

        setCreator(creatorData);
        setAnalytics(analyticsData);
        setLive(liveData);
      } catch (err) {
        console.error("Dashboard loading error:", err);

        if (mounted) {
          setError(
            "Unable to load your creator dashboard."
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
    const token = localStorage.getItem("token");

    if (!token) return;

    const interval = window.setInterval(async () => {
      try {
        const response = await fetch(
          `${API_URL}/creator-analytics/me/live`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) return;

        const data = await response.json();
        setLive(data);
      } catch (err) {
        console.error(
          "Live analytics refresh failed:",
          err
        );
      }
    }, 15000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const completionRate = useMemo(() => {
    if (
      !analytics ||
      analytics.total_plays === 0
    ) {
      return 0;
    }

    return Math.round(
      (analytics.completions /
        analytics.total_plays) *
        100
    );
  }, [analytics]);

  function formatListeningTime(seconds: number) {
    if (!seconds || seconds < 1) {
      return "0m";
    }

    const totalMinutes = Math.floor(
      seconds / 60
    );

    const hours = Math.floor(
      totalMinutes / 60
    );

    const minutes = totalMinutes % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }

    return `${minutes}m`;
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("creator");

    window.location.href = "/login";
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="fons-loading">
          <div className="fons-kicker">
            FONS CREATOR STUDIO
          </div>

          <h1>
            Loading your workspace...
          </h1>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="fons-error">
          {error}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="creator-dashboard">

        {/* HEADER */}

        <section className="dashboard-intro">
          <div>
            <div className="fons-kicker">
              CREATOR STUDIO
            </div>

            <h1>
              Good to see you
              {creator?.full_name
                ? `, ${creator.full_name.split(" ")[0]}`
                : ""}
              .
            </h1>

            <p>
              Your work is moving. Here is what
              your audience is doing with it.
            </p>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Sign out
          </button>
        </section>


        {/* CREATOR IDENTITY */}

        {creator && (
          <section className="creator-strip">
            <div className="creator-avatar">
              {creator.full_name
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="creator-identity">
              <div className="creator-name">
                {creator.full_name}

                {creator.verified && (
                  <span className="verified">
                    ✓
                  </span>
                )}
              </div>

              <div className="creator-meta">
                @{creator.username}
                <span>·</span>
                {creator.creator_category}
                <span>·</span>
                {creator.country}
              </div>
            </div>

            <div className="creator-status">
              <span />
              {creator.active
                ? "Active Creator"
                : "Inactive"}
            </div>
          </section>
        )}


        {/* PRIMARY METRICS */}

        <section className="metrics-grid">

          <Metric
            label="Total plays"
            value={
              analytics?.total_plays ?? 0
            }
            emphasis
          />

          <Metric
            label="Unique listeners"
            value={
              analytics?.unique_listeners ?? 0
            }
          />

          <Metric
            label="Completions"
            value={
              analytics?.completions ?? 0
            }
          />

          <Metric
            label="Listening time"
            value={formatListeningTime(
              analytics?.listening_seconds ?? 0
            )}
          />

          <Metric
            label="Downloads"
            value={
              analytics?.downloads ?? 0
            }
          />

        </section>


        {/* AUDIENCE + LIVE */}

        <section className="intelligence-grid">

          <div className="intelligence-card audience-card">

            <div className="section-kicker">
              AUDIENCE INTELLIGENCE
            </div>

            <div className="card-heading-row">
              <div>
                <h2>
                  Your audience
                </h2>

                <p>
                  How people are engaging with
                  your published work.
                </p>
              </div>

              <div className="period-pill">
                All time
              </div>
            </div>

            <div className="audience-visual">

              <div className="chart-y">
                <span>100</span>
                <span>75</span>
                <span>50</span>
                <span>25</span>
                <span>0</span>
              </div>

              <div className="chart-area">

                <div className="chart-lines">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>

                <div className="chart-message">
                  <div className="chart-dot" />

                  <strong>
                    {analytics?.total_plays ?? 0}
                  </strong>

                  <small>
                    total plays
                  </small>
                </div>

              </div>

            </div>

            <div className="chart-note">
              Your analytics will become more
              detailed as FONS collects more
              listening activity.
            </div>

          </div>


          <div className="live-card">

            <div className="section-kicker gold">
              LIVE NOW
            </div>

            <div className="live-number">
              {live?.live_listeners ?? 0}
            </div>

            <div className="live-label">
              active listeners
            </div>

            <p>
              Live audience activity refreshes
              automatically.
            </p>

            <div className="live-indicator">
              <span />
              Live monitoring active
            </div>

            {live?.episode_id && (
              <div className="live-episode">
                Episode {live.episode_id}
              </div>
            )}

          </div>

        </section>


        {/* ENGAGEMENT */}

        <section className="engagement-section">

          <div className="section-kicker">
            ENGAGEMENT
          </div>

          <div className="engagement-grid">

            <div className="engagement-main">

              <div>
                <h2>
                  People are staying
                </h2>

                <p>
                  Completion measures how often
                  listeners reach the end of your
                  published work.
                </p>
              </div>

              <div className="completion-number">
                {completionRate}
                <span>%</span>
              </div>

              <div className="progress-track">
                <div
                  className="progress-value"
                  style={{
                    width: `${completionRate}%`,
                  }}
                />
              </div>

            </div>


            <div className="engagement-side">

              <div className="mini-label">
                LISTENING TIME
              </div>

              <div className="mini-number">
                {formatListeningTime(
                  analytics?.listening_seconds ?? 0
                )}
              </div>

              <p>
                Total recorded listening across
                your work.
              </p>

            </div>

          </div>

        </section>


        {/* CREATOR WORK */}

        <section className="work-section">

          <div className="section-heading">

            <div>
              <div className="section-kicker">
                YOUR WORK
              </div>

              <h2>
                Keep creating.
              </h2>

              <p>
                Everything you publish becomes
                part of your audience story.
              </p>
            </div>

            <Link
              href="/studio"
              className="gold-button"
            >
              Open Creator Studio
            </Link>

          </div>


          <div className="work-grid">

            <Link
              href="/studio"
              className="work-card work-card-dark"
            >
              <div className="work-number">
                01
              </div>

              <div>
                <div className="work-kicker">
                  PRODUCTION
                </div>

                <h3>
                  Creator Studio
                </h3>

                <p>
                  Turn conversations into
                  publishable episodes.
                </p>
              </div>

              <div className="work-arrow">
                →
              </div>
            </Link>


            <Link
              href="/library"
              className="work-card"
            >
              <div className="work-number">
                02
              </div>

              <div>
                <div className="work-kicker">
                  CONTENT
                </div>

                <h3>
                  Your Library
                </h3>

                <p>
                  Manage conversations,
                  episodes and published work.
                </p>
              </div>

              <div className="work-arrow dark">
                →
              </div>
            </Link>


            <Link
              href="/shows/kyamagero-daily"
              className="work-card"
            >
              <div className="work-number">
                03
              </div>

              <div>
                <div className="work-kicker">
                  PUBLISHED
                </div>

                <h3>
                  Kyamagero Daily
                </h3>

                <p>
                  Open your public show and
                  continue the conversation.
                </p>
              </div>

              <div className="work-arrow dark">
                →
              </div>
            </Link>

          </div>

        </section>


        {/* FOOTER MESSAGE */}

        <section className="creator-closing">

          <div className="closing-mark">
            F
          </div>

          <div>
            <div className="section-kicker">
              FONS
            </div>

            <h2>
              Your ideas deserve
              an audience.
            </h2>

            <p>
              FONS is built to help creators
              publish, understand and grow
              the conversations that matter.
            </p>
          </div>

        </section>

      </div>
    </DashboardLayout>
  );
}


function Metric({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: string | number;
  emphasis?: boolean;
}) {
  return (
    <div
      className={`metric-card ${
        emphasis ? "metric-emphasis" : ""
      }`}
    >
      <div className="metric-label">
        {label}
      </div>

      <div className="metric-value">
        {value}
      </div>
    </div>
  );
}