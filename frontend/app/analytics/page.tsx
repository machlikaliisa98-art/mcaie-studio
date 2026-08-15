"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { API_URL } from "@/config/api";

type Creator = {
  id: number;
  full_name: string;
  username: string;
  email?: string;
  country?: string;
  creator_category?: string;
  verified?: boolean;
  active?: boolean;
};

type ActivityItem = {
  date: string;
  plays: number;
  unique_listeners: number;
  completions: number;
  downloads: number;
};

type ShowAnalytics = {
  show_id: string;
  plays: number;
  unique_listeners: number;
  completions: number;
  completion_events?: number;
  downloads: number;
  completion_rate?: number;
};

type EpisodeAnalytics = {
  episode_id: string;
  show_id: string;
  plays: number;
  unique_listeners: number;
  completions: number;
  completion_events?: number;
  downloads: number;
  completion_rate?: number;
};

type RetentionPoint = {
  percentage: number;
  listeners: number;
  rate: number;
};

type HourActivity = {
  hour: number;
  plays: number;
  unique_listeners: number;
};

type DayActivity = {
  day: string;
  day_number: number;
  plays: number;
  unique_listeners: number;
};

type Analytics = {
  creator_id: string;
  total_plays: number;
  unique_listeners: number;
  downloads: number;
  completions: number;
  completion_events?: number;
  listening_seconds: number;
  completion_rate: number;

  audience?: {
    total_listeners: number;
    play_listeners: number;
    new_listeners: number;
    returning_listeners: number;
    new_listener_rate: number;
    returning_listener_rate: number;
    repeat_plays: number;
  };

  listening?: {
    total_seconds: number;
    average_session_seconds: number;
    average_listening_depth: number;
    retention_sessions: number;
    retention: RetentionPoint[];
  };

  discovery?: {
    catalogue_explorers: number;
    catalogue_exploration_rate: number;
  };

  time_behaviour?: {
    by_hour: HourActivity[];
    by_day: DayActivity[];
    top_hour: HourActivity | null;
    top_day: DayActivity | null;
  };

  period?: {
    days: number;
    from: string;
    to: string;
  };

  activity?: ActivityItem[];
  shows?: ShowAnalytics[];
  episodes?: EpisodeAnalytics[];
};

type LiveAnalytics = {
  creator_id: string;
  episode_id: string | null;
  live_listeners: number;
  listeners: unknown[];
};

function formatNumber(value: number | undefined) {
  return new Intl.NumberFormat("en-US").format(
    Number(value || 0),
  );
}

function formatPercent(value: number | undefined) {
  return `${Number(value || 0).toFixed(
    Number(value || 0) % 1 === 0 ? 0 : 1,
  )}%`;
}

function formatDuration(seconds: number | undefined) {
  const totalSeconds = Math.max(
    0,
    Math.round(Number(seconds || 0)),
  );

  if (totalSeconds < 60) {
    return `${totalSeconds}s`;
  }

  const totalMinutes = Math.floor(
    totalSeconds / 60,
  );

  const hours = Math.floor(
    totalMinutes / 60,
  );

  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
}

function formatHour(hour: number) {
  const normalized = ((hour % 24) + 24) % 24;
  const suffix = normalized >= 12 ? "PM" : "AM";
  const displayHour =
    normalized % 12 === 0
      ? 12
      : normalized % 12;

  return `${displayHour} ${suffix}`;
}

function prettyShowName(showId: string) {
  return showId
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}

function prettyEpisodeName(episodeId: string) {
  const numeric = Number(episodeId);

  if (!Number.isNaN(numeric)) {
    return `Episode ${String(numeric).padStart(
      2,
      "0",
    )}`;
  }

  return episodeId
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}

function getInitials(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!parts.length) {
    return "C";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return (
    parts[0][0] +
    parts[parts.length - 1][0]
  ).toUpperCase();
}

function StatIcon({
  type,
}: {
  type: "plays" | "audience" | "time" | "completion";
}) {
  if (type === "plays") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          d="M8 5.5v13l10-6.5L8 5.5Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === "audience") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          cx="9"
          cy="8"
          r="3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M3.5 19c.5-3.2 2.3-5 5.5-5s5 1.8 5.5 5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M15.5 5.8a2.6 2.6 0 0 1 0 5.1M17 14.5c2 .7 3.2 2.1 3.5 4.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === "time") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="8.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M12 7.5V12l3 2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M6 12.5 10 16l8-9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function EmptyChart({
  message,
}: {
  message: string;
}) {
  return (
    <div className="analytics-empty">
      <div className="analytics-empty-mark">
        —
      </div>
      <span>{message}</span>
    </div>
  );
}

function RetentionChart({
  retention,
}: {
  retention: RetentionPoint[];
}) {
  const points = retention.length
    ? retention
    : [
        {
          percentage: 0,
          listeners: 0,
          rate: 0,
        },
      ];

  const width = 620;
  const height = 250;
  const left = 46;
  const right = 18;
  const top = 24;
  const bottom = 42;

  const innerWidth =
    width - left - right;

  const innerHeight =
    height - top - bottom;

  const maxRate = 100;

  const coords = points.map(
    (point, index) => {
      const x =
        left +
        (index /
          Math.max(points.length - 1, 1)) *
          innerWidth;

      const y =
        top +
        (1 -
          point.rate / maxRate) *
          innerHeight;

      return {
        ...point,
        x,
        y,
      };
    },
  );

  const polyline = coords
    .map(
      (point) =>
        `${point.x},${point.y}`,
    )
    .join(" ");

  const areaPoints = [
    `${left},${height - bottom}`,
    ...coords.map(
      (point) =>
        `${point.x},${point.y}`,
    ),
    `${left + innerWidth},${
      height - bottom
    }`,
  ].join(" ");

  return (
    <div className="retention-chart-wrap">
      <svg
        className="retention-chart"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Listener retention chart"
      >
        {[0, 25, 50, 75, 100].map(
          (value) => {
            const y =
              top +
              (1 - value / 100) *
                innerHeight;

            return (
              <g key={value}>
                <line
                  x1={left}
                  x2={width - right}
                  y1={y}
                  y2={y}
                  stroke="rgba(21,56,72,.10)"
                  strokeDasharray="4 6"
                />
                <text
                  x={left - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill="#70808A"
                >
                  {value}%
                </text>
              </g>
            );
          },
        )}

        <polygon
          points={areaPoints}
          fill="rgba(180,138,69,.10)"
        />

        <polyline
          points={polyline}
          fill="none"
          stroke="#B48A45"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {coords.map(
          (point) => (
            <g
              key={point.percentage}
            >
              <circle
                cx={point.x}
                cy={point.y}
                r="6"
                fill="#F6F1E8"
                stroke="#B48A45"
                strokeWidth="3"
              />

              <text
                x={point.x}
                y={
                  point.y -
                  13
                }
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                fill="#153848"
              >
                {point.rate}%
              </text>

              <text
                x={point.x}
                y={height - 15}
                textAnchor="middle"
                fontSize="11"
                fill="#70808A"
              >
                {point.percentage}%
              </text>
            </g>
          ),
        )}
      </svg>
    </div>
  );
}

function HourChart({
  hours,
}: {
  hours: HourActivity[];
}) {
  const maxPlays = Math.max(
    ...hours.map(
      (item) => item.plays,
    ),
    1,
  );

  return (
    <div className="hour-chart">
      <div className="hour-y-axis">
        <span>{maxPlays}</span>
        <span>
          {Math.ceil(maxPlays / 2)}
        </span>
        <span>0</span>
      </div>

      <div className="hour-bars">
        {hours.map(
          (item) => {
            const height =
              item.plays === 0
                ? 4
                : Math.max(
                    10,
                    (item.plays /
                      maxPlays) *
                      150,
                  );

            return (
              <div
                className="hour-column"
                key={item.hour}
                title={`${formatHour(
                  item.hour,
                )}: ${
                  item.plays
                } plays`}
              >
                <div
                  className="hour-bar"
                  style={{
                    height,
                    opacity:
                      item.plays === 0
                        ? 0.22
                        : 1,
                  }}
                />

                <span>
                  {item.hour %
                    4 ===
                  0
                    ? String(
                        item.hour,
                      ).padStart(
                        2,
                        "0",
                      )
                    : ""}
                </span>
              </div>
            );
          },
        )}
      </div>
    </div>
  );
}

function ActivityChart({
  activity,
}: {
  activity: ActivityItem[];
}) {
  if (!activity.length) {
    return (
      <EmptyChart message="Activity will appear here as listeners arrive." />
    );
  }

  const visible = activity.slice(-14);

  const maxPlays = Math.max(
    ...visible.map(
      (item) => item.plays,
    ),
    1,
  );

  return (
    <div className="activity-chart">
      {visible.map(
        (item) => {
          const height =
            item.plays === 0
              ? 4
              : Math.max(
                  8,
                  (item.plays /
                    maxPlays) *
                    180,
                );

          const date = new Date(
            `${item.date}T12:00:00`,
          );

          return (
            <div
              className="activity-column"
              key={item.date}
              title={`${item.date}: ${item.plays} plays`}
            >
              <div className="activity-bar-track">
                <div
                  className="activity-bar"
                  style={{
                    height,
                  }}
                />
              </div>

              <span>
                {date.toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                  },
                )}
              </span>
            </div>
          );
        },
      )}
    </div>
  );
}

export default function AnalyticsPage() {
  const [creator, setCreator] =
    useState<Creator | null>(null);

  const [analytics, setAnalytics] =
    useState<Analytics | null>(null);

  const [live, setLive] =
    useState<LiveAnalytics | null>(
      null,
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [refreshing, setRefreshing] =
    useState(false);

  async function loadAnalytics(
    showLoader = false,
  ) {
    if (showLoader) {
      setRefreshing(true);
    }

    const token =
      localStorage.getItem("token");

    if (!token) {
      window.location.href =
        "/login";
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
        fetch(
          `${API_URL}/auth/me`,
          {
            headers,
            cache: "no-store",
          },
        ),
        fetch(
          `${API_URL}/creator-analytics/me`,
          {
            headers,
            cache: "no-store",
          },
        ),
        fetch(
          `${API_URL}/creator-analytics/me/live`,
          {
            headers,
            cache: "no-store",
          },
        ),
      ]);

      if (
        creatorResponse.status ===
          401 ||
        analyticsResponse.status ===
          401 ||
        liveResponse.status === 401
      ) {
        localStorage.removeItem(
          "token",
        );

        localStorage.removeItem(
          "creator",
        );

        window.location.href =
          "/login";

        return;
      }

      if (
        !creatorResponse.ok ||
        !analyticsResponse.ok ||
        !liveResponse.ok
      ) {
        throw new Error(
          "Unable to load creator intelligence.",
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

      setCreator(creatorData);
      setAnalytics(analyticsData);
      setLive(liveData);
      setError("");
    } catch (err) {
      console.error(
        "Creator analytics loading error:",
        err,
      );

      setError(
        "We could not load your analytics right now.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    void loadAnalytics();

    const liveInterval =
      window.setInterval(
        () => {
          void loadAnalytics();
        },
        30000,
      );

    return () => {
      window.clearInterval(
        liveInterval,
      );
    };
  }, []);

  const audience = analytics?.audience;

  const listening =
    analytics?.listening;

  const discovery =
    analytics?.discovery;

  const timeBehaviour =
    analytics?.time_behaviour;

  const activity =
    analytics?.activity ?? [];

  const shows =
    analytics?.shows ?? [];

  const episodes =
    analytics?.episodes ?? [];

  const retention =
    listening?.retention ?? [];

  const hours =
    timeBehaviour?.by_hour ?? [];

  const totalListening =
    listening?.total_seconds ??
    analytics?.listening_seconds ??
    0;

  const averageSession =
    listening?.average_session_seconds ??
    0;

  const listeningDepth =
    listening?.average_listening_depth ??
    0;

  const completionRate =
    analytics?.completion_rate ??
    0;

  const repeatPlays =
    audience?.repeat_plays ?? 0;

  const newRate =
    audience?.new_listener_rate ?? 0;

  const returningRate =
    audience?.returning_listener_rate ??
    0;

  const explorationRate =
    discovery?.catalogue_exploration_rate ??
    0;

  const topHour =
    timeBehaviour?.top_hour ?? null;

  const topDay =
    timeBehaviour?.top_day ?? null;

  const strongestEpisode =
    useMemo(() => {
      if (!episodes.length) {
        return null;
      }

      return [...episodes].sort(
        (a, b) =>
          b.plays - a.plays,
      )[0];
    }, [episodes]);

  const insightCards =
    useMemo(() => {
      const cards: {
        eyebrow: string;
        title: string;
        body: string;
      }[] = [];

      if (
        returningRate > 0
      ) {
        cards.push({
          eyebrow:
            "AUDIENCE LOYALTY",
          title:
            returningRate >= 50
              ? "People are coming back."
              : "Some listeners are returning.",
          body: `${formatPercent(
            returningRate,
          )} of your listeners have returned for more than one play.`,
        });
      }

      if (
        explorationRate > 0
      ) {
        cards.push({
          eyebrow:
            "CATALOGUE DISCOVERY",
          title:
            "Your catalogue is being explored.",
          body: `${formatPercent(
            explorationRate,
          )} of listeners have explored more than one piece of your work.`,
        });
      }

      if (
        topHour &&
        topHour.plays > 0
      ) {
        cards.push({
          eyebrow:
            "LISTENING MOMENT",
          title: `Your audience is most active around ${formatHour(
            topHour.hour,
          )}.`,
          body: `${formatNumber(
            topHour.plays,
          )} plays were recorded during this hour in the current period.`,
        });
      }

      if (
        topDay &&
        topDay.plays > 0
      ) {
        cards.push({
          eyebrow:
            "STRONGEST DAY",
          title: `${topDay.day} is currently your strongest listening day.`,
          body: `${formatNumber(
            topDay.plays,
          )} plays were recorded on ${topDay.day}.`,
        });
      }

      if (
        listeningDepth > 0
      ) {
        cards.push({
          eyebrow:
            "ATTENTION",
          title:
            listeningDepth >= 50
              ? "Listeners are going deep."
              : "There is room to deepen listening.",
          body: `Average recorded listening depth is ${formatPercent(
            listeningDepth,
          )} of an episode.`,
        });
      }

      return cards.slice(0, 4);
    }, [
      returningRate,
      explorationRate,
      topHour,
      topDay,
      listeningDepth,
    ]);

  const periodLabel =
    analytics?.period?.days
      ? `${analytics.period.days}-day view`
      : "Current period";

  if (loading) {
    return (
      <DashboardLayout>
        <div className="analytics-loading">
          <div className="analytics-loading-mark">
            F
          </div>

          <div>
            <div className="analytics-kicker">
              CREATOR INTELLIGENCE
            </div>

            <h1>
              Understanding your
              audience...
            </h1>

            <p>
              Reading the way people
              discover, listen to and
              return to your work.
            </p>
          </div>
        </div>

        <style jsx>{`
          .analytics-loading {
            min-height: calc(100vh - 48px);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 24px;
            padding: 48px;
            color: #153848;
            background: #f6f1e8;
          }

          .analytics-loading-mark {
            width: 58px;
            height: 58px;
            border-radius: 18px;
            display: grid;
            place-items: center;
            background: #153848;
            color: #f6f1e8;
            font-size: 24px;
            font-weight: 800;
          }

          .analytics-kicker {
            color: #b48a45;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 0.16em;
            margin-bottom: 8px;
          }

          h1 {
            margin: 0;
            font-size: clamp(28px, 4vw, 48px);
            line-height: 1;
            letter-spacing: -0.04em;
          }

          p {
            margin: 12px 0 0;
            color: #70808a;
          }

          @media (max-width: 640px) {
            .analytics-loading {
              padding: 28px 20px;
            }
          }
        `}</style>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <main className="analytics-page">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <header className="analytics-header">
          <div className="analytics-header-copy">
            <div className="analytics-kicker">
              CREATOR INTELLIGENCE
            </div>

            <h1>
              Your work,
              <br />
              <em>understood.</em>
            </h1>

            <p>
              See how people discover,
              listen to, return to and
              move through your work.
            </p>

            <div className="analytics-meta">
              <span>
                {periodLabel}
              </span>

              {creator?.verified && (
                <>
                  <i />
                  <span>
                    Verified creator
                  </span>
                </>
              )}

              {live &&
                live.live_listeners >
                  0 && (
                  <>
                    <i />
                    <span className="live-status">
                      <b />
                      {
                        live.live_listeners
                      } listening now
                    </span>
                  </>
                )}
            </div>
          </div>

          <div className="analytics-header-actions">
            <div className="creator-mini">
              <div className="creator-avatar">
                {getInitials(
                  creator?.full_name ||
                    creator?.username ||
                    "Creator",
                )}
              </div>

              <div>
                <strong>
                  {creator?.full_name ||
                    creator?.username ||
                    "Creator"}
                </strong>

                <span>
                  @{creator?.username ||
                    analytics?.creator_id ||
                    "creator"}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="refresh-button"
              onClick={() =>
                void loadAnalytics(
                  true,
                )
              }
              disabled={refreshing}
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M20 11a8 8 0 0 0-14.9-4M4 13a8 8 0 0 0 14.9 4M5 3v4h4M19 21v-4h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              {refreshing
                ? "Refreshing"
                : "Refresh"}
            </button>
          </div>
        </header>

        {error && (
          <div className="analytics-error">
            <strong>
              Analytics unavailable
            </strong>

            <span>{error}</span>

            <button
              type="button"
              onClick={() =>
                void loadAnalytics(
                  true,
                )
              }
            >
              Try again
            </button>
          </div>
        )}

        {/* =====================================================
            PRIMARY NUMBERS
        ====================================================== */}

        <section className="metrics-grid">
          <article className="metric-card metric-card-dark">
            <div className="metric-icon">
              <StatIcon type="plays" />
            </div>

            <div className="metric-label">
              Total plays
            </div>

            <div className="metric-value">
              {formatNumber(
                analytics?.total_plays,
              )}
            </div>

            <div className="metric-detail">
              All recorded plays
            </div>
          </article>

          <article className="metric-card">
            <div className="metric-icon">
              <StatIcon type="audience" />
            </div>

            <div className="metric-label">
              Unique audience
            </div>

            <div className="metric-value">
              {formatNumber(
                analytics?.unique_listeners,
              )}
            </div>

            <div className="metric-detail">
              People who listened
            </div>
          </article>

          <article className="metric-card">
            <div className="metric-icon">
              <StatIcon type="time" />
            </div>

            <div className="metric-label">
              Listening time
            </div>

            <div className="metric-value metric-value-small">
              {formatDuration(
                totalListening,
              )}
            </div>

            <div className="metric-detail">
              Across recorded sessions
            </div>
          </article>

          <article className="metric-card metric-card-gold">
            <div className="metric-icon">
              <StatIcon type="completion" />
            </div>

            <div className="metric-label">
              Verified completion
            </div>

            <div className="metric-value">
              {formatPercent(
                completionRate,
              )}
            </div>

            <div className="metric-detail">
              {formatNumber(
                analytics?.completions,
              )}{" "}
              verified completions
            </div>
          </article>
        </section>

        {/* =====================================================
            AUDIENCE + RETENTION
        ====================================================== */}

        <section className="two-column-grid">
          <article className="panel audience-panel">
            <div className="panel-heading">
              <div>
                <span className="panel-kicker">
                  YOUR AUDIENCE
                </span>

                <h2>
                  Who is coming back?
                </h2>

                <p>
                  Your audience is more than
                  a play count.
                </p>
              </div>

              <span className="panel-number">
                {formatNumber(
                  audience?.total_listeners ??
                    analytics?.unique_listeners,
                )}
              </span>
            </div>

            <div className="audience-visual">
              <div
                className="audience-donut"
                style={{
                  background: `conic-gradient(
                    #b48a45 0 ${newRate}%,
                    #153848 ${newRate}% 100%
                  )`,
                }}
              >
                <div>
                  <strong>
                    {formatNumber(
                      audience?.total_listeners ??
                        analytics?.unique_listeners,
                    )}
                  </strong>

                  <span>
                    listeners
                  </span>
                </div>
              </div>

              <div className="audience-legend">
                <div>
                  <span className="legend-dot gold" />
                  <div>
                    <strong>
                      {formatPercent(
                        newRate,
                      )}
                    </strong>

                    <span>
                      New listeners
                    </span>
                  </div>
                </div>

                <div>
                  <span className="legend-dot navy" />
                  <div>
                    <strong>
                      {formatPercent(
                        returningRate,
                      )}
                    </strong>

                    <span>
                      Returning listeners
                    </span>
                  </div>
                </div>

                <div className="repeat-stat">
                  <strong>
                    {formatNumber(
                      repeatPlays,
                    )}
                  </strong>

                  <span>
                    repeat plays
                  </span>
                </div>
              </div>
            </div>
          </article>

          <article className="panel retention-panel">
            <div className="panel-heading">
              <div>
                <span className="panel-kicker">
                  LISTENER RETENTION
                </span>

                <h2>
                  How far do they go?
                </h2>

                <p>
                  The deeper the curve,
                  the deeper the attention.
                </p>
              </div>

              <div className="retention-depth">
                <strong>
                  {formatPercent(
                    listeningDepth,
                  )}
                </strong>

                <span>
                  avg. depth
                </span>
              </div>
            </div>

            <RetentionChart
              retention={retention}
            />

            <div className="chart-footnote">
              Based on{" "}
              {formatNumber(
                listening?.retention_sessions,
              )}{" "}
              recorded sessions.
            </div>
          </article>
        </section>

        {/* =====================================================
            LISTENING TIME
        ====================================================== */}

        <section className="panel listening-panel">
          <div className="panel-heading panel-heading-row">
            <div>
              <span className="panel-kicker">
                LISTENING BEHAVIOUR
              </span>

              <h2>
                When your audience listens.
              </h2>

              <p>
                Patterns become more useful
                as your audience grows.
              </p>
            </div>

            <div className="behaviour-summary">
              {topHour &&
                topHour.plays > 0 && (
                  <div>
                    <span>
                      Peak hour
                    </span>

                    <strong>
                      {formatHour(
                        topHour.hour,
                      )}
                    </strong>
                  </div>
                )}

              {topDay &&
                topDay.plays > 0 && (
                  <div>
                    <span>
                      Strongest day
                    </span>

                    <strong>
                      {topDay.day}
                    </strong>
                  </div>
                )}
            </div>
          </div>

          {hours.length ? (
            <HourChart
              hours={hours}
            />
          ) : (
            <EmptyChart message="Listening-time patterns will appear as more activity is recorded." />
          )}

          <div className="hour-insight">
            <div className="insight-pulse">
              <span />
            </div>

            <div>
              <strong>
                {topHour &&
                topHour.plays > 0
                  ? `Your strongest listening window is around ${formatHour(
                      topHour.hour,
                    )}.`
                  : "Your listening pattern is still forming."}
              </strong>

              <span>
                {topHour &&
                topHour.plays > 0
                  ? `${formatNumber(
                      topHour.plays,
                    )} plays were recorded around this hour.`
                  : "Keep publishing and we will surface the pattern here."}
              </span>
            </div>
          </div>
        </section>

        {/* =====================================================
            ACTIVITY
        ====================================================== */}

        <section className="panel activity-panel">
          <div className="panel-heading panel-heading-row">
            <div>
              <span className="panel-kicker">
                MOMENTUM
              </span>

              <h2>
                How your work is moving.
              </h2>

              <p>
                Daily play activity across
                the current reporting period.
              </p>
            </div>

            <div className="activity-total">
              <strong>
                {formatNumber(
                  analytics?.total_plays,
                )}
              </strong>

              <span>
                total plays
              </span>
            </div>
          </div>

          <ActivityChart
            activity={activity}
          />
        </section>

        {/* =====================================================
            DISCOVERY + ATTENTION
        ====================================================== */}

        <section className="three-column-grid">
          <article className="small-panel">
            <span className="panel-kicker">
              CATALOGUE DISCOVERY
            </span>

            <div className="small-panel-value">
              {formatPercent(
                explorationRate,
              )}
            </div>

            <h3>
              People are exploring
              your work.
            </h3>

            <p>
              {formatNumber(
                discovery?.catalogue_explorers,
              )}{" "}
              listeners have explored
              more than one piece of
              your catalogue.
            </p>

            <div className="progress-line">
              <span
                style={{
                  width: `${Math.min(
                    100,
                    explorationRate,
                  )}%`,
                }}
              />
            </div>
          </article>

          <article className="small-panel">
            <span className="panel-kicker">
              AVERAGE SESSION
            </span>

            <div className="small-panel-value">
              {formatDuration(
                averageSession,
              )}
            </div>

            <h3>
              Time spent listening.
            </h3>

            <p>
              This is the average recorded
              listening time per session.
            </p>

            <div className="small-panel-rule" />
          </article>

          <article className="small-panel">
            <span className="panel-kicker">
              VERIFIED COMPLETION
            </span>

            <div className="small-panel-value">
              {formatPercent(
                completionRate,
              )}
            </div>

            <h3>
              Who actually finished?
            </h3>

            <p>
              {formatNumber(
                analytics?.completions,
              )}{" "}
              listeners reached the
              verified completion threshold.
            </p>

            <div className="small-panel-rule gold-rule" />
          </article>
        </section>

        {/* =====================================================
            INTELLIGENCE
        ====================================================== */}

        <section className="intelligence-section">
          <div className="intelligence-heading">
            <div>
              <span className="panel-kicker">
                AUDIENCE INTELLIGENCE
              </span>

              <h2>
                What the numbers are
                telling you.
              </h2>
            </div>

            <p>
              These observations are
              generated from your actual
              listener activity.
            </p>
          </div>

          {insightCards.length ? (
            <div className="insight-grid">
              {insightCards.map(
                (card, index) => (
                  <article
                    className="insight-card"
                    key={`${card.eyebrow}-${index}`}
                  >
                    <span className="insight-number">
                      0{index + 1}
                    </span>

                    <span className="panel-kicker">
                      {card.eyebrow}
                    </span>

                    <h3>
                      {card.title}
                    </h3>

                    <p>
                      {card.body}
                    </p>
                  </article>
                ),
              )}
            </div>
          ) : (
            <div className="intelligence-empty">
              <strong>
                Your audience story is
                still being written.
              </strong>

              <span>
                Publish more work and
                we will turn listener
                activity into useful
                observations here.
              </span>
            </div>
          )}
        </section>

        {/* =====================================================
            SHOWS + EPISODES
        ====================================================== */}

        <section className="two-column-grid bottom-grid">
          <article className="panel catalogue-panel">
            <div className="panel-heading">
              <div>
                <span className="panel-kicker">
                  YOUR SHOWS
                </span>

                <h2>
                  What is performing?
                </h2>
              </div>

              <span className="catalogue-count">
                {shows.length}
              </span>
            </div>

            {shows.length ? (
              <div className="catalogue-list">
                {shows.map(
                  (show) => (
                    <div
                      className="catalogue-row"
                      key={show.show_id}
                    >
                      <div className="catalogue-art">
                        {prettyShowName(
                          show.show_id,
                        ).slice(
                          0,
                          1,
                        )}
                      </div>

                      <div className="catalogue-main">
                        <strong>
                          {prettyShowName(
                            show.show_id,
                          )}
                        </strong>

                        <span>
                          {formatNumber(
                            show.unique_listeners,
                          )}{" "}
                          listeners ·{" "}
                          {formatNumber(
                            show.plays,
                          )}{" "}
                          plays
                        </span>
                      </div>

                      <div className="catalogue-rate">
                        <strong>
                          {formatPercent(
                            show.completion_rate,
                          )}
                        </strong>

                        <span>
                          completion
                        </span>
                      </div>
                    </div>
                  ),
                )}
              </div>
            ) : (
              <EmptyChart message="Your published shows will appear here." />
            )}
          </article>

          <article className="panel catalogue-panel">
            <div className="panel-heading">
              <div>
                <span className="panel-kicker">
                  EPISODES
                </span>

                <h2>
                  Your strongest pieces.
                </h2>
              </div>

              {strongestEpisode && (
                <span className="top-badge">
                  TOP
                </span>
              )}
            </div>

            {episodes.length ? (
              <div className="catalogue-list">
                {episodes
                  .slice(0, 6)
                  .map(
                    (
                      episode,
                      index,
                    ) => (
                      <div
                        className="episode-row"
                        key={`${episode.show_id}-${episode.episode_id}`}
                      >
                        <div className="episode-rank">
                          {String(
                            index + 1,
                          ).padStart(
                            2,
                            "0",
                          )}
                        </div>

                        <div className="catalogue-main">
                          <strong>
                            {prettyEpisodeName(
                              episode.episode_id,
                            )}
                          </strong>

                          <span>
                            {prettyShowName(
                              episode.show_id,
                            )}{" "}
                            ·{" "}
                            {formatNumber(
                              episode.unique_listeners,
                            )}{" "}
                            listeners
                          </span>
                        </div>

                        <div className="episode-plays">
                          <strong>
                            {formatNumber(
                              episode.plays,
                            )}
                          </strong>

                          <span>
                            plays
                          </span>
                        </div>
                      </div>
                    ),
                  )}
              </div>
            ) : (
              <EmptyChart message="Episode performance will appear here." />
            )}
          </article>
        </section>

        {/* =====================================================
            FOOTER NOTE
        ====================================================== */}

        <footer className="analytics-footer">
          <div>
            <span className="footer-mark">
              F
            </span>

            <div>
              <strong>
                FONS Creator Intelligence
              </strong>

              <span>
                Built from real listener
                behaviour, not estimates.
              </span>
            </div>
          </div>

          <span>
            {analytics?.period?.from
              ? `Data from ${new Date(
                  analytics.period.from,
                ).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  },
                )}`
              : "Live analytics"}
          </span>
        </footer>
      </main>

      <style jsx>{`
        .analytics-page {
          min-height: 100vh;
          padding: 42px 46px 70px;
          background: #f6f1e8;
          color: #153848;
        }

        .analytics-header {
          max-width: 1440px;
          margin: 0 auto 38px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 32px;
        }

        .analytics-header-copy {
          max-width: 760px;
        }

        .analytics-kicker,
        .panel-kicker {
          display: block;
          color: #b48a45;
          font-size: 10px;
          line-height: 1;
          font-weight: 850;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .analytics-header h1 {
          margin: 12px 0 16px;
          font-size: clamp(
            42px,
            6vw,
            78px
          );
          line-height: 0.94;
          letter-spacing: -0.055em;
          font-weight: 800;
        }

        .analytics-header h1 em {
          font-family: Georgia, "Times New Roman",
            serif;
          font-weight: 400;
          color: #b48a45;
        }

        .analytics-header p {
          max-width: 590px;
          margin: 0;
          color: #61717b;
          font-size: 17px;
          line-height: 1.65;
        }

        .analytics-meta {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 22px;
          color: #77858c;
          font-size: 12px;
          font-weight: 700;
        }

        .analytics-meta i {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #b48a45;
        }

        .live-status {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #48765e;
        }

        .live-status b {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #4e936f;
          box-shadow: 0 0 0 4px
            rgba(78, 147, 111, 0.12);
        }

        .analytics-header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        .creator-mini {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 9px 12px 9px 9px;
          border: 1px solid rgba(21, 56, 72, 0.1);
          border-radius: 17px;
          background: rgba(255, 255, 255, 0.5);
        }

        .creator-avatar {
          width: 42px;
          height: 42px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border-radius: 13px;
          background: #153848;
          color: #f6f1e8;
          font-size: 12px;
          font-weight: 850;
        }

        .creator-mini div:not(.creator-avatar) {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .creator-mini strong {
          font-size: 13px;
        }

        .creator-mini span {
          color: #7b898f;
          font-size: 11px;
        }

        .refresh-button {
          height: 60px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 0 17px;
          border: 1px solid rgba(21, 56, 72, 0.12);
          border-radius: 17px;
          background: #fffaf2;
          color: #153848;
          font-weight: 750;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .refresh-button:hover {
          transform: translateY(-1px);
          border-color: rgba(180, 138, 69, 0.5);
        }

        .refresh-button:disabled {
          opacity: 0.55;
          cursor: wait;
        }

        .refresh-button svg {
          width: 17px;
          height: 17px;
        }

        .analytics-error {
          max-width: 1440px;
          margin: 0 auto 24px;
          padding: 15px 17px;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          border: 1px solid rgba(160, 70, 50, 0.18);
          border-radius: 16px;
          background: rgba(160, 70, 50, 0.06);
          color: #713d31;
          font-size: 13px;
        }

        .analytics-error span {
          flex: 1;
          color: #8b6259;
        }

        .analytics-error button {
          border: 0;
          border-radius: 10px;
          padding: 8px 12px;
          background: #713d31;
          color: white;
          font-weight: 750;
          cursor: pointer;
        }

        .metrics-grid {
          max-width: 1440px;
          margin: 0 auto 22px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .metric-card {
          min-height: 205px;
          padding: 25px;
          border: 1px solid rgba(21, 56, 72, 0.08);
          border-radius: 25px;
          background: #fffaf2;
          box-shadow: 0 16px 45px
            rgba(21, 56, 72, 0.045);
        }

        .metric-card-dark {
          background: #153848;
          color: #f6f1e8;
          border-color: #153848;
        }

        .metric-card-gold {
          background: #b48a45;
          color: #153848;
          border-color: #b48a45;
        }

        .metric-icon {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          margin-bottom: 26px;
          border-radius: 13px;
          background: rgba(21, 56, 72, 0.08);
        }

        .metric-card-dark .metric-icon {
          background: rgba(246, 241, 232, 0.11);
        }

        .metric-card-gold .metric-icon {
          background: rgba(21, 56, 72, 0.1);
        }

        .metric-icon svg {
          width: 21px;
          height: 21px;
        }

        .metric-label {
          margin-bottom: 7px;
          color: #71818a;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .metric-card-dark .metric-label {
          color: rgba(246, 241, 232, 0.62);
        }

        .metric-card-gold .metric-label {
          color: rgba(21, 56, 72, 0.7);
        }

        .metric-value {
          font-size: clamp(30px, 3vw, 43px);
          line-height: 1;
          letter-spacing: -0.05em;
          font-weight: 800;
        }

        .metric-value-small {
          font-size: clamp(27px, 2.7vw, 39px);
        }

        .metric-detail {
          margin-top: 13px;
          color: #87939a;
          font-size: 12px;
        }

        .metric-card-dark .metric-detail {
          color: rgba(246, 241, 232, 0.56);
        }

        .metric-card-gold .metric-detail {
          color: rgba(21, 56, 72, 0.65);
        }

        .two-column-grid {
          max-width: 1440px;
          margin: 0 auto 22px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 22px;
        }

        .three-column-grid {
          max-width: 1440px;
          margin: 0 auto 22px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
        }

        .panel,
        .small-panel {
          border: 1px solid rgba(21, 56, 72, 0.08);
          border-radius: 27px;
          background: #fffaf2;
          box-shadow: 0 16px 45px
            rgba(21, 56, 72, 0.045);
        }

        .panel {
          padding: 28px;
        }

        .panel-heading {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
        }

        .panel-heading h2 {
          margin: 8px 0 5px;
          font-size: clamp(23px, 2.5vw, 31px);
          line-height: 1.05;
          letter-spacing: -0.04em;
        }

        .panel-heading p {
          margin: 0;
          color: #7c898f;
          font-size: 13px;
          line-height: 1.55;
        }

        .panel-number {
          color: #b48a45;
          font-size: 30px;
          font-weight: 800;
          letter-spacing: -0.05em;
        }

        .audience-visual {
          min-height: 270px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 50px;
          padding: 30px 10px 5px;
        }

        .audience-donut {
          width: 184px;
          height: 184px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border-radius: 50%;
          position: relative;
        }

        .audience-donut::before {
          content: "";
          position: absolute;
          inset: 15px;
          border-radius: 50%;
          background: #fffaf2;
        }

        .audience-donut > div {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .audience-donut strong {
          font-size: 34px;
          line-height: 1;
          letter-spacing: -0.05em;
        }

        .audience-donut span {
          margin-top: 6px;
          color: #7e8a90;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .audience-legend {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .audience-legend > div {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .legend-dot {
          width: 10px;
          height: 10px;
          flex-shrink: 0;
          border-radius: 50%;
        }

        .legend-dot.gold {
          background: #b48a45;
        }

        .legend-dot.navy {
          background: #153848;
        }

        .audience-legend div div {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .audience-legend strong {
          font-size: 18px;
        }

        .audience-legend span {
          color: #7c898f;
          font-size: 11px;
        }

        .repeat-stat {
          margin-top: 5px;
          padding-top: 17px;
          border-top: 1px solid rgba(21, 56, 72, 0.09);
        }

        .repeat-stat strong {
          color: #b48a45;
        }

        .retention-depth {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .retention-depth strong {
          color: #b48a45;
          font-size: 28px;
          line-height: 1;
        }

        .retention-depth span {
          margin-top: 5px;
          color: #7c898f;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .retention-chart-wrap {
          width: 100%;
          overflow: hidden;
          margin-top: 20px;
        }

        .retention-chart {
          width: 100%;
          min-width: 450px;
          height: auto;
          display: block;
        }

        .chart-footnote {
          margin-top: 4px;
          color: #89949a;
          font-size: 11px;
        }

        .panel-heading-row {
          align-items: center;
        }

        .behaviour-summary {
          display: flex;
          gap: 24px;
        }

        .behaviour-summary div {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
        }

        .behaviour-summary span {
          color: #89949a;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .behaviour-summary strong {
          font-size: 18px;
        }

        .hour-chart {
          height: 230px;
          margin-top: 30px;
          display: flex;
          gap: 12px;
        }

        .hour-y-axis {
          width: 24px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 2px 0 26px;
          color: #9aa3a8;
          font-size: 9px;
          text-align: right;
        }

        .hour-bars {
          flex: 1;
          display: flex;
          align-items: flex-end;
          gap: clamp(2px, 0.6vw, 8px);
          padding: 0 2px 0;
          border-bottom: 1px solid rgba(21, 56, 72, 0.1);
        }

        .hour-column {
          height: 100%;
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          gap: 9px;
        }

        .hour-bar {
          width: min(28px, 75%);
          min-height: 4px;
          border-radius: 7px 7px 2px 2px;
          background: #153848;
          transition: height 0.3s ease;
        }

        .hour-column:nth-child(3n)
          .hour-bar {
          background: #b48a45;
        }

        .hour-column span {
          height: 13px;
          color: #89949a;
          font-size: 8px;
        }

        .hour-insight {
          margin-top: 20px;
          padding: 15px 17px;
          display: flex;
          align-items: center;
          gap: 13px;
          border-radius: 16px;
          background: rgba(180, 138, 69, 0.08);
        }

        .insight-pulse {
          width: 30px;
          height: 30px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: rgba(180, 138, 69, 0.15);
        }

        .insight-pulse span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #b48a45;
        }

        .hour-insight div:last-child {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .hour-insight strong {
          font-size: 13px;
        }

        .hour-insight span {
          color: #7c898f;
          font-size: 11px;
        }

        .activity-panel {
          margin-bottom: 22px;
        }

        .activity-total {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .activity-total strong {
          color: #b48a45;
          font-size: 28px;
          line-height: 1;
        }

        .activity-total span {
          margin-top: 5px;
          color: #89949a;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .activity-chart {
          min-height: 220px;
          margin-top: 28px;
          padding: 0 6px;
          display: flex;
          align-items: flex-end;
          gap: 10px;
          overflow-x: auto;
          border-bottom: 1px solid rgba(21, 56, 72, 0.1);
        }

        .activity-column {
          flex: 1;
          min-width: 46px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .activity-bar-track {
          height: 180px;
          width: 100%;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }

        .activity-bar {
          width: min(34px, 70%);
          min-height: 4px;
          border-radius: 8px 8px 2px 2px;
          background: #b48a45;
        }

        .activity-column span {
          padding-bottom: 10px;
          color: #89949a;
          font-size: 9px;
          white-space: nowrap;
        }

        .small-panel {
          padding: 25px;
          min-height: 260px;
        }

        .small-panel-value {
          margin-top: 24px;
          color: #153848;
          font-size: clamp(36px, 4vw, 54px);
          line-height: 1;
          font-weight: 800;
          letter-spacing: -0.06em;
        }

        .small-panel h3 {
          margin: 14px 0 7px;
          font-size: 18px;
          letter-spacing: -0.02em;
        }

        .small-panel p {
          max-width: 340px;
          margin: 0;
          color: #7c898f;
          font-size: 12px;
          line-height: 1.65;
        }

        .progress-line {
          height: 5px;
          margin-top: 28px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(21, 56, 72, 0.08);
        }

        .progress-line span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: #b48a45;
        }

        .small-panel-rule {
          width: 100%;
          height: 5px;
          margin-top: 28px;
          border-radius: 999px;
          background: #153848;
        }

        .gold-rule {
          background: #b48a45;
        }

        .intelligence-section {
          max-width: 1440px;
          margin: 0 auto 22px;
          padding: 34px;
          border-radius: 29px;
          background: #153848;
          color: #f6f1e8;
        }

        .intelligence-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 30px;
          margin-bottom: 25px;
        }

        .intelligence-heading .panel-kicker {
          color: #b48a45;
        }

        .intelligence-heading h2 {
          margin: 9px 0 0;
          max-width: 600px;
          font-size: clamp(28px, 4vw, 44px);
          line-height: 1;
          letter-spacing: -0.05em;
        }

        .intelligence-heading p {
          max-width: 330px;
          margin: 0;
          color: rgba(246, 241, 232, 0.58);
          font-size: 12px;
          line-height: 1.65;
        }

        .insight-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .insight-card {
          min-height: 225px;
          padding: 21px;
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(246, 241, 232, 0.1);
          border-radius: 20px;
          background: rgba(246, 241, 232, 0.055);
        }

        .insight-number {
          margin-bottom: 34px;
          color: rgba(246, 241, 232, 0.22);
          font-size: 12px;
          font-weight: 800;
        }

        .insight-card .panel-kicker {
          color: rgba(246, 241, 232, 0.48);
          font-size: 9px;
        }

        .insight-card h3 {
          margin: 9px 0 8px;
          font-size: 18px;
          line-height: 1.2;
          letter-spacing: -0.025em;
        }

        .insight-card p {
          margin: 0;
          color: rgba(246, 241, 232, 0.58);
          font-size: 11px;
          line-height: 1.65;
        }

        .intelligence-empty {
          padding: 24px;
          border: 1px solid rgba(246, 241, 232, 0.1);
          border-radius: 18px;
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .intelligence-empty span {
          color: rgba(246, 241, 232, 0.58);
          font-size: 12px;
        }

        .bottom-grid {
          margin-bottom: 28px;
        }

        .catalogue-count {
          min-width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: rgba(180, 138, 69, 0.12);
          color: #b48a45;
          font-size: 12px;
          font-weight: 800;
        }

        .top-badge {
          padding: 7px 9px;
          border-radius: 9px;
          background: rgba(180, 138, 69, 0.14);
          color: #a47735;
          font-size: 9px;
          font-weight: 850;
          letter-spacing: 0.1em;
        }

        .catalogue-list {
          margin-top: 25px;
          display: flex;
          flex-direction: column;
        }

        .catalogue-row,
        .episode-row {
          min-height: 70px;
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 11px 0;
          border-top: 1px solid rgba(21, 56, 72, 0.08);
        }

        .catalogue-art {
          width: 43px;
          height: 43px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: #153848;
          color: #f6f1e8;
          font-weight: 800;
        }

        .catalogue-main {
          min-width: 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .catalogue-main strong {
          overflow: hidden;
          color: #153848;
          font-size: 13px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .catalogue-main span {
          overflow: hidden;
          color: #89949a;
          font-size: 10px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .catalogue-rate,
        .episode-plays {
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
        }

        .catalogue-rate strong,
        .episode-plays strong {
          color: #b48a45;
          font-size: 14px;
        }

        .catalogue-rate span,
        .episode-plays span {
          color: #89949a;
          font-size: 9px;
        }

        .episode-rank {
          width: 34px;
          flex-shrink: 0;
          color: #a5adb1;
          font-size: 11px;
          font-weight: 800;
        }

        .analytics-empty {
          min-height: 180px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #89949a;
          text-align: center;
          font-size: 12px;
        }

        .analytics-empty-mark {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: rgba(21, 56, 72, 0.06);
          color: #b48a45;
          font-weight: 900;
        }

        .analytics-footer {
          max-width: 1440px;
          margin: 0 auto;
          padding-top: 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          color: #89949a;
          font-size: 10px;
        }

        .analytics-footer > div {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .footer-mark {
          width: 29px;
          height: 29px;
          display: grid;
          place-items: center;
          border-radius: 9px;
          background: #153848;
          color: #f6f1e8;
          font-weight: 800;
        }

        .analytics-footer > div > div {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .analytics-footer strong {
          color: #153848;
          font-size: 11px;
        }

        @media (max-width: 1180px) {
          .analytics-page {
            padding: 34px 28px 60px;
          }

          .metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .insight-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .three-column-grid {
            grid-template-columns: 1fr 1fr;
          }

          .three-column-grid
            .small-panel:last-child {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 860px) {
          .analytics-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .analytics-header-actions {
            width: 100%;
            justify-content: space-between;
          }

          .two-column-grid {
            grid-template-columns: 1fr;
          }

          .audience-visual {
            justify-content: flex-start;
          }

          .intelligence-heading {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (max-width: 640px) {
          .analytics-page {
            padding: 25px 15px 45px;
          }

          .analytics-header {
            margin-bottom: 25px;
          }

          .analytics-header h1 {
            font-size: 46px;
          }

          .analytics-header p {
            font-size: 14px;
          }

          .analytics-header-actions {
            align-items: stretch;
            flex-direction: column;
          }

          .creator-mini {
            width: 100%;
          }

          .refresh-button {
            width: 100%;
            justify-content: center;
          }

          .metrics-grid {
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }

          .metric-card {
            min-height: 166px;
            padding: 18px;
            border-radius: 19px;
          }

          .metric-icon {
            width: 36px;
            height: 36px;
            margin-bottom: 19px;
          }

          .metric-value {
            font-size: 29px;
          }

          .metric-value-small {
            font-size: 25px;
          }

          .metric-detail {
            font-size: 10px;
          }

          .panel {
            padding: 20px;
            border-radius: 21px;
          }

          .panel-heading h2 {
            font-size: 24px;
          }

          .audience-visual {
            min-height: auto;
            flex-direction: column;
            gap: 25px;
            padding-top: 25px;
          }

          .audience-donut {
            width: 155px;
            height: 155px;
          }

          .audience-legend {
            width: 100%;
          }

          .retention-chart {
            min-width: 410px;
          }

          .panel-heading-row {
            align-items: flex-start;
            flex-direction: column;
          }

          .behaviour-summary {
            width: 100%;
            justify-content: space-between;
          }

          .behaviour-summary div {
            align-items: flex-start;
          }

          .hour-chart {
            height: 200px;
          }

          .three-column-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .three-column-grid
            .small-panel:last-child {
            grid-column: auto;
          }

          .small-panel {
            min-height: 220px;
            border-radius: 21px;
          }

          .intelligence-section {
            padding: 22px;
            border-radius: 22px;
          }

          .insight-grid {
            grid-template-columns: 1fr;
          }

          .insight-card {
            min-height: 185px;
          }

          .analytics-footer {
            align-items: flex-start;
            flex-direction: column;
          }

          .analytics-footer > span {
            padding-left: 39px;
          }
        }

        @media (max-width: 390px) {
          .metrics-grid {
            grid-template-columns: 1fr;
          }

          .metric-card {
            min-height: 145px;
          }

          .analytics-header h1 {
            font-size: 40px;
          }
        }
      `}</style>
    </DashboardLayout>
  );
}