"use client";

import { useEffect, useRef, useState } from "react";

type Episode = {
  episode: string;
  title: string;
  published_at: string;
};

type Props = {
  episode: Episode | null;
  audioUrl: string | null;
};

export default function PlayerBar({
  episode,
  audioUrl,
}: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !audioUrl) {
      return;
    }

    audio.pause();
    audio.currentTime = 0;
    setCurrentTime(0);
    setPlaying(false);
    setDuration(0);
  }, [audioUrl]);

  function togglePlayback() {
    const audio = audioRef.current;

    if (!audio || !audioUrl) {
      return;
    }

    if (audio.paused) {
      audio.play().catch(() => {
        setPlaying(false);
      });
    } else {
      audio.pause();
    }
  }

  function seek(event: React.ChangeEvent<HTMLInputElement>) {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    const value = Number(event.target.value);

    audio.currentTime = value;
    setCurrentTime(value);
  }

  function formatTime(value: number) {
    if (!Number.isFinite(value)) {
      return "0:00";
    }

    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60);

    return `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }

  if (!episode || !audioUrl) {
    return null;
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onLoadedMetadata={(event) => {
          setDuration(event.currentTarget.duration);
        }}
        onTimeUpdate={(event) => {
          setCurrentTime(event.currentTarget.currentTime);
        }}
      />

      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 100,
          background: "rgba(15,24,29,.97)",
          backdropFilter: "blur(18px)",
          borderTop: "1px solid rgba(255,255,255,.1)",
          boxShadow: "0 -20px 50px rgba(0,0,0,.18)",
        }}
      >
        <div
          style={{
            maxWidth: 1500,
            margin: "0 auto",
            padding: "13px 24px 14px",
            display: "grid",
            gridTemplateColumns:
              "minmax(230px, 320px) minmax(300px, 1fr)",
            gap: 28,
            alignItems: "center",
          }}
        >
          <div
            style={{
              minWidth: 0,
            }}
          >
            <div
              style={{
                color: "#B48A45",
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: 2,
                marginBottom: 5,
              }}
            >
              KYAMAGERO DAILY
            </div>

            <div
              style={{
                color: "#FFFFFF",
                fontSize: 15,
                fontWeight: 700,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {episode.title}
            </div>

            <div
              style={{
                color: "#87959B",
                fontSize: 11,
                marginTop: 3,
              }}
            >
              {episode.episode}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "48px 1fr",
              gap: 18,
              alignItems: "center",
            }}
          >
            <button
              type="button"
              onClick={togglePlayback}
              aria-label={
                playing ? "Pause episode" : "Play episode"
              }
              style={{
                width: 46,
                height: 46,
                borderRadius: "50%",
                border: "none",
                background: "#B48A45",
                color: "#153848",
                fontSize: 17,
                fontWeight: 900,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {playing ? "Ⅱ" : "▶"}
            </button>

            <div>
              <input
                type="range"
                min={0}
                max={duration || 0}
                step={0.1}
                value={Math.min(currentTime, duration || 0)}
                onChange={seek}
                style={{
                  width: "100%",
                  accentColor: "#B48A45",
                  cursor: "pointer",
                }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#87959B",
                  fontSize: 10,
                  marginTop: 3,
                }}
              >
                <span>{formatTime(currentTime)}</span>
                <span>
                  {duration ? formatTime(duration) : "--:--"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 700px) {
          div {
            box-sizing: border-box;
          }
        }
      `}</style>
    </>
  );
}