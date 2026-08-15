"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  Headphones,
  MoreHorizontal,
  Play,
  Share2,
  Users,
  Radio,
  Sparkles,
} from "lucide-react";

import { API_URL } from "@/config/api";

type Episode = {
  project_id?: string;
  episode: string;
  title: string;
  published_at?: string;
  duration?: number;
  show: string;
  programme?: string;
  season?: number;
  episode_number?: number;
  episode_title?: string;
  programme_title?: string;
  audio_url?: string;
};

type Programme = {
  id: string;
  title: string;
  seasons?: Array<{
    id: string;
    title: string;
    season_number: number;
    episodes: Episode[];
  }>;
};

type Show = {
  id: string;
  title: string;
  programmes?: Programme[];
  episodes?: Episode[];
  episode_count?: number;
  programme_count?: number;
  season_count?: number;
};

type ActivityPoint = {
  date: string;
  plays: number;
  unique_listeners: number;
  completions: number;
  downloads: number;
};

type AnalyticsEpisode = {
  episode_id: string;
  show_id: string;
  plays: number;
  unique_listeners: number;
  completions: number;
  downloads: number;
};

type RecentActivity = {
  event_type: string;
  listener_id: string;
  show_id: string;
  episode_id: string;
  position: number;
  duration: number;
  occurred_at: string;
};

type Analytics = {
  creator_id: string;
  total_plays: number;
  unique_listeners: number;
  downloads: number;
  completions: number;
  listening_seconds: number;
  completion_rate?: number;

  period?: {
    days: number;
    from: string;
    to: string;
  };

  activity?: ActivityPoint[];

  shows?: Array<{
    show_id: string;
    plays: number;
    unique_listeners: number;
    completions: number;
    downloads: number;
  }>;

  episodes?: AnalyticsEpisode[];

  recent_activity?: RecentActivity[];
};


/* ============================================================
   HELPERS
   ============================================================ */

function formatDuration(seconds?: number) {
  if (!seconds || seconds <= 0) {
    return "—";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    return `${hours}h ${mins}m`;
  }

  return `${minutes}m ${remainingSeconds}s`;
}


function formatListeningTime(seconds: number) {
  if (!seconds || seconds <= 0) {
    return "0m";
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor(
    (seconds % 3600) / 60,
  );

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
}


function formatDate(date?: string) {
  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}


function formatTime(date?: string) {
  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}


function eventLabel(event: string) {
  switch (event) {
    case "play":
      return "Played";

    case "pause":
      return "Paused";

    case "resume":
      return "Resumed";

    case "complete":
      return "Completed";

    case "download":
      return "Downloaded";

    default:
      return event.replace(/_/g, " ");
  }
}


function getToken() {
  if (typeof window === "undefined") {
    return "";
  }

  return (
    localStorage.getItem("access_token") ||
    localStorage.getItem("token") ||
    ""
  );
}


/*
 * Show artwork is deliberately data-driven.
 *
 * Kyamagero Daily has its real artwork asset.
 * Other shows do not get a fake image.
 *
 * When Man Cave UG is published and its real artwork
 * is available, add that real asset here.
 */
function showArtwork(showId: string) {
  if (showId === "kyamagero-daily") {
    return "/kd-logo.png";
  }

  return null;
}


function showInitials(title: string) {
  const words = title
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}


/* ============================================================
   PERFORMANCE CHART
   ============================================================ */

function PerformanceChart({
  activity,
}: {
  activity: ActivityPoint[];
}) {
  if (!activity.length) {
    return (
      <div className="creator-chart-empty">
        <BarChart3 size={28} />

        <span>
          Performance data will appear as your
          audience grows.
        </span>
      </div>
    );
  }

  const width = 900;
  const height = 260;
  const padding = 24;

  const maxValue = Math.max(
    1,
    ...activity.map(
      (point) => point.plays,
    ),
  );

  const points = activity.map(
    (point, index) => {
      const x =
        activity.length === 1
          ? width / 2
          : padding +
            (index /
              (activity.length - 1)) *
              (width - padding * 2);

      const y =
        height -
        padding -
        (point.plays / maxValue) *
          (height - padding * 2);

      return `${x},${y}`;
    },
  );

  const areaPoints = [
    `${padding},${height - padding}`,
    ...points,
    `${width - padding},${height - padding}`,
  ].join(" ");

  return (
    <div className="creator-chart">

      <div className="creator-chart-top">

        <div>
          <span className="creator-micro-label">
            LISTENING PERFORMANCE
          </span>

          <strong>
            {activity.reduce(
              (sum, item) =>
                sum + item.plays,
              0,
            )}
          </strong>

          <span>
            {" "}
            plays recorded
          </span>
        </div>

        <div className="creator-chart-period">
          Last 30 days
        </div>

      </div>


      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="creator-chart-svg"
        preserveAspectRatio="none"
      >

        <defs>
          <linearGradient
            id="fonsChartFill"
            x1="0"
            x2="0"
            y1="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="rgba(180,138,69,.28)"
            />

            <stop
              offset="100%"
              stopColor="rgba(180,138,69,0)"
            />
          </linearGradient>
        </defs>


        {[0.25, 0.5, 0.75].map(
          (ratio) => (
            <line
              key={ratio}
              x1={padding}
              x2={width - padding}
              y1={height * ratio}
              y2={height * ratio}
              stroke="rgba(18,58,74,.08)"
              strokeWidth="1"
            />
          ),
        )}


        <polygon
          points={areaPoints}
          fill="url(#fonsChartFill)"
        />


        <polyline
          points={points.join(" ")}
          fill="none"
          stroke="#B48A45"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />


        {points.map(
          (point, index) => {
            const [x, y] =
              point.split(",");

            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="5"
                fill="#F8F5EF"
                stroke="#B48A45"
                strokeWidth="3"
              />
            );
          },
        )}

      </svg>


      <div className="creator-chart-labels">
        {activity
          .slice(-6)
          .map((point) => (
            <span key={point.date}>
              {point.date.slice(5)}
            </span>
          ))}
      </div>

    </div>
  );
}


/* ============================================================
   STAT CARD
   ============================================================ */

function StatCard({
  icon,
  label,
  value,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  detail?: string;
}) {
  return (
    <div className="creator-stat-card">

      <div className="creator-stat-icon">
        {icon}
      </div>

      <div className="creator-stat-copy">

        <span>
          {label}
        </span>

        <strong>
          {value}
        </strong>

        {detail && (
          <small>
            {detail}
          </small>
        )}

      </div>

    </div>
  );
}


/* ============================================================
   CREATOR PAGE
   ============================================================ */

export default function CreatorPage() {
  const [shows, setShows] =
    useState<Show[]>([]);

  const [analytics, setAnalytics] =
    useState<Analytics | null>(null);

  const [
    loadingShows,
    setLoadingShows,
  ] = useState(true);

  const [
    loadingAnalytics,
    setLoadingAnalytics,
  ] = useState(true);

  const [
    isAuthenticated,
    setIsAuthenticated,
  ] = useState(false);

  const [showError, setShowError] =
    useState("");

  const [
    analyticsError,
    setAnalyticsError,
  ] = useState("");


  /* ==========================================================
     LOAD SHOWS
     ========================================================== */

  useEffect(() => {
    let mounted = true;

    async function loadShows() {
      try {
        const response = await fetch(
          `${API_URL}/shows/`,
          {
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error(
            "Unable to load shows.",
          );
        }

        const data =
          await response.json();

        if (mounted) {
          setShows(
            Array.isArray(data)
              ? data
              : [],
          );
        }
      } catch {
        if (mounted) {
          setShowError(
            "Unable to load published shows.",
          );
        }
      } finally {
        if (mounted) {
          setLoadingShows(false);
        }
      }
    }

    loadShows();

    return () => {
      mounted = false;
    };
  }, []);


  /* ==========================================================
     LOAD CREATOR ANALYTICS
     ========================================================== */

  useEffect(() => {
    let mounted = true;

    async function loadAnalytics() {
      const token = getToken();

      if (!token) {
        if (mounted) {
          setIsAuthenticated(false);
          setLoadingAnalytics(false);
          setAnalyticsError("");
        }

        return;
      }

      setIsAuthenticated(true);

      try {
        const response = await fetch(
          `${API_URL}/creator-analytics/me`,
          {
            cache: "no-store",
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          },
        );

        if (
          response.status === 401 ||
          response.status === 403
        ) {
          localStorage.removeItem(
            "access_token",
          );

          localStorage.removeItem(
            "token",
          );

          localStorage.removeItem(
            "creator",
          );

          if (mounted) {
            setIsAuthenticated(false);
            setAnalyticsError("");
          }

          return;
        }

        if (!response.ok) {
          throw new Error(
            "Unable to load analytics.",
          );
        }

        const data: Analytics =
          await response.json();

        if (mounted) {
          setAnalytics(data);
          setAnalyticsError("");
        }
      } catch {
        if (mounted) {
          setAnalyticsError(
            "Analytics are temporarily unavailable.",
          );
        }
      } finally {
        if (mounted) {
          setLoadingAnalytics(false);
        }
      }
    }

    loadAnalytics();

    return () => {
      mounted = false;
    };
  }, []);


  /* ==========================================================
     DERIVED CONTENT
     ========================================================== */

  const allEpisodes = useMemo(() => {
    const episodes: Episode[] = [];

    for (const show of shows) {

      if (show.episodes?.length) {
        episodes.push(
          ...show.episodes,
        );
      }

      for (
        const programme of
          show.programmes || []
      ) {
        for (
          const season of
            programme.seasons || []
        ) {
          episodes.push(
            ...season.episodes,
          );
        }
      }
    }


    const unique =
      new Map<string, Episode>();

    for (const episode of episodes) {
      const key =
        `${episode.show}-${episode.episode}`;

      if (!unique.has(key)) {
        unique.set(
          key,
          episode,
        );
      }
    }


    return Array.from(
      unique.values(),
    ).sort((a, b) => {
      const first =
        a.published_at
          ? new Date(
              a.published_at,
            ).getTime()
          : 0;

      const second =
        b.published_at
          ? new Date(
              b.published_at,
            ).getTime()
          : 0;

      return second - first;
    });

  }, [shows]);


  const totalEpisodes =
    useMemo(
      () =>
        shows.reduce(
          (sum, show) =>
            sum +
            (show.episode_count ||
              0),
          0,
        ),
      [shows],
    );


  const totalShows =
    shows.length;


  const totalProgrammes =
    useMemo(
      () =>
        shows.reduce(
          (sum, show) =>
            sum +
            (show.programme_count ||
              0),
          0,
        ),
      [shows],
    );


  const totalListening =
    analytics
      ? formatListeningTime(
          analytics.listening_seconds,
        )
      : "—";


  /* ==========================================================
     ACTIONS
     ========================================================== */

  function playLatest() {
    const audio =
      document.querySelector(
        ".creator-page audio",
      ) as HTMLAudioElement | null;

    audio
      ?.play()
      .catch(() => {});
  }


  async function shareCreator() {
    try {
      await navigator.share({
        title:
          "Andrew Kyamagero on FONS",

        text:
          "Explore Andrew Kyamagero's work on FONS.",

        url:
          window.location.href,
      });
    } catch {
      // Share cancelled or unavailable.
    }
  }


  /* ==========================================================
     RENDER
     ========================================================== */

  return (
    <main className="creator-page">

      {/* ======================================================
          HERO
          ====================================================== */}

      <section className="creator-hero">

        <div
          className="creator-hero-glow creator-glow-one"
        />

        <div
          className="creator-hero-glow creator-glow-two"
        />


        <div className="creator-shell">

          <div className="creator-nav">

            <Link
              href="/dashboard"
              className="creator-back"
            >
              <ArrowLeft size={17} />
              FONS
            </Link>


            <div className="creator-nav-right">

              <span>
                CREATOR
              </span>

              <button
                type="button"
                className="creator-light-icon"
                aria-label="Creator options"
              >
                <MoreHorizontal
                  size={20}
                />
              </button>

            </div>

          </div>


          <div className="creator-hero-main">

            <div className="creator-avatar-large">
              AK
            </div>


            <div className="creator-hero-copy">

              <div className="creator-kicker">
                FONS CREATOR
              </div>


              <h1>
                Andrew Kyamagero
              </h1>


              <p>
                Journalist, broadcaster,
                public speaker and storyteller
                creating conversations that inform,
                challenge perspectives and inspire action.
              </p>


              <div className="creator-hero-actions">

                <button
                  type="button"
                  className="creator-primary-button"
                  onClick={playLatest}
                >
                  <Play
                    size={17}
                    fill="currentColor"
                  />

                  Play latest
                </button>


                <button
                  type="button"
                  className="creator-secondary-button"
                  onClick={shareCreator}
                >
                  <Share2 size={17} />

                  Share
                </button>


                <button
                  type="button"
                  className="creator-secondary-button"
                >
                  Follow
                </button>


                {/* ==================================================
                    CREATOR-ONLY ANALYTICS ACCESS

                    Public visitors do not need to see a broken
                    analytics destination. Once authenticated,
                    Andrew gets direct access to his private
                    creator analytics.
                    ================================================== */}

                {isAuthenticated && (
                  <Link
                    href="/analytics"
                    className="creator-analytics-button"
                  >
                    <BarChart3
                      size={17}
                    />

                    Analytics
                  </Link>
                )}

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ========================================================
          CREATOR CONTENT
          ======================================================== */}

      <div className="creator-shell creator-body">


        {/* ======================================================
            QUICK STATS
            ====================================================== */}

        <section className="creator-stat-grid">

          <StatCard
            icon={
              <Headphones
                size={19}
              />
            }
            label="Plays"
            value={
              loadingAnalytics
                ? "…"
                : analytics?.total_plays ??
                  "—"
            }
            detail="All recorded plays"
          />


          <StatCard
            icon={
              <Users
                size={19}
              />
            }
            label="Listeners"
            value={
              loadingAnalytics
                ? "…"
                : analytics?.unique_listeners ??
                  "—"
            }
            detail="Unique listeners"
          />


          <StatCard
            icon={
              <CheckCircle2
                size={19}
              />
            }
            label="Completions"
            value={
              loadingAnalytics
                ? "…"
                : analytics?.completions ??
                  "—"
            }
            detail="Recorded completion events"
          />


          <StatCard
            icon={
              <Clock3
                size={19}
              />
            }
            label="Listening time"
            value={
              loadingAnalytics
                ? "…"
                : totalListening
            }
            detail="Across recorded sessions"
          />

        </section>


        {/* ======================================================
            CREATOR ANALYTICS PREVIEW
            ====================================================== */}

        <section className="creator-performance">

          <div className="creator-section-heading">

            <div>

              <span className="creator-section-label">
                YOUR AUDIENCE
              </span>

              <h2>
                How your work is moving.
              </h2>

            </div>


            <div className="creator-performance-actions">

              <div className="creator-live-pill">
                <span />
                LIVE
              </div>


              {isAuthenticated && (
                <Link
                  href="/analytics"
                  className="creator-inline-analytics"
                >
                  <BarChart3
                    size={16}
                  />

                  View full analytics

                  <ArrowRight
                    size={15}
                  />
                </Link>
              )}

            </div>

          </div>


          {analyticsError ? (
            <div className="creator-analytics-message">

              <Sparkles size={20} />

              <span>
                {analyticsError}
              </span>

            </div>
          ) : (
            <PerformanceChart
              activity={
                analytics?.activity ||
                []
              }
            />
          )}

        </section>


        {/* ======================================================
            SHOWS
            ====================================================== */}

        <section className="creator-section">

          <div className="creator-section-heading">

            <div>

              <span className="creator-section-label">
                PUBLISHED WORK
              </span>

              <h2>
                Andrew's shows.
              </h2>

            </div>


            <span className="creator-count">
              {loadingShows
                ? "Loading…"
                : `${totalShows} show${
                    totalShows === 1
                      ? ""
                      : "s"
                  }`}
            </span>

          </div>


          {showError && (
            <div className="creator-error-card">
              {showError}
            </div>
          )}


          {!loadingShows &&
            !showError &&
            shows.length === 0 && (
              <div className="creator-empty-card">

                <Radio size={28} />

                <h3>
                  No published shows yet.
                </h3>

                <p>
                  Shows will appear here
                  automatically when they
                  are published to FONS.
                </p>

              </div>
            )}


          <div className="creator-show-grid">

            {shows.map((show) => {

              const performance =
                analytics?.shows?.find(
                  (item) =>
                    item.show_id ===
                    show.id,
                );

              const artwork =
                showArtwork(
                  show.id,
                );


              return (
                <Link
                  key={show.id}
                  href={`/shows/${show.id}`}
                  className="creator-show-card-new"
                >

                  <div className="creator-show-image">

                    {artwork ? (
                      <img
                        src={artwork}
                        alt={show.title}
                      />
                    ) : (
                      <div
                        className="creator-show-fallback-art"
                        aria-label={`${show.title} artwork`}
                      >
                        {showInitials(
                          show.title,
                        )}
                      </div>
                    )}


                    <div className="creator-show-play">

                      <Play
                        size={20}
                        fill="currentColor"
                      />

                    </div>

                  </div>


                  <div className="creator-show-card-body">

                    <span className="creator-show-type">
                      SHOW
                    </span>


                    <h3>
                      {show.title}
                    </h3>


                    <p>
                      {show.programme_count ||
                        0}{" "}
                      programme
                      {show.programme_count ===
                      1
                        ? ""
                        : "s"}{" "}
                      ·{" "}
                      {show.episode_count ||
                        0}{" "}
                      episode
                      {show.episode_count ===
                      1
                        ? ""
                        : "s"}
                    </p>


                    <div className="creator-show-bottom">

                      <span>
                        {performance
                          ? `${performance.plays} plays`
                          : "Published work"}
                      </span>

                      <ArrowRight
                        size={18}
                      />

                    </div>

                  </div>

                </Link>
              );
            })}

          </div>

        </section>


        {/* ======================================================
            LATEST EPISODES
            ====================================================== */}

        <section className="creator-section">

          <div className="creator-section-heading">

            <div>

              <span className="creator-section-label">
                LATEST
              </span>

              <h2>
                From Andrew.
              </h2>

            </div>


            <span className="creator-count">
              {totalEpisodes} published
            </span>

          </div>


          {allEpisodes.length === 0 ? (

            <div className="creator-empty-card">

              <Headphones size={28} />

              <h3>
                No episodes yet.
              </h3>

              <p>
                Published episodes will
                appear here.
              </p>

            </div>

          ) : (

            <div className="creator-episode-list">

              {allEpisodes
                .slice(0, 10)
                .map(
                  (
                    episode,
                    index,
                  ) => {

                    const performance =
                      analytics?.episodes?.find(
                        (item) =>
                          item.show_id ===
                            episode.show &&
                          item.episode_id ===
                            episode.episode,
                      );

                    const artwork =
                      showArtwork(
                        episode.show,
                      );


                    return (
                      <article
                        className="creator-episode-row-new"
                        key={`${episode.show}-${episode.episode}`}
                      >

                        <div className="creator-episode-index">
                          {String(
                            index + 1,
                          ).padStart(
                            2,
                            "0",
                          )}
                        </div>


                        {artwork ? (
                          <img
                            className="creator-episode-art"
                            src={artwork}
                            alt=""
                          />
                        ) : (
                          <div className="creator-episode-art creator-episode-fallback-art">
                            {showInitials(
                              episode.show,
                            )}
                          </div>
                        )}


                        <div className="creator-episode-copy-new">

                          <span>
                            {episode.programme_title ||
                              episode.programme ||
                              episode.show}
                          </span>


                          <h3>
                            {episode.episode_title ||
                              episode.title}
                          </h3>


                          <small>

                            {episode.published_at &&
                              formatDate(
                                episode.published_at,
                              )}

                            {episode.duration
                              ? ` · ${formatDuration(
                                  episode.duration,
                                )}`
                              : ""}

                          </small>

                        </div>


                        <div className="creator-episode-performance">

                          {performance ? (
                            <>
                              <strong>
                                {
                                  performance.plays
                                }
                              </strong>

                              <span>
                                plays
                              </span>
                            </>
                          ) : (
                            <span>
                              Published
                            </span>
                          )}

                        </div>


                        <div className="creator-episode-player">

                          {episode.audio_url && (
                            <audio
                              controls
                              preload="none"
                              src={`${API_URL}${episode.audio_url}`}
                            />
                          )}

                        </div>

                      </article>
                    );
                  },
                )}

            </div>
          )}

        </section>


        {/* ======================================================
            PROGRAMMES
            ====================================================== */}

        {shows.map((show) =>
          (
            show.programmes || []
          ).map((programme) => {

            const programmeEpisodes =
              programme.seasons?.flatMap(
                (season) =>
                  season.episodes,
              ) || [];


            return (
              <section
                className="creator-section"
                key={`${show.id}-${programme.id}`}
              >

                <div className="creator-programme-banner">

                  <div>

                    <span className="creator-section-label">
                      PROGRAMME
                    </span>

                    <h2>
                      {programme.title}
                    </h2>

                    <p>
                      Part of{" "}
                      {show.title},
                      published through
                      FONS.
                    </p>

                  </div>


                  <div className="creator-programme-number">

                    {programmeEpisodes.length}

                    <span>
                      episodes
                    </span>

                  </div>

                </div>

              </section>
            );
          }),
        )}


        {/* ======================================================
            RECENT ACTIVITY
            ====================================================== */}

        {analytics?.recent_activity &&
          analytics.recent_activity.length >
            0 && (

            <section className="creator-section">

              <div className="creator-section-heading">

                <div>

                  <span className="creator-section-label">
                    CREATOR INTELLIGENCE
                  </span>

                  <h2>
                    Recent activity.
                  </h2>

                </div>


                {isAuthenticated && (
                  <Link
                    href="/analytics"
                    className="creator-activity-link"
                  >
                    <BarChart3
                      size={18}
                    />

                    Full analytics
                  </Link>
                )}

              </div>


              <div className="creator-activity-card">

                {analytics.recent_activity
                  .slice(0, 8)
                  .map(
                    (
                      event,
                      index,
                    ) => (

                      <div
                        className="creator-activity-row"
                        key={`${event.occurred_at}-${index}`}
                      >

                        <div className="creator-activity-dot">

                          {event.event_type ===
                          "complete" ? (
                            <CheckCircle2
                              size={15}
                            />
                          ) : (
                            <Play
                              size={13}
                              fill="currentColor"
                            />
                          )}

                        </div>


                        <div className="creator-activity-copy">

                          <strong>
                            {eventLabel(
                              event.event_type,
                            )}
                          </strong>

                          <span>
                            {event.show_id}
                            {" · "}
                            Episode{" "}
                            {
                              event.episode_id
                            }
                          </span>

                        </div>


                        <time>
                          {formatTime(
                            event.occurred_at,
                          )}
                        </time>

                      </div>
                    ),
                  )}

              </div>

            </section>
          )}


        {/* ======================================================
            CREATOR FOOTER
            ====================================================== */}

        <section className="creator-closing">

          <div>

            <span className="creator-section-label">
              FONS CREATOR
            </span>

            <h2>
              Your work is becoming
              <br />
              part of the record.
            </h2>

            <p>
              Every conversation you publish
              can become something people return
              to, discover and share.
            </p>

          </div>


          <div className="creator-closing-stats">

            <div>
              <strong>
                {totalShows}
              </strong>

              <span>
                shows
              </span>
            </div>


            <div>
              <strong>
                {totalProgrammes}
              </strong>

              <span>
                programmes
              </span>
            </div>


            <div>
              <strong>
                {totalEpisodes}
              </strong>

              <span>
                episodes
              </span>
            </div>


            {analytics && (
              <div>

                <strong>
                  {analytics.downloads}
                </strong>

                <span>
                  downloads
                </span>

              </div>
            )}

          </div>

        </section>

      </div>

    </main>
  );
}