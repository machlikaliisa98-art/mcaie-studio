"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Image from "next/image";
import Link from "next/link";

import { API_URL } from "@/config/api";
import PlayerBar from "@/components/player/PlayerBar";

const SHOW = "kyamagero-daily";

const KD_LOGO = "/kd-logo.png";
const CREATOR_IMAGE =
  "/creators/kyamagero.png";

type Episode = {
  project_id?: string;

  /*
   * PUBLIC episode identity.
   *
   * Example:
   * 001
   * 002
   * 003
   */
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


export default function KyamageroDailyPage() {

  const [episodes, setEpisodes] =
    useState<Episode[]>([]);

  const [
    selectedEpisode,
    setSelectedEpisode,
  ] =
    useState<Episode | null>(null);

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ==========================================================
  // LOAD REAL PUBLISHED EPISODES
  // ==========================================================

  useEffect(() => {

    loadEpisodes();

  }, []);


  async function loadEpisodes() {

    try {

      setLoading(true);

      setError("");

      const response =
        await fetch(
          `${API_URL}/shows/${SHOW}`,
          {
            cache: "no-store",
          }
        );


      if (!response.ok) {

        throw new Error(
          `Unable to load Kyamagero Daily. HTTP ${response.status}`
        );

      }


      const payload =
        (await response.json()) as
          | Episode[]
          | ShowResponse;


      let data: Episode[] = [];


      if (
        Array.isArray(payload)
      ) {

        data = payload;

      } else if (
        payload &&
        Array.isArray(
          payload.episodes
        )
      ) {

        data =
          payload.episodes;

      }


      /*
       * Only accept actual published
       * episode records.
       */
      data =
        data.filter(
          (
            episode
          ) =>
            episode &&
            typeof episode ===
              "object" &&
            typeof episode.episode ===
              "string"
        );


      setEpisodes(data);


      /*
       * Always select the latest REAL
       * published episode.
       */
      if (data.length > 0) {

        const sorted =
          [...data].sort(
            (a, b) =>
              (
                b.episode_number ??
                0
              ) -
              (
                a.episode_number ??
                0
              )
          );


        setSelectedEpisode(
          sorted[0]
        );

      } else {

        setSelectedEpisode(
          null
        );

      }

    } catch (err) {

      console.error(
        "Kyamagero Daily loading error:",
        err
      );

      setEpisodes([]);

      setSelectedEpisode(
        null
      );

      setError(
        "Unable to load Kyamagero Daily."
      );

    } finally {

      setLoading(false);

    }

  }


  // ==========================================================
  // CANONICAL ORDER
  // ==========================================================

  const sortedEpisodes =
    useMemo(() => {

      return [
        ...episodes,
      ].sort(
        (a, b) =>
          (
            a.episode_number ??
            0
          ) -
          (
            b.episode_number ??
            0
          )
      );

    }, [episodes]);


  const latestEpisode =
    sortedEpisodes[
      sortedEpisodes.length - 1
    ] ?? null;


  const currentEpisode =
    selectedEpisode ??
    latestEpisode;


  // ==========================================================
  // SLUG
  // ==========================================================

  function slugify(
    value: string
  ): string {

    return value
      .trim()
      .toLowerCase()
      .replace(
        /[^a-z0-9\s_-]/g,
        ""
      )
      .replace(
        /[\s_-]+/g,
        "-"
      )
      .replace(
        /^-+|-+$/g,
        "");

  }


  // ==========================================================
  // CANONICAL AUDIO URL
  //
  // Episode 1 -> 001.wav
  // Episode 2 -> 002.wav
  // Episode 3 -> 003.wav
  //
  // NEVER episode_000 / episode_001.
  // ==========================================================

  function getAudioUrl(
    episode: Episode | null
  ): string | null {

    if (!episode) {

      return null;

    }


    /*
     * Prefer the actual published
     * filename.
     */
    if (
      !episode.audio_filename
    ) {

      console.error(
        "Published episode has no audio_filename:",
        episode
      );

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
        "general"
      );


    const season =
      episode.season_id ||
      `season_${String(
        episode.season ?? 1
      ).padStart(3, "0")}`;


    const filename =
      episode.audio_filename;


    return (
      `${API_URL}` +
      `/audio/` +
      `${encodeURIComponent(show)}/` +
      `${encodeURIComponent(programme)}/` +
      `${encodeURIComponent(season)}/` +
      `${encodeURIComponent(filename)}`
    );

  }


  // ==========================================================
  // DATE
  // ==========================================================

  function formatDate(
    value?: string
  ) {

    if (!value) {

      return "";

    }


    const date =
      new Date(value);


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return value;

    }


    return date.toLocaleDateString(
      "en-US",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );

  }


  // ==========================================================
  // DURATION
  // ==========================================================

  function formatDuration(
    seconds?: number
  ) {

    if (
      seconds === undefined ||
      seconds === null ||
      seconds <= 0
    ) {

      return "";

    }


    const totalSeconds =
      Math.round(seconds);


    const hours =
      Math.floor(
        totalSeconds / 3600
      );


    const minutes =
      Math.floor(
        (
          totalSeconds % 3600
        ) / 60
      );


    const remainingSeconds =
      totalSeconds % 60;


    if (hours > 0) {

      return (
        `${hours}:` +
        `${String(
          minutes
        ).padStart(2, "0")}:` +
        `${String(
          remainingSeconds
        ).padStart(2, "0")}`
      );

    }


    return (
      `${minutes}:` +
      `${String(
        remainingSeconds
      ).padStart(2, "0")}`
    );

  }


  // ==========================================================
  // SELECT
  // ==========================================================

  function selectEpisode(
    episode: Episode
  ) {

    setSelectedEpisode(
      episode
    );

    setIsPlaying(
      false
    );


    window.setTimeout(
      () => {

        document
          .getElementById(
            "player"
          )
          ?.scrollIntoView({
            behavior:
              "smooth",

            block:
              "center",
          });

      },
      20
    );

  }


  // ==========================================================
  // PLAY
  // ==========================================================

  function playEpisode(
    episode: Episode
  ) {

    setSelectedEpisode(
      episode
    );

    setIsPlaying(
      false
    );


    window.setTimeout(
      () => {

        document
          .getElementById(
            "player"
          )
          ?.scrollIntoView({
            behavior:
              "smooth",

            block:
              "center",
          });

      },
      20
    );

  }


  // ==========================================================
  // PLAYERBAR ADAPTER
  //
  // IMPORTANT:
  //
  // PlayerBar has its own Episode type.
  // We do NOT pass our local Episode type
  // directly into it.
  //
  // This object only contains the fields
  // PlayerBar needs.
  // ==========================================================

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
              currentEpisode
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


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <main
      style={{
        minHeight:
          "100vh",

        background:
          "linear-gradient(180deg,#081217 0%,#0E171B 29%,#F4F0E8 54%,#F4F0E8 100%)",

        color:
          "#153848",

        paddingBottom:
          120,
      }}
    >

      {/* =====================================================
          NAVIGATION
      ====================================================== */}

      <header
        style={{
          position:
            "sticky",

          top:
            0,

          zIndex:
            50,

          background:
            "rgba(8,18,23,.92)",

          backdropFilter:
            "blur(20px)",

          borderBottom:
            "1px solid rgba(255,255,255,.08)",
        }}
      >

        <div
          style={{
            maxWidth:
              1450,

            margin:
              "0 auto",

            padding:
              "16px 28px",

            display:
              "flex",

            justifyContent:
              "space-between",

            alignItems:
              "center",
          }}
        >

          <Link
            href="/"
            style={{
              color:
                "#FFFFFF",

              textDecoration:
                "none",

              fontWeight:
                950,

              fontSize:
                22,

              letterSpacing:
                3,
            }}
          >
            FONS
          </Link>


          <nav
            style={{
              display:
                "flex",

              alignItems:
                "center",

              gap:
                22,
            }}
          >

            <Link
              href="/dashboard"
              style={{
                color:
                  "#C9D0D2",

                textDecoration:
                  "none",

                fontSize:
                  13,

                fontWeight:
                  700,
              }}
            >
              Dashboard
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
                  "10px 20px",

                borderRadius:
                  999,

                fontSize:
                  13,

                fontWeight:
                  900,
              }}
            >
              Open Studio
            </Link>

          </nav>

        </div>

      </header>


      {/* =====================================================
          HERO
      ====================================================== */}

      <section
        style={{
          position:
            "relative",

          overflow:
            "hidden",

          background:
            "radial-gradient(circle at 72% 28%,rgba(180,138,69,.20),transparent 28%),radial-gradient(circle at 20% 80%,rgba(30,100,110,.18),transparent 32%),linear-gradient(135deg,#071115,#10242C 60%,#173E4B)",

          color:
            "#FFFFFF",
        }}
      >

        <div
          style={{
            position:
              "absolute",

            inset:
              0,

            background:
              "linear-gradient(90deg,rgba(7,17,21,.96) 0%,rgba(7,17,21,.78) 45%,rgba(7,17,21,.35) 100%)",

            pointerEvents:
              "none",
          }}
        />


        <div
          style={{
            position:
              "relative",

            maxWidth:
              1450,

            margin:
              "0 auto",

            padding:
              "72px 28px 82px",

            display:
              "grid",

            gridTemplateColumns:
              "minmax(260px,360px) minmax(0,1fr)",

            gap:
              58,

            alignItems:
              "center",
          }}
        >

          <div
            style={{
              position:
                "relative",

              width:
                "100%",

              aspectRatio:
                "1",

              borderRadius:
                28,

              overflow:
                "hidden",

              boxShadow:
                "0 40px 100px rgba(0,0,0,.52)",

              border:
                "1px solid rgba(255,255,255,.12)",

              background:
                "#0B171C",
            }}
          >

            <Image
              src={KD_LOGO}
              alt="Kyamagero Daily"
              fill
              priority
              sizes="(max-width: 800px) 80vw, 360px"
              style={{
                objectFit:
                  "cover",
              }}
            />

          </div>


          <div>

            <div
              style={{
                color:
                  "#D5AA62",

                fontSize:
                  11,

                fontWeight:
                  950,

                letterSpacing:
                  3.5,

                marginBottom:
                  18,
              }}
            >
              FONS ORIGINAL · CREATOR SERIES
            </div>


            <h1
              style={{
                margin:
                  0,

                fontSize:
                  "clamp(52px,8vw,104px)",

                lineHeight:
                  0.9,

                letterSpacing:
                  -5,

                fontWeight:
                  900,
              }}
            >
              Kyamagero
              <br />
              Daily
            </h1>


            <p
              style={{
                maxWidth:
                  720,

                margin:
                  "30px 0 0",

                color:
                  "#C8D2D5",

                fontSize:
                  18,

                lineHeight:
                  1.75,
              }}
            >
              The official home of
              Kyamagero Daily on FONS.
              Explore the programmes,
              seasons and conversations
              published from Kyamagero&apos;s
              platform.
            </p>


            {currentEpisode && (

              <div
                style={{
                  marginTop:
                    32,

                  display:
                    "flex",

                  flexWrap:
                    "wrap",

                  gap:
                    12,
                }}
              >

                <button
                  type="button"
                  onClick={() =>
                    playEpisode(
                      currentEpisode
                    )
                  }
                  style={{
                    border:
                      "none",

                    background:
                      "#B48A45",

                    color:
                      "#101A1E",

                    padding:
                      "14px 25px",

                    borderRadius:
                      999,

                    fontWeight:
                      950,

                    cursor:
                      "pointer",

                    fontSize:
                      14,
                  }}
                >
                  ▶ Play latest
                </button>


                <a
                  href="#episodes"
                  style={{
                    border:
                      "1px solid rgba(255,255,255,.25)",

                    color:
                      "#FFFFFF",

                    textDecoration:
                      "none",

                    padding:
                      "13px 24px",

                    borderRadius:
                      999,

                    fontWeight:
                      800,

                    fontSize:
                      14,
                  }}
                >
                  Browse episodes
                </a>

              </div>

            )}


            <div
              style={{
                display:
                  "flex",

                flexWrap:
                  "wrap",

                gap:
                  32,

                marginTop:
                  38,

                color:
                  "#AEBCC0",

                fontSize:
                  13,
              }}
            >

              <span>

                <strong
                  style={{
                    display:
                      "block",

                    color:
                      "#FFFFFF",

                    fontSize:
                      24,

                    lineHeight:
                      1,

                    marginBottom:
                      5,
                  }}
                >
                  {episodes.length}
                </strong>

                Published episodes

              </span>


              <span>

                <strong
                  style={{
                    display:
                      "block",

                    color:
                      "#FFFFFF",

                    fontSize:
                      24,

                    lineHeight:
                      1,

                    marginBottom:
                      5,
                  }}
                >
                  1
                </strong>

                Programme

              </span>


              <span>

                <strong
                  style={{
                    display:
                      "block",

                    color:
                      "#FFFFFF",

                    fontSize:
                      24,

                    lineHeight:
                      1,

                    marginBottom:
                      5,
                  }}
                >
                  FONS
                </strong>

                Original audio

              </span>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          MAIN
      ====================================================== */}

      <section
        style={{
          maxWidth:
            1450,

          margin:
            "0 auto",

          padding:
            "68px 28px 110px",
        }}
      >

        {loading && (

          <div
            style={{
              background:
                "#FFFFFF",

              borderRadius:
                28,

              padding:
                80,

              textAlign:
                "center",

              color:
                "#777",
            }}
          >
            Loading Kyamagero Daily...
          </div>

        )}


        {error && (

          <div
            style={{
              background:
                "#FFF2F2",

              color:
                "#8D3333",

              border:
                "1px solid #E7C2C2",

              borderRadius:
                18,

              padding:
                20,
            }}
          >
            {error}
          </div>

        )}


        {!loading &&
          !error &&
          episodes.length === 0 && (

            <div
              style={{
                background:
                  "#FFFFFF",

                borderRadius:
                  28,

                padding:
                  80,

                textAlign:
                  "center",
              }}
            >
              No episodes have been
              published yet.
            </div>

          )}


        {!loading &&
          !error &&
          currentEpisode && (

            <>

              {/* =================================================
                  PROGRAMME
              ================================================== */}

              <section
                style={{
                  marginBottom:
                    54,
                }}
              >

                <div
                  style={{
                    display:
                      "flex",

                    alignItems:
                      "center",

                    gap:
                      18,

                    marginBottom:
                      18,
                  }}
                >

                  <div
                    style={{
                      width:
                        58,

                      height:
                        58,

                      borderRadius:
                        15,

                      overflow:
                        "hidden",

                      flexShrink:
                        0,

                      position:
                        "relative",

                      background:
                        "#10242C",
                    }}
                  >

                    <Image
                      src={KD_LOGO}
                      alt="Kyamagero Daily"
                      fill
                      sizes="58px"
                      style={{
                        objectFit:
                          "cover",
                      }}
                    />

                  </div>


                  <div>

                    <div
                      style={{
                        color:
                          "#B48A45",

                        fontSize:
                          10,

                        fontWeight:
                          950,

                        letterSpacing:
                          3,
                      }}
                    >
                      KYAMAGERO DAILY
                    </div>


                    <h2
                      style={{
                        margin:
                          "5px 0 0",

                        fontSize:
                          "clamp(32px,4vw,50px)",

                        letterSpacing:
                          -2,

                        color:
                          "#153848",
                      }}
                    >
                      {
                        currentEpisode
                          .programme_title ??
                        currentEpisode
                          .programme ??
                        "You Rise Surrounded"
                      }
                    </h2>

                  </div>

                </div>


                <div
                  style={{
                    color:
                      "#777",

                    fontSize:
                      14,
                  }}
                >

                  {
                    currentEpisode
                      .season_title ??
                    `Season ${
                      currentEpisode.season ??
                      1
                    }`
                  }

                  {" · "}

                  {episodes.length}
                  {" "}
                  episodes

                </div>

              </section>


              {/* =================================================
                  FEATURED PLAYER
              ================================================== */}

              <section
                id="player"
                style={{
                  marginBottom:
                    80,
                }}
              >

                <div
                  style={{
                    background:
                      "linear-gradient(135deg,#0A151A,#153848 65%,#1D4A58)",

                    borderRadius:
                      32,

                    padding:
                      36,

                    color:
                      "#FFFFFF",

                    boxShadow:
                      "0 30px 80px rgba(21,56,72,.20)",

                    display:
                      "grid",

                    gridTemplateColumns:
                      "minmax(220px,310px) minmax(0,1fr)",

                    gap:
                      40,

                    alignItems:
                      "center",
                  }}
                >

                  {/* ART */}

                  <div
                    style={{
                      position:
                        "relative",

                      aspectRatio:
                        "1",

                      borderRadius:
                        24,

                      overflow:
                        "hidden",

                      boxShadow:
                        "0 25px 60px rgba(0,0,0,.38)",

                      background:
                        "#0B171C",
                    }}
                  >

                    <Image
                      src={
                        isPlaying
                          ? CREATOR_IMAGE
                          : KD_LOGO
                      }
                      alt={
                        isPlaying
                          ? "Kyamagero"
                          : "Kyamagero Daily"
                      }
                      fill
                      sizes="310px"
                      style={{
                        objectFit:
                          "cover",
                      }}
                    />


                    <div
                      style={{
                        position:
                          "absolute",

                        inset:
                          0,

                        background:
                          "linear-gradient(180deg,transparent 42%,rgba(0,0,0,.68))",
                      }}
                    />


                    <div
                      style={{
                        position:
                          "absolute",

                        left:
                          20,

                        bottom:
                          20,

                        right:
                          20,
                      }}
                    >

                      <div
                        style={{
                          fontSize:
                            10,

                          fontWeight:
                            950,

                          letterSpacing:
                            2.5,

                          color:
                            "#D5AA62",
                        }}
                      >
                        {isPlaying
                          ? "KYAMAGERO"
                          : "KYAMAGERO DAILY"}
                      </div>


                      <div
                        style={{
                          marginTop:
                            5,

                          fontSize:
                            20,

                          fontWeight:
                            900,
                        }}
                      >
                        Season{" "}
                        {
                          currentEpisode.season ??
                          1
                        }
                      </div>

                    </div>

                  </div>


                  {/* INFORMATION */}

                  <div>

                    <div
                      style={{
                        display:
                          "flex",

                        alignItems:
                          "center",

                        gap:
                          10,

                        flexWrap:
                          "wrap",

                        marginBottom:
                          13,
                      }}
                    >

                      <span
                        style={{
                          color:
                            "#D5AA62",

                          fontSize:
                            10,

                          fontWeight:
                            950,

                          letterSpacing:
                            2.5,
                        }}
                      >
                        {isPlaying
                          ? "NOW PLAYING"
                          : "READY TO PLAY"}
                      </span>


                      <span
                        style={{
                          width:
                            4,

                          height:
                            4,

                          borderRadius:
                            "50%",

                          background:
                            "#8DA3AA",
                        }}
                      />


                      <span
                        style={{
                          color:
                            "#AEBCC0",

                          fontSize:
                            12,
                        }}
                      >
                        Season{" "}
                        {
                          currentEpisode.season ??
                          1
                        }

                        {" · "}

                        Episode{" "}
                        {
                          currentEpisode
                            .episode_number ??
                          1
                        }
                      </span>

                    </div>


                    <h2
                      style={{
                        margin:
                          0,

                        fontSize:
                          "clamp(30px,4vw,52px)",

                        lineHeight:
                          1,

                        letterSpacing:
                          -2,

                        fontWeight:
                          900,
                      }}
                    >
                      {
                        currentEpisode
                          .episode_title ??
                        currentEpisode.title
                      }
                    </h2>


                    <div
                      style={{
                        marginTop:
                          16,

                        color:
                          "#AEBCC0",

                        fontSize:
                          13,
                      }}
                    >

                      Published{" "}
                      {
                        formatDate(
                          currentEpisode
                            .published_at
                        )
                      }

                      {currentEpisode.duration &&
                        currentEpisode.duration >
                          0 && (

                          <>
                            {" · "}
                            {
                              formatDuration(
                                currentEpisode
                                  .duration
                              )
                            }
                          </>

                        )}

                    </div>


                    <div
                      style={{
                        marginTop:
                          28,
                      }}
                    >

                      {getAudioUrl(
                        currentEpisode
                      ) ? (

                        <audio
                          key={
                            currentEpisode
                              .audio_filename
                          }
                          controls
                          preload="metadata"
                          src={
                            getAudioUrl(
                              currentEpisode
                            ) ??
                            undefined
                          }
                          onPlay={() =>
                            setIsPlaying(
                              true
                            )
                          }
                          onPause={() =>
                            setIsPlaying(
                              false
                            )
                          }
                          onEnded={() =>
                            setIsPlaying(
                              false
                            )
                          }
                          style={{
                            width:
                              "100%",
                          }}
                        />

                      ) : (

                        <div
                          style={{
                            padding:
                              16,

                            borderRadius:
                              12,

                            background:
                              "rgba(255,255,255,.08)",

                            color:
                              "#D5AA62",
                          }}
                        >
                          Audio unavailable
                          for this episode.
                        </div>

                      )}

                    </div>

                  </div>

                </div>

              </section>


              {/* =================================================
                  EPISODES
              ================================================== */}

              <section
                id="episodes"
              >

                <div
                  style={{
                    display:
                      "flex",

                    justifyContent:
                      "space-between",

                    alignItems:
                      "flex-end",

                    gap:
                      20,

                    marginBottom:
                      28,
                  }}
                >

                  <div>

                    <div
                      style={{
                        color:
                          "#B48A45",

                        fontSize:
                          10,

                        fontWeight:
                          950,

                        letterSpacing:
                          3,

                        marginBottom:
                          10,
                      }}
                    >
                      {
                        currentEpisode
                          .season_title ??
                        `SEASON ${
                          currentEpisode
                            .season ??
                          1
                        }`
                      }
                    </div>


                    <h2
                      style={{
                        margin:
                          0,

                        fontSize:
                          "clamp(34px,4vw,52px)",

                        letterSpacing:
                          -2,
                      }}
                    >
                      Episodes
                    </h2>


                    <p
                      style={{
                        margin:
                          "10px 0 0",

                        color:
                          "#777",

                        fontSize:
                          14,
                      }}
                    >
                      Continue listening
                      from where the
                      previous episode ends.
                    </p>

                  </div>


                  <div
                    style={{
                      color:
                        "#777",

                      fontSize:
                        13,

                      fontWeight:
                        800,
                    }}
                  >
                    {episodes.length}
                    {" "}
                    episodes
                  </div>

                </div>


                <div
                  style={{
                    display:
                      "grid",

                    gap:
                      12,
                  }}
                >

                  {sortedEpisodes.map(
                    (
                      episode
                    ) => {

                      const active =
                        currentEpisode
                          .episode_number ===
                        episode
                          .episode_number;


                      return (

                        <button
                          key={
                            episode
                              .episode
                          }
                          type="button"
                          onClick={() =>
                            selectEpisode(
                              episode
                            )
                          }
                          style={{
                            width:
                              "100%",

                            border:
                              active
                                ? "1px solid rgba(180,138,69,.55)"
                                : "1px solid rgba(21,56,72,.08)",

                            background:
                              active
                                ? "linear-gradient(90deg,#FFF9EE,#FFFFFF)"
                                : "#FFFFFF",

                            borderRadius:
                              22,

                            padding:
                              "18px 20px",

                            cursor:
                              "pointer",

                            textAlign:
                              "left",

                            display:
                              "grid",

                            gridTemplateColumns:
                              "58px minmax(0,1fr) auto",

                            gap:
                              18,

                            alignItems:
                              "center",

                            boxShadow:
                              active
                                ? "0 12px 35px rgba(21,56,72,.10)"
                                : "0 5px 18px rgba(21,56,72,.04)",
                          }}
                        >

                          <div
                            style={{
                              width:
                                50,

                              height:
                                50,

                              borderRadius:
                                15,

                              overflow:
                                "hidden",

                              position:
                                "relative",

                              flexShrink:
                                0,

                              background:
                                "#10242C",
                            }}
                          >

                            <Image
                              src={
                                KD_LOGO
                              }
                              alt=""
                              fill
                              sizes="50px"
                              style={{
                                objectFit:
                                  "cover",
                              }}
                            />


                            <div
                              style={{
                                position:
                                  "absolute",

                                inset:
                                  0,

                                display:
                                  "flex",

                                alignItems:
                                  "center",

                                justifyContent:
                                  "center",

                                background:
                                  "rgba(0,0,0,.42)",

                                color:
                                  "#FFFFFF",

                                fontSize:
                                  12,

                                fontWeight:
                                  950,
                              }}
                            >
                              {String(
                                episode
                                  .episode_number ??
                                0
                              ).padStart(
                                2,
                                "0"
                              )}
                            </div>

                          </div>


                          <div
                            style={{
                              minWidth:
                                0,
                            }}
                          >

                            <div
                              style={{
                                display:
                                  "flex",

                                alignItems:
                                  "center",

                                gap:
                                  9,

                                marginBottom:
                                  5,
                              }}
                            >

                              <span
                                style={{
                                  color:
                                    "#B48A45",

                                  fontSize:
                                    9,

                                  fontWeight:
                                    950,

                                  letterSpacing:
                                    1.5,
                                }}
                              >
                                EPISODE{" "}
                                {
                                  episode
                                    .episode_number ??
                                  0
                                }
                              </span>


                              {active && (

                                <span
                                  style={{
                                    fontSize:
                                      9,

                                    fontWeight:
                                      900,

                                    color:
                                      "#2D7A58",
                                  }}
                                >
                                  SELECTED
                                </span>

                              )}

                            </div>


                            <div
                              style={{
                                color:
                                  "#153848",

                                fontSize:
                                  16,

                                fontWeight:
                                  900,

                                whiteSpace:
                                  "nowrap",

                                overflow:
                                  "hidden",

                                textOverflow:
                                  "ellipsis",
                              }}
                            >
                              {
                                episode
                                  .episode_title ??
                                episode.title
                              }
                            </div>


                            <div
                              style={{
                                marginTop:
                                  5,

                                color:
                                  "#888",

                                fontSize:
                                  12,
                              }}
                            >
                              {
                                episode
                                  .season_title ??
                                `Season ${
                                  episode
                                    .season ??
                                  1
                                }`
                              }

                              {" · "}

                              {
                                formatDate(
                                  episode
                                    .published_at
                                )
                              }
                            </div>

                          </div>


                          <div
                            style={{
                              display:
                                "flex",

                              alignItems:
                                "center",

                              gap:
                                16,
                            }}
                          >

                            {episode.duration &&
                              episode.duration >
                                0 && (

                                <span
                                  style={{
                                    color:
                                      "#777",

                                    fontSize:
                                      12,

                                    fontWeight:
                                      700,
                                  }}
                                >
                                  {
                                    formatDuration(
                                      episode
                                        .duration
                                    )
                                  }
                                </span>

                              )}


                            <span
                              style={{
                                width:
                                  40,

                                height:
                                  40,

                                borderRadius:
                                  "50%",

                                background:
                                  active
                                    ? "#B48A45"
                                    : "#153848",

                                color:
                                  active
                                    ? "#101A1E"
                                    : "#FFFFFF",

                                display:
                                  "flex",

                                alignItems:
                                  "center",

                                justifyContent:
                                  "center",

                                fontSize:
                                  13,

                                fontWeight:
                                  900,
                              }}
                            >
                              ▶
                            </span>

                          </div>

                        </button>

                      );

                    }
                  )}

                </div>

              </section>

            </>

          )}

      </section>


      {/* =====================================================
          GLOBAL PLAYER
      ====================================================== */}

      <PlayerBar
        episode={
          playerEpisode
        }
        audioUrl={
          currentEpisode
            ? getAudioUrl(
                currentEpisode
              )
            : null
        }
      />

    </main>

  );

}