"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import Link from "next/link";

import { API_URL } from "@/config/api";
import PlayerBar from "@/components/player/PlayerBar";


// ==========================================================
// SHOW CONFIGURATION
// ==========================================================

const SHOW = "kyamagero-daily";

const KD_LOGO = "/kd-logo.png";

const CREATOR_IMAGE =
  "/creators/kyamagero.png";

const CREATOR_ID =
  process.env.NEXT_PUBLIC_KYAMAGERO_CREATOR_ID ||
  "andrew";


// ==========================================================
// LISTENER ID
// ==========================================================

const LISTENER_ID_KEY =
  "fons_listener_id";

const LISTENER_NAME_KEY =
  "fons_listener_name";


function getListenerId(): string {

  if (
    typeof window === "undefined"
  ) {
    return "";
  }

  let id =
    localStorage.getItem(
      LISTENER_ID_KEY,
    );

  if (!id) {

    id =
      crypto.randomUUID?.() ??
      `listener-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}`;

    localStorage.setItem(
      LISTENER_ID_KEY,
      id,
    );
  }

  return id;
}


function getListenerName(): string {

  if (
    typeof window === "undefined"
  ) {
    return "";
  }

  return (
    localStorage.getItem(
      LISTENER_NAME_KEY,
    ) || ""
  );
}


function saveListenerName(
  name: string,
) {

  if (
    typeof window === "undefined"
  ) {
    return;
  }

  localStorage.setItem(
    LISTENER_NAME_KEY,
    name.trim(),
  );
}


// ==========================================================
// TYPES
// ==========================================================

type Episode = {

  project_id?: string;

  episode: string;

  title: string;

  published_at: string;

  audio?: string;

  audio_url?: string;

  audio_filename?: string;

  duration?: number;

  show?: string;

  programme?: string;

  programme_id?: string;

  programme_title?: string;

  season?: number;

  season_id?: string;

  season_title?: string;

  episode_number?: number;

  episode_title?: string;
};


type ShowResponse = {

  id?: string;

  title?: string;

  episodes?: Episode[];

  programmes?: unknown[];

  episode_count?: number;

  programme_count?: number;
};


type Comment = {

  id: number;

  episode_id: string;

  show_id: string;

  creator_id: string;

  author_type: string;

  author_id: string;

  author_name: string;

  body: string;

  parent_id: number | null;

  created_at: string;

  updated_at: string;
};


type CommentsResponse = {

  episode_id: string;

  comments: Comment[];
};


// ==========================================================
// MAIN PAGE
// ==========================================================

export default function KyamageroDailyPage() {

  const [
    episodes,
    setEpisodes,
  ] = useState<Episode[]>([]);


  const [
    selectedEpisode,
    setSelectedEpisode,
  ] =
    useState<Episode | null>(null);


  const [
    isPlaying,
    setIsPlaying,
  ] = useState(false);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");


  const [
    following,
    setFollowing,
  ] = useState(false);


  // ========================================================
  // COMMENTS
  // ========================================================

  const [
    comments,
    setComments,
  ] = useState<Comment[]>([]);


  const [
    commentsLoading,
    setCommentsLoading,
  ] = useState(false);


  const [
    commentsError,
    setCommentsError,
  ] = useState("");


  const [
    listenerName,
    setListenerName,
  ] = useState("");


  const [
    commentBody,
    setCommentBody,
  ] = useState("");


  const [
    commentSubmitting,
    setCommentSubmitting,
  ] = useState(false);


  const [
    commentSuccess,
    setCommentSuccess,
  ] = useState("");


  const [
    deletingCommentId,
    setDeletingCommentId,
  ] = useState<number | null>(
    null,
  );


  // ========================================================
  // PLAYER / ANALYTICS
  // ========================================================

  const audioRef =
    useRef<HTMLAudioElement | null>(
      null,
    );


  const analyticsSessionRef =
    useRef<string | null>(
      null,
    );


  const heartbeatRef =
    useRef<
      ReturnType<typeof setInterval> | null
    >(null);


  const completedRef =
    useRef(false);


  // ========================================================
  // INITIAL LOAD
  // ========================================================

  useEffect(() => {

    loadEpisodes();

    setListenerName(
      getListenerName(),
    );


    return () => {

      stopHeartbeat();

    };

  }, []);


  // ========================================================
  // LOAD EPISODES
  // ========================================================

  async function loadEpisodes() {

    try {

      setLoading(true);

      setError("");


      const response =
        await fetch(
          `${API_URL}/shows/${SHOW}`,
          {
            cache: "no-store",
          },
        );


      if (!response.ok) {

        throw new Error(
          `Unable to load Kyamagero Daily. HTTP ${response.status}`,
        );

      }


      const payload =
        (await response.json()) as
          | Episode[]
          | ShowResponse;


      const data =
        Array.isArray(payload)
          ? payload
          : payload.episodes ?? [];


      const valid =
        data.filter(
          (episode) =>
            episode &&
            typeof episode ===
              "object" &&
            typeof episode.episode ===
              "string",
        );


      setEpisodes(valid);


      if (valid.length) {

        const sorted =
          [...valid].sort(
            (a, b) =>
              (b.episode_number ?? 0) -
              (a.episode_number ?? 0),
          );


        setSelectedEpisode(
          sorted[0],
        );

      } else {

        setSelectedEpisode(
          null,
        );

      }

    } catch (err) {

      console.error(
        "Kyamagero Daily loading error:",
        err,
      );


      setEpisodes([]);

      setSelectedEpisode(null);

      setError(
        "Unable to load Kyamagero Daily.",
      );

    } finally {

      setLoading(false);

    }

  }


  // ========================================================
  // EPISODE ORDER
  // ========================================================

  const sortedEpisodes =
    useMemo(
      () =>
        [...episodes].sort(
          (a, b) =>
            (b.episode_number ?? 0) -
            (a.episode_number ?? 0),
        ),
      [episodes],
    );


  const currentEpisode =
    selectedEpisode ??
    sortedEpisodes[0] ??
    null;


  // ========================================================
  // SLUG
  // ========================================================

  function slugify(
    value: string,
  ) {

    return value
      .trim()
      .toLowerCase()
      .replace(
        /[^a-z0-9\s_-]/g,
        "",
      )
      .replace(
        /[\s_-]+/g,
        "-",
      )
      .replace(
        /^-+|-+$/g,
        "");
  }


  // ========================================================
  // AUDIO URL
  // ========================================================

  function getAudioUrl(
    episode: Episode | null,
  ): string | null {

    if (
      !episode?.audio_filename
    ) {

      return null;

    }


    const show =
      episode.show ||
      SHOW;


    const programme =
      episode.programme_id ||
      slugify(
        episode.programme ||
          episode.programme_title ||
          "general",
      );


    const season =
      episode.season_id ||
      `season_${String(
        episode.season ?? 1,
      ).padStart(3, "0")}`;


    return (
      `${API_URL}/audio/` +
      `${encodeURIComponent(show)}/` +
      `${encodeURIComponent(programme)}/` +
      `${encodeURIComponent(season)}/` +
      `${encodeURIComponent(
        episode.audio_filename,
      )}`
    );

  }


  // ========================================================
  // DATE
  // ========================================================

  function formatDate(
    value?: string,
  ) {

    if (!value) {

      return "";

    }


    const date =
      new Date(value);


    if (
      Number.isNaN(
        date.getTime(),
      )
    ) {

      return value;

    }


    return date.toLocaleDateString(
      "en-US",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      },
    );

  }


  // ========================================================
  // DURATION
  // ========================================================

  function formatDuration(
    seconds?: number,
  ) {

    if (
      !seconds ||
      seconds <= 0
    ) {

      return "";

    }


    const total =
      Math.round(seconds);


    const hours =
      Math.floor(
        total / 3600,
      );


    const minutes =
      Math.floor(
        (total % 3600) / 60,
      );


    const remaining =
      total % 60;


    if (hours) {

      return (
        `${hours}:` +
        `${String(minutes).padStart(2, "0")}:` +
        `${String(remaining).padStart(2, "0")}`
      );

    }


    return (
      `${minutes}:` +
      `${String(remaining).padStart(2, "0")}`
    );

  }


  // ========================================================
  // SELECT EPISODE
  // ========================================================

  function selectEpisode(
    episode: Episode,
    autoplay = false,
  ) {

    stopHeartbeat();


    analyticsSessionRef.current =
      null;


    completedRef.current =
      false;


    setSelectedEpisode(
      episode,
    );


    setIsPlaying(
      autoplay,
    );


    window.setTimeout(
      () => {

        document
          .getElementById(
            "player",
          )
          ?.scrollIntoView({
            behavior:
              "smooth",
            block:
              "center",
          });

      },
      20,
    );

  }


  // ========================================================
  // LOAD COMMENTS
  // ========================================================

  async function loadComments(
    episodeId: string,
  ) {

    try {

      setCommentsLoading(
        true,
      );

      setCommentsError("");

      setCommentSuccess("");


      const response =
        await fetch(
          `${API_URL}/comments/episode/${encodeURIComponent(
            episodeId,
          )}`,
          {
            cache: "no-store",
          },
        );


      if (!response.ok) {

        throw new Error(
          `Unable to load comments. HTTP ${response.status}`,
        );

      }


      const data =
        (await response.json()) as
          CommentsResponse;


      setComments(
        Array.isArray(
          data.comments,
        )
          ? data.comments
          : [],
      );

    } catch (error) {

      console.error(
        "Comments loading error:",
        error,
      );


      setComments([]);

      setCommentsError(
        "We couldn't load the comments right now.",
      );

    } finally {

      setCommentsLoading(
        false,
      );

    }

  }


  // ========================================================
  // LOAD COMMENTS WHEN EPISODE CHANGES
  // ========================================================

  useEffect(() => {

    if (
      !currentEpisode
    ) {

      setComments([]);

      return;

    }


    void loadComments(
      currentEpisode.episode,
    );

  }, [
    currentEpisode?.episode,
  ]);


  // ========================================================
  // SUBMIT LISTENER COMMENT
  // ========================================================

  async function submitComment() {

    if (
      !currentEpisode
    ) {

      return;

    }


    const name =
      listenerName.trim();


    const body =
      commentBody.trim();


    if (!name) {

      setCommentsError(
        "Please enter your name before commenting.",
      );

      return;

    }


    if (!body) {

      setCommentsError(
        "Please write a comment first.",
      );

      return;

    }


    if (
      body.length > 5000
    ) {

      setCommentsError(
        "Your comment is too long.",
      );

      return;

    }


    try {

      setCommentSubmitting(
        true,
      );

      setCommentsError("");

      setCommentSuccess("");


      const listenerId =
        getListenerId();


      if (!listenerId) {

        throw new Error(
          "Unable to establish listener identity.",
        );

      }


      saveListenerName(
        name,
      );


      const response =
        await fetch(
          `${API_URL}/comments/episode`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                episode_id:
                  currentEpisode.episode,

                show_id:
                  currentEpisode.show ||
                  SHOW,

                creator_id:
                  CREATOR_ID,

                listener_id:
                  listenerId,

                author_name:
                  name,

                body,

                parent_id:
                  null,
              }),
          },
        );


      if (!response.ok) {

        let detail =
          "Unable to publish your comment.";


        try {

          const errorData =
            await response.json();

          if (
            typeof errorData?.detail ===
            "string"
          ) {

            detail =
              errorData.detail;

          }

        } catch {

          // Keep default error.

        }


        throw new Error(
          detail,
        );

      }


      setCommentBody("");

      setCommentSuccess(
        "Your comment has been published.",
      );


      await loadComments(
        currentEpisode.episode,
      );

    } catch (error) {

      console.error(
        "Comment submission error:",
        error,
      );


      setCommentsError(
        error instanceof Error
          ? error.message
          : "Unable to publish your comment.",
      );

    } finally {

      setCommentSubmitting(
        false,
      );

    }

  }


  // ========================================================
  // DELETE LISTENER COMMENT
  // ========================================================

  async function deleteOwnComment(
    commentId: number,
  ) {

    if (
      !currentEpisode
    ) {

      return;

    }


    const listenerId =
      getListenerId();


    if (!listenerId) {

      return;

    }


    try {

      setDeletingCommentId(
        commentId,
      );

      setCommentsError("");


      const response =
        await fetch(
          `${API_URL}/comments/listener/${commentId}?listener_id=${encodeURIComponent(
            listenerId,
          )}`,
          {
            method: "DELETE",
          },
        );


      if (!response.ok) {

        let detail =
          "Unable to remove the comment.";


        try {

          const data =
            await response.json();

          if (
            typeof data?.detail ===
            "string"
          ) {

            detail =
              data.detail;

          }

        } catch {

          // Keep default.

        }


        throw new Error(
          detail,
        );

      }


      await loadComments(
        currentEpisode.episode,
      );

    } catch (error) {

      console.error(
        "Comment deletion error:",
        error,
      );


      setCommentsError(
        error instanceof Error
          ? error.message
          : "Unable to remove the comment.",
      );

    } finally {

      setDeletingCommentId(
        null,
      );

    }

  }


  // ========================================================
  // COMMENT TREE
  // ========================================================

  const rootComments =
    useMemo(
      () =>
        comments.filter(
          (comment) =>
            comment.parent_id ===
            null,
        ),
      [comments],
    );


  function repliesFor(
    commentId: number,
  ) {

    return comments.filter(
      (comment) =>
        comment.parent_id ===
        commentId,
    );

  }


  // ========================================================
  // COMMENT DATE
  // ========================================================

  function formatCommentDate(
    value: string,
  ) {

    const date =
      new Date(value);


    if (
      Number.isNaN(
        date.getTime(),
      )
    ) {

      return "";

    }


    return date.toLocaleString(
      "en-US",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      },
    );

  }


  // ========================================================
  // CREATOR ANALYTICS
  // ========================================================

  async function startAnalyticsSession(
    episode: Episode,
  ) {

    if (!episode) {

      return;

    }


    try {

      const listenerId =
        getListenerId();


      if (!listenerId) {

        return;

      }


      const response =
        await fetch(
          `${API_URL}/creator-analytics/session/start`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                listener_id:
                  listenerId,

                creator_id:
                  CREATOR_ID,

                show_id:
                  episode.show ||
                  SHOW,

                episode_id:
                  episode.episode,

                duration:
                  episode.duration ??
                  0,
              }),
          },
        );


      if (!response.ok) {

        console.error(
          "Analytics session start failed:",
          response.status,
        );

        return;

      }


      const data =
        await response.json();


      analyticsSessionRef.current =
        data.session_id;


      completedRef.current =
        false;


      startHeartbeat();

    } catch (error) {

      console.error(
        "Analytics session error:",
        error,
      );

    }

  }


  function startHeartbeat() {

    stopHeartbeat();


    heartbeatRef.current =
      setInterval(
        () => {
          void sendHeartbeat();
        },
        15000,
      );

  }


  function stopHeartbeat() {

    if (
      heartbeatRef.current
    ) {

      clearInterval(
        heartbeatRef.current,
      );


      heartbeatRef.current =
        null;

    }

  }


  async function sendHeartbeat() {

    const sessionId =
      analyticsSessionRef.current;


    const audio =
      audioRef.current;


    if (
      !sessionId ||
      !audio
    ) {

      return;

    }


    try {

      await fetch(
        `${API_URL}/creator-analytics/session/heartbeat`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({
              session_id:
                sessionId,

              position:
                audio.currentTime,
            }),
        },
      );

    } catch (error) {

      console.error(
        "Analytics heartbeat failed:",
        error,
      );

    }

  }


  async function sendAnalyticsEvent(
    eventType: string,
  ) {

    const sessionId =
      analyticsSessionRef.current;


    const audio =
      audioRef.current;


    if (
      !sessionId ||
      !audio
    ) {

      return;

    }


    try {

      await fetch(
        `${API_URL}/creator-analytics/session/event`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({
              session_id:
                sessionId,

              event_type:
                eventType,

              position:
                audio.currentTime,
            }),
        },
      );

    } catch (error) {

      console.error(
        `Analytics ${eventType} failed:`,
        error,
      );

    }

  }


  // ========================================================
  // PLAYER DATA
  // ========================================================

  const playerEpisode =
    currentEpisode
      ? {
          episode:
            currentEpisode.episode,

          title:
            currentEpisode.episode_title ??
            currentEpisode.title,

          published_at:
            currentEpisode.published_at,

          duration:
            currentEpisode.duration ??
            0,

          audio:
            currentEpisode.audio ??
            "",

          audio_url:
            getAudioUrl(
              currentEpisode,
            ) ?? "",

          episode_number:
            currentEpisode.episode_number ??
            1,

          programme:
            currentEpisode.programme ??
            currentEpisode.programme_title ??
            "",

          season:
            currentEpisode.season ??
            1,
        }
      : null;


  // ========================================================
  // RENDER
  // ========================================================

  return (

    <main
      style={{
        minHeight:
          "100vh",

        background:
          "#F4F0E8",

        color:
          "#153848",

        paddingBottom:
          120,

        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >

      <style>{`

        .fons-shell {
          max-width:1280px;
          margin:0 auto;
          padding:0 28px;
        }

        .fons-nav-link {
          color:#AEBCC0;
          text-decoration:none;
          font-size:13px;
          font-weight:750;
          transition:.2s;
        }

        .fons-nav-link:hover {
          color:#fff;
        }

        .hero-grid {
          display:grid;
          grid-template-columns:280px minmax(0,1fr);
          gap:42px;
          align-items:end;
        }

        .episode-row {
          transition:
            background .18s,
            transform .18s;
        }

        .episode-row:hover {
          background:#EDE8DE !important;
          transform:translateY(-1px);
        }

        .episode-row:hover
        .episode-play {
          opacity:1 !important;
          transform:scale(1);
        }

        .episode-play {
          opacity:0;
          transform:scale(.9);
          transition:.18s;
        }

        .comment-card {
          transition:
            border-color .18s,
            box-shadow .18s,
            transform .18s;
        }

        .comment-card:hover {
          border-color:#D8C6A4 !important;
          box-shadow:0 12px 30px rgba(21,56,72,.06);
        }

        .comment-submit:hover {
          filter:brightness(.96);
          transform:translateY(-1px);
        }

        .comment-submit {
          transition:.18s;
        }

        .mobile-stack {
          display:grid;
        }

        @media(max-width:760px) {

          .fons-shell {
            padding:0 18px;
          }

          .hero-grid {
            grid-template-columns:1fr;
            gap:26px;
            align-items:start;
          }

          .hero-art {
            width:min(72vw,280px) !important;
          }

          .hero-title {
            font-size:54px !important;
            letter-spacing:-3px !important;
          }

          .hero-actions {
            flex-wrap:wrap;
          }

          .episode-row {
            grid-template-columns:
              42px
              minmax(0,1fr)
              42px !important;

            padding:
              14px 8px !important;
          }

          .episode-meta {
            display:none !important;
          }

          .episode-row
          .episode-art {
            width:42px !important;
            height:42px !important;
          }

          .player-grid {
            grid-template-columns:1fr !important;
          }

          .comment-layout {
            grid-template-columns:1fr !important;
          }

          .comment-form {
            padding:18px !important;
          }

        }

      `}</style>


      {/* ====================================================
          HEADER
      ==================================================== */}

      <header
        style={{
          position:
            "sticky",

          top:0,

          zIndex:50,

          background:
            "rgba(8,18,23,.94)",

          backdropFilter:
            "blur(20px)",

          borderBottom:
            "1px solid rgba(255,255,255,.08)",
        }}
      >

        <div
          className="fons-shell"
          style={{
            height:70,
            display:"flex",
            alignItems:"center",
            justifyContent:
              "space-between",
          }}
        >

          <Link
            href="/"
            style={{
              color:"#fff",
              textDecoration:
                "none",
              fontWeight:950,
              fontSize:23,
              letterSpacing:4,
            }}
          >
            FONS
          </Link>


          <nav
            style={{
              display:"flex",
              alignItems:"center",
              gap:26,
            }}
          >

            <Link
              className="fons-nav-link"
              href="/dashboard"
            >
              Dashboard
            </Link>


            <Link
              className="fons-nav-link"
              href="/studio"
            >
              Studio
            </Link>


            <Link
              href="/studio"
              style={{
                background:
                  "#B48A45",

                color:
                  "#101A1E",

                textDecoration:
                  "none",

                padding:
                  "10px 18px",

                borderRadius:
                  999,

                fontSize:12,

                fontWeight:950,
              }}
            >
              Open Studio
            </Link>

          </nav>

        </div>

      </header>


      {/* ====================================================
          HERO
      ==================================================== */}

      <section
        style={{
          background:
            "linear-gradient(180deg,#071115 0%,#10252D 72%,#173E4B 100%)",

          color:"#fff",

          position:"relative",

          overflow:"hidden",
        }}
      >

        <div
          style={{
            position:"absolute",
            inset:0,

            background:
              "radial-gradient(circle at 78% 25%,rgba(180,138,69,.23),transparent 28%),radial-gradient(circle at 20% 100%,rgba(42,112,124,.22),transparent 38%)",

            pointerEvents:
              "none",
          }}
        />


        <div
          className="fons-shell hero-grid"
          style={{
            paddingTop:72,
            paddingBottom:52,
            position:"relative",
          }}
        >

          <div
            className="hero-art"
            style={{
              position:
                "relative",

              width:280,

              aspectRatio:"1",

              borderRadius:8,

              overflow:"hidden",

              boxShadow:
                "0 30px 70px rgba(0,0,0,.48)",

              flexShrink:0,
            }}
          >

            <Image
              src={KD_LOGO}
              alt="Kyamagero Daily"
              fill
              priority
              sizes="280px"
              style={{
                objectFit:"cover",
              }}
            />

          </div>


          <div>

            <div
              style={{
                color:"#D5AA62",
                fontSize:11,
                fontWeight:950,
                letterSpacing:3,
                marginBottom:15,
              }}
            >
              FONS ORIGINAL · CREATOR SERIES
            </div>


            <h1
              className="hero-title"
              style={{
                margin:0,
                fontSize:
                  "clamp(58px,8vw,100px)",
                lineHeight:.88,
                letterSpacing:-6,
                fontWeight:950,
              }}
            >
              Kyamagero
              <br />
              Daily
            </h1>


            <p
              style={{
                maxWidth:650,
                color:"#C5D0D3",
                fontSize:15,
                lineHeight:1.7,
                margin:"24px 0 0",
              }}
            >
              The official home of
              Kyamagero Daily on FONS.
              Listen to conversations,
              programmes and episodes
              published from the creator
              platform.
            </p>


            <div
              className="hero-actions"
              style={{
                display:"flex",
                alignItems:"center",
                gap:12,
                marginTop:28,
              }}
            >

              {currentEpisode && (

                <button
                  onClick={() =>
                    selectEpisode(
                      currentEpisode,
                      true,
                    )
                  }
                  style={{
                    border:0,
                    background:"#B48A45",
                    color:"#101A1E",
                    borderRadius:999,
                    padding:"13px 24px",
                    fontSize:14,
                    fontWeight:950,
                    cursor:"pointer",
                  }}
                >
                  ▶ Play
                </button>

              )}


              <button
                onClick={() =>
                  setFollowing(
                    (value) =>
                      !value,
                  )
                }
                style={{
                  border:
                    "1px solid rgba(255,255,255,.32)",

                  background:
                    "transparent",

                  color:"#fff",

                  borderRadius:999,

                  padding:
                    "12px 22px",

                  fontSize:13,

                  fontWeight:850,

                  cursor:"pointer",
                }}
              >
                {following
                  ? "Following"
                  : "Follow"}
              </button>


              <a
                href="#episodes"
                style={{
                  color:"#C5D0D3",
                  textDecoration:
                    "none",
                  fontSize:13,
                  fontWeight:800,
                  padding:"12px 8px",
                }}
              >
                Browse episodes
              </a>

            </div>


            <div
              style={{
                display:"flex",
                gap:30,
                marginTop:34,
                color:"#9FAFB3",
                fontSize:12,
                flexWrap:"wrap",
              }}
            >

              <span>

                <strong
                  style={{
                    display:"block",
                    color:"#fff",
                    fontSize:20,
                  }}
                >
                  {episodes.length}
                </strong>

                Episodes

              </span>


              <span>

                <strong
                  style={{
                    display:"block",
                    color:"#fff",
                    fontSize:20,
                  }}
                >
                  FONS
                </strong>

                Original

              </span>


              <span>

                <strong
                  style={{
                    display:"block",
                    color:"#fff",
                    fontSize:20,
                  }}
                >
                  {currentEpisode?.programme_title ??
                    currentEpisode?.programme ??
                    "You Rise Surrounded"}
                </strong>

                Programme

              </span>

            </div>

          </div>

        </div>


        <div
          className="fons-shell"
          style={{
            paddingBottom:22,
            color:"#8EA1A6",
            fontSize:12,
          }}
        >
          FONS · KYAMAGERO DAILY
        </div>

      </section>


      {/* ====================================================
          EPISODES
      ==================================================== */}

      <section
        id="episodes"
        className="fons-shell"
        style={{
          paddingTop:54,
        }}
      >

        {loading && (

          <div
            style={{
              padding:"80px 20px",
              textAlign:"center",
              color:"#777",
            }}
          >
            Loading Kyamagero Daily...
          </div>

        )}


        {error && (

          <div
            style={{
              padding:20,
              borderRadius:14,
              background:"#FFF2F2",
              color:"#8D3333",
              border:
                "1px solid #E7C2C2",
            }}
          >
            {error}
          </div>

        )}


        {!loading &&
          !error &&
          !episodes.length && (

            <div
              style={{
                padding:"80px 20px",
                textAlign:"center",
                background:"#fff",
                borderRadius:18,
              }}
            >
              No episodes have
              been published yet.
            </div>

          )}


        {!loading &&
          !error &&
          episodes.length > 0 && (

            <>

              <div
                style={{
                  display:"flex",
                  alignItems:"end",
                  justifyContent:
                    "space-between",
                  marginBottom:22,
                }}
              >

                <div>

                  <div
                    style={{
                      color:"#B48A45",
                      fontSize:10,
                      fontWeight:950,
                      letterSpacing:2.5,
                      marginBottom:8,
                    }}
                  >
                    KYAMAGERO DAILY
                  </div>


                  <h2
                    style={{
                      margin:0,
                      fontSize:32,
                      letterSpacing:-1.5,
                      fontWeight:900,
                    }}
                  >
                    Episodes
                  </h2>

                </div>


                <span
                  style={{
                    color:"#777",
                    fontSize:12,
                  }}
                >
                  {episodes.length} episodes
                </span>

              </div>


              <div
                style={{
                  background:"#fff",
                  borderRadius:18,
                  padding:"8px 18px",
                  boxShadow:
                    "0 10px 35px rgba(21,56,72,.06)",
                }}
              >

                {sortedEpisodes.map(
                  (episode) => {

                    const active =
                      currentEpisode?.episode_number ===
                      episode.episode_number;


                    return (

                      <button
                        key={
                          episode.episode
                        }
                        className="episode-row"
                        type="button"
                        onClick={() =>
                          selectEpisode(
                            episode,
                          )
                        }
                        style={{
                          width:"100%",
                          border:0,
                          borderBottom:
                            "1px solid #ECE8E0",
                          background:
                            active
                              ? "#F7F2E8"
                              : "#fff",
                          borderRadius:
                            active
                              ? 12
                              : 0,
                          padding:
                            "13px 10px",
                          cursor:"pointer",
                          textAlign:"left",
                          display:"grid",
                          gridTemplateColumns:
                            "50px minmax(0,1fr) auto 42px",
                          gap:16,
                          alignItems:"center",
                        }}
                      >

                        <div
                          className="episode-art"
                          style={{
                            width:50,
                            height:50,
                            borderRadius:8,
                            overflow:"hidden",
                            position:"relative",
                            background:
                              "#10242C",
                          }}
                        >

                          <Image
                            src={KD_LOGO}
                            alt=""
                            fill
                            sizes="50px"
                            style={{
                              objectFit:"cover",
                            }}
                          />

                        </div>


                        <div
                          style={{
                            minWidth:0,
                          }}
                        >

                          <div
                            style={{
                              color:"#B48A45",
                              fontSize:9,
                              fontWeight:950,
                              letterSpacing:1.5,
                              marginBottom:4,
                            }}
                          >
                            EPISODE{" "}
                            {episode.episode_number ??
                              episode.episode}
                          </div>


                          <div
                            style={{
                              color:"#153848",
                              fontSize:15,
                              fontWeight:850,
                              whiteSpace:
                                "nowrap",
                              overflow:"hidden",
                              textOverflow:
                                "ellipsis",
                            }}
                          >
                            {episode.episode_title ??
                              episode.title}
                          </div>


                          <div
                            style={{
                              marginTop:4,
                              color:"#8A8A8A",
                              fontSize:11,
                            }}
                          >
                            {episode.season_title ??
                              `Season ${
                                episode.season ??
                                1
                              }`}{" "}
                            ·{" "}
                            {formatDate(
                              episode.published_at,
                            )}
                          </div>

                        </div>


                        <span
                          className="episode-meta"
                          style={{
                            color:"#777",
                            fontSize:12,
                            fontWeight:700,
                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          {formatDuration(
                            episode.duration,
                          )}
                        </span>


                        <span
                          className="episode-play"
                          style={{
                            width:40,
                            height:40,
                            borderRadius:"50%",
                            background:
                              active
                                ? "#B48A45"
                                : "#153848",
                            color:
                              active
                                ? "#101A1E"
                                : "#fff",
                            display:"flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            fontSize:13,
                            fontWeight:950,
                          }}
                        >
                          ▶
                        </span>

                      </button>

                    );

                  },
                )}

              </div>


              {/* ==================================================
                  PLAYER
              ================================================== */}

              {currentEpisode && (

                <section
                  id="player"
                  style={{
                    marginTop:46,
                    marginBottom:28,
                  }}
                >

                  <div
                    className="player-grid"
                    style={{
                      background:
                        "linear-gradient(135deg,#091419,#153848 68%,#1D4A58)",
                      borderRadius:22,
                      padding:26,
                      color:"#fff",
                      display:"grid",
                      gridTemplateColumns:
                        "90px minmax(0,1fr)",
                      gap:22,
                      alignItems:"center",
                    }}
                  >

                    <div
                      style={{
                        width:90,
                        height:90,
                        borderRadius:10,
                        overflow:"hidden",
                        position:"relative",
                      }}
                    >

                      <Image
                        src={
                          isPlaying
                            ? CREATOR_IMAGE
                            : KD_LOGO
                        }
                        alt="Kyamagero Daily"
                        fill
                        sizes="90px"
                        style={{
                          objectFit:"cover",
                        }}
                      />

                    </div>


                    <div
                      style={{
                        minWidth:0,
                      }}
                    >

                      <div
                        style={{
                          color:"#D5AA62",
                          fontSize:9,
                          fontWeight:950,
                          letterSpacing:2,
                        }}
                      >
                        {isPlaying
                          ? "NOW PLAYING"
                          : "SELECTED EPISODE"}
                      </div>


                      <h3
                        style={{
                          margin:
                            "7px 0 5px",
                          fontSize:22,
                          lineHeight:1.15,
                          fontWeight:900,
                        }}
                      >
                        {currentEpisode.episode_title ??
                          currentEpisode.title}
                      </h3>


                      <div
                        style={{
                          color:"#AEBCC0",
                          fontSize:11,
                          marginBottom:15,
                        }}
                      >
                        Episode{" "}
                        {currentEpisode.episode_number ??
                          1}{" "}
                        ·{" "}
                        {formatDuration(
                          currentEpisode.duration,
                        )}
                      </div>


                      {getAudioUrl(
                        currentEpisode,
                      ) ? (

                        <audio
                          key={
                            currentEpisode.audio_filename
                          }
                          ref={audioRef}
                          controls
                          preload="metadata"
                          src={
                            getAudioUrl(
                              currentEpisode,
                            ) ??
                            undefined
                          }

                          onPlay={
                            async () => {

                              setIsPlaying(
                                true,
                              );


                              if (
                                !analyticsSessionRef.current
                              ) {

                                await startAnalyticsSession(
                                  currentEpisode,
                                );

                              } else {

                                await sendAnalyticsEvent(
                                  "resume",
                                );

                                startHeartbeat();

                              }

                            }
                          }


                          onPause={
                            async () => {

                              setIsPlaying(
                                false,
                              );


                              await sendHeartbeat();


                              await sendAnalyticsEvent(
                                "pause",
                              );


                              stopHeartbeat();

                            }
                          }


                          onEnded={
                            async () => {

                              setIsPlaying(
                                false,
                              );


                              stopHeartbeat();


                              if (
                                !completedRef.current
                              ) {

                                completedRef.current =
                                  true;


                                await sendAnalyticsEvent(
                                  "complete",
                                );


                                await sendAnalyticsEvent(
                                  "ended",
                                );

                              }


                              analyticsSessionRef.current =
                                null;

                            }
                          }


                          style={{
                            width:"100%",
                          }}
                        />

                      ) : (

                        <div
                          style={{
                            color:"#D5AA62",
                            fontSize:12,
                          }}
                        >
                          Audio unavailable
                          for this episode.
                        </div>

                      )}

                    </div>

                  </div>

                </section>

              )}


              {/* ==================================================
                  COMMENTS
              ================================================== */}

              {currentEpisode && (

                <section
                  id="comments"
                  style={{
                    marginTop:30,
                    marginBottom:70,
                  }}
                >

                  <div
                    style={{
                      marginBottom:24,
                    }}
                  >

                    <div
                      style={{
                        color:"#B48A45",
                        fontSize:10,
                        fontWeight:950,
                        letterSpacing:2.5,
                        marginBottom:8,
                      }}
                    >
                      JOIN THE CONVERSATION
                    </div>


                    <div
                      style={{
                        display:"flex",
                        alignItems:
                          "baseline",
                        justifyContent:
                          "space-between",
                        gap:20,
                        flexWrap:"wrap",
                      }}
                    >

                      <h2
                        style={{
                          margin:0,
                          fontSize:32,
                          letterSpacing:-1.5,
                          fontWeight:900,
                        }}
                      >
                        Comments
                      </h2>


                      <span
                        style={{
                          color:"#777",
                          fontSize:12,
                        }}
                      >
                        {comments.length}{" "}
                        {comments.length === 1
                          ? "comment"
                          : "comments"}
                      </span>

                    </div>


                    <p
                      style={{
                        color:"#777",
                        fontSize:13,
                        lineHeight:1.7,
                        margin:
                          "9px 0 0",
                        maxWidth:650,
                      }}
                    >
                      Share your thoughts,
                      reactions and ideas
                      about this episode.
                    </p>

                  </div>


                  {/* ==============================================
                      COMMENT FORM
                  ============================================== */}

                  <div
                    className="comment-form"
                    style={{
                      background:"#fff",
                      borderRadius:20,
                      padding:24,
                      boxShadow:
                        "0 10px 35px rgba(21,56,72,.06)",
                      marginBottom:28,
                    }}
                  >

                    <div
                      className="comment-layout"
                      style={{
                        display:"grid",
                        gridTemplateColumns:
                          "220px minmax(0,1fr)",
                        gap:16,
                      }}
                    >

                      <div>

                        <label
                          htmlFor="listener-name"
                          style={{
                            display:"block",
                            color:"#153848",
                            fontSize:11,
                            fontWeight:850,
                            marginBottom:8,
                          }}
                        >
                          Your name
                        </label>


                        <input
                          id="listener-name"
                          value={
                            listenerName
                          }
                          onChange={(event) =>
                            setListenerName(
                              event.target.value,
                            )
                          }
                          maxLength={200}
                          placeholder="Enter your name"
                          style={{
                            width:"100%",
                            boxSizing:
                              "border-box",
                            border:
                              "1px solid #DDD7CC",
                            borderRadius:12,
                            padding:
                              "13px 14px",
                            background:
                              "#FBF9F5",
                            color:"#153848",
                            outline:"none",
                            fontSize:13,
                          }}
                        />

                      </div>


                      <div>

                        <label
                          htmlFor="comment-body"
                          style={{
                            display:"block",
                            color:"#153848",
                            fontSize:11,
                            fontWeight:850,
                            marginBottom:8,
                          }}
                        >
                          Your comment
                        </label>


                        <textarea
                          id="comment-body"
                          value={
                            commentBody
                          }
                          onChange={(event) =>
                            setCommentBody(
                              event.target.value,
                            )
                          }
                          maxLength={5000}
                          rows={4}
                          placeholder="What did you think about this episode?"
                          style={{
                            width:"100%",
                            boxSizing:
                              "border-box",
                            border:
                              "1px solid #DDD7CC",
                            borderRadius:12,
                            padding:
                              "13px 14px",
                            background:
                              "#FBF9F5",
                            color:"#153848",
                            outline:"none",
                            fontSize:13,
                            lineHeight:1.6,
                            resize:"vertical",
                            fontFamily:
                              "inherit",
                          }}
                        />

                      </div>

                    </div>


                    <div
                      style={{
                        display:"flex",
                        justifyContent:
                          "space-between",
                        alignItems:"center",
                        gap:16,
                        marginTop:14,
                        flexWrap:"wrap",
                      }}
                    >

                      <span
                        style={{
                          color:"#999",
                          fontSize:11,
                        }}
                      >
                        {commentBody.length}
                        /5000
                      </span>


                      <button
                        type="button"
                        className="comment-submit"
                        disabled={
                          commentSubmitting
                        }
                        onClick={
                          submitComment
                        }
                        style={{
                          border:0,
                          background:
                            commentSubmitting
                              ? "#A9A09A"
                              : "#153848",
                          color:"#fff",
                          borderRadius:999,
                          padding:
                            "12px 22px",
                          fontSize:12,
                          fontWeight:900,
                          cursor:
                            commentSubmitting
                              ? "not-allowed"
                              : "pointer",
                        }}
                      >
                        {commentSubmitting
                          ? "Publishing..."
                          : "Post comment"}
                      </button>

                    </div>


                    {commentsError && (

                      <div
                        style={{
                          marginTop:14,
                          padding:"11px 13px",
                          borderRadius:10,
                          background:
                            "#FFF2F2",
                          border:
                            "1px solid #E7C2C2",
                          color:"#8D3333",
                          fontSize:12,
                        }}
                      >
                        {commentsError}
                      </div>

                    )}


                    {commentSuccess && (

                      <div
                        style={{
                          marginTop:14,
                          padding:"11px 13px",
                          borderRadius:10,
                          background:
                            "#EFF8F1",
                          border:
                            "1px solid #C8E1CC",
                          color:"#32643B",
                          fontSize:12,
                        }}
                      >
                        {commentSuccess}
                      </div>

                    )}

                  </div>


                  {/* ==============================================
                      COMMENTS LIST
                  ============================================== */}

                  <div>

                    {commentsLoading && (

                      <div
                        style={{
                          background:"#fff",
                          borderRadius:18,
                          padding:"38px 20px",
                          textAlign:"center",
                          color:"#777",
                          fontSize:13,
                        }}
                      >
                        Loading comments...
                      </div>

                    )}


                    {!commentsLoading &&
                      !comments.length && (

                        <div
                          style={{
                            background:"#fff",
                            borderRadius:18,
                            padding:"48px 24px",
                            textAlign:"center",
                            boxShadow:
                              "0 10px 35px rgba(21,56,72,.04)",
                          }}
                        >

                          <div
                            style={{
                              fontSize:30,
                              marginBottom:12,
                            }}
                          >
                            💬
                          </div>


                          <div
                            style={{
                              fontSize:16,
                              fontWeight:850,
                              color:"#153848",
                            }}
                          >
                            Be the first to
                            comment.
                          </div>


                          <div
                            style={{
                              marginTop:7,
                              color:"#888",
                              fontSize:12,
                            }}
                          >
                            Start the
                            conversation around
                            this episode.
                          </div>

                        </div>

                      )}


                    {!commentsLoading &&
                      rootComments.map(
                        (comment) => {

                          const replies =
                            repliesFor(
                              comment.id,
                            );


                          const listenerId =
                            getListenerId();


                          const isOwn =
                            comment.author_type ===
                              "listener" &&
                            comment.author_id ===
                              listenerId;


                          return (

                            <article
                              key={
                                comment.id
                              }
                              className="comment-card"
                              style={{
                                background:"#fff",
                                border:
                                  "1px solid #E9E3D9",
                                borderRadius:18,
                                padding:20,
                                marginBottom:14,
                              }}
                            >

                              <div
                                style={{
                                  display:"flex",
                                  justifyContent:
                                    "space-between",
                                  gap:16,
                                }}
                              >

                                <div
                                  style={{
                                    minWidth:0,
                                  }}
                                >

                                  <div
                                    style={{
                                      display:"flex",
                                      alignItems:
                                        "center",
                                      gap:9,
                                      flexWrap:
                                        "wrap",
                                    }}
                                  >

                                    <strong
                                      style={{
                                        color:
                                          "#153848",
                                        fontSize:13,
                                      }}
                                    >
                                      {
                                        comment.author_name
                                      }
                                    </strong>


                                    {comment.author_type ===
                                      "creator" && (

                                      <span
                                        style={{
                                          background:
                                            "#F4E8D0",
                                          color:
                                            "#8B672E",
                                          borderRadius:
                                            999,
                                          padding:
                                            "4px 8px",
                                          fontSize:9,
                                          fontWeight:950,
                                          letterSpacing:
                                            .5,
                                        }}
                                      >
                                        CREATOR
                                      </span>

                                    )}

                                  </div>


                                  <div
                                    style={{
                                      marginTop:4,
                                      color:"#999",
                                      fontSize:10,
                                    }}
                                  >
                                    {formatCommentDate(
                                      comment.created_at,
                                    )}
                                  </div>

                                </div>


                                {isOwn && (

                                  <button
                                    type="button"
                                    disabled={
                                      deletingCommentId ===
                                      comment.id
                                    }
                                    onClick={() =>
                                      deleteOwnComment(
                                        comment.id,
                                      )
                                    }
                                    style={{
                                      border:0,
                                      background:
                                        "transparent",
                                      color:"#9A5D5D",
                                      fontSize:11,
                                      fontWeight:800,
                                      cursor:
                                        "pointer",
                                    }}
                                  >
                                    {deletingCommentId ===
                                    comment.id
                                      ? "Removing..."
                                      : "Remove"}
                                  </button>

                                )}

                              </div>


                              <p
                                style={{
                                  margin:
                                    "15px 0 0",
                                  color:"#344D57",
                                  fontSize:14,
                                  lineHeight:1.75,
                                  whiteSpace:
                                    "pre-wrap",
                                  overflowWrap:
                                    "anywhere",
                                }}
                              >
                                {comment.body}
                              </p>


                              {replies.length >
                                0 && (

                                <div
                                  style={{
                                    marginTop:18,
                                    marginLeft:18,
                                    paddingLeft:18,
                                    borderLeft:
                                      "2px solid #E7DCC9",
                                  }}
                                >

                                  {replies.map(
                                    (reply) => (

                                      <div
                                        key={
                                          reply.id
                                        }
                                        style={{
                                          padding:
                                            "13px 0",
                                          borderBottom:
                                            "1px solid #F0EBE3",
                                        }}
                                      >

                                        <div
                                          style={{
                                            display:
                                              "flex",
                                            alignItems:
                                              "center",
                                            gap:8,
                                            flexWrap:
                                              "wrap",
                                          }}
                                        >

                                          <strong
                                            style={{
                                              color:
                                                "#153848",
                                              fontSize:
                                                12,
                                            }}
                                          >
                                            {
                                              reply.author_name
                                            }
                                          </strong>


                                          {reply.author_type ===
                                            "creator" && (

                                            <span
                                              style={{
                                                background:
                                                  "#F4E8D0",
                                                color:
                                                  "#8B672E",
                                                borderRadius:
                                                  999,
                                                padding:
                                                  "3px 7px",
                                                fontSize:
                                                  8,
                                                fontWeight:
                                                  950,
                                              }}
                                            >
                                              CREATOR
                                            </span>

                                          )}


                                          <span
                                            style={{
                                              color:
                                                "#999",
                                              fontSize:
                                                10,
                                            }}
                                          >
                                            {formatCommentDate(
                                              reply.created_at,
                                            )}
                                          </span>

                                        </div>


                                        <div
                                          style={{
                                            marginTop:7,
                                            color:
                                              "#52656C",
                                            fontSize:
                                              13,
                                            lineHeight:
                                              1.65,
                                            whiteSpace:
                                              "pre-wrap",
                                            overflowWrap:
                                              "anywhere",
                                          }}
                                        >
                                          {
                                            reply.body
                                          }
                                        </div>

                                      </div>

                                    ),
                                  )}

                                </div>

                              )}

                            </article>

                          );

                        },
                      )}

                  </div>

                </section>

              )}

            </>

          )}

      </section>


      {/* ====================================================
          GLOBAL PLAYER
      ==================================================== */}

      <PlayerBar
        episode={
          playerEpisode
        }
        audioUrl={
          currentEpisode
            ? getAudioUrl(
                currentEpisode,
              )
            : null
        }
      />

    </main>

  );

}