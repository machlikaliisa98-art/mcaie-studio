"use client";

import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

type Episode = {
  id: number;
  title: string;
  filename: string;
  job_id: string;
};

type Props = {
  episode: Episode;
  episodeUrl: (
    jobId: string,
    filename: string
  ) => string;
};

function formatTime(seconds: number) {
  if (!isFinite(seconds)) return "00:00";

  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) {
    return `${hrs}:${mins
      .toString()
      .padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }

  return `${mins}:${secs
    .toString()
    .padStart(2, "0")}`;
}

export default function EpisodeCard({
  episode,
  episodeUrl,
}: Props) {
  const waveformRef = useRef<HTMLDivElement>(null);
  const waveRef = useRef<WaveSurfer | null>(null);

  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    if (!waveformRef.current) return;

    waveRef.current?.destroy();

    const wave = WaveSurfer.create({
      container: waveformRef.current,
      url: episodeUrl(
        episode.job_id,
        episode.filename
      ),
      waveColor: "#304866",
      progressColor: "#D4AF37",
      cursorColor: "#ffffff",
      barWidth: 3,
      barRadius: 3,
      barGap: 2,
      height: 90,
      normalize: true,
    });

    waveRef.current = wave;

    wave.on("ready", () => {
      setDuration(wave.getDuration());
    });

    wave.on("timeupdate", (t) => {
      setCurrent(t);
    });

    wave.on("finish", () => {
      setPlaying(false);
    });

    return () => {
      wave.destroy();
    };
  }, [episode, episodeUrl]);

  function togglePlay() {
    if (!waveRef.current) return;

    waveRef.current.playPause();

    setPlaying(
      waveRef.current.isPlaying()
    );
  }

  return (
    <div
      style={{
        background: "#111C2D",
        borderRadius: 24,
        border: "1px solid rgba(255,255,255,.06)",
        overflow: "hidden",
        boxShadow: "0 25px 60px rgba(0,0,0,.35)",
      }}
    >
      <div
        style={{
          padding: 28,
          background:
            "linear-gradient(135deg,#132542,#0A1423)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                color: "#D6B04A",
                fontSize: 12,
                letterSpacing: 2,
                textTransform: "uppercase",
                fontWeight: 700,
                marginBottom: 8,
              }}
            >
              AI Produced Episode
            </div>

            <h2
              style={{
                color: "#fff",
                margin: 0,
                fontSize: 24,
              }}
            >
              {episode.title}
            </h2>
          </div>

          <div
            style={{
              padding: "8px 18px",
              borderRadius: 999,
              background: "rgba(255,255,255,.08)",
              color: "#D8E3F5",
              fontSize: 13,
            }}
          >
            Broadcast Ready
          </div>
        </div>
      </div>

      <div
        style={{
          padding: 28,
        }}
      >
        <div
          ref={waveformRef}
          style={{
            marginBottom: 28,
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "#8EA2BD",
            marginTop: 10,
          }}
        >
          <span>{formatTime(current)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 18,
            marginTop: 28,
          }}
        >
          <button
            style={{
              width: 54,
              height: 54,
              borderRadius: "50%",
              background: "#18273E",
              color: "#fff",
              border: "none",
              fontSize: 18,
            }}
            onClick={() => {
              waveRef.current?.skip(-10);
            }}
          >
            ⏪
          </button>

          <button
            onClick={togglePlay}
            style={{
              width: 74,
              height: 74,
              borderRadius: "50%",
              background: "#D4AF37",
              color: "#08101B",
              border: "none",
              fontSize: 26,
              fontWeight: 700,
              boxShadow:
                "0 0 35px rgba(212,175,55,.35)",
            }}
          >
            {playing ? "❚❚" : "▶"}
          </button>

          <button
            style={{
              width: 54,
              height: 54,
              borderRadius: "50%",
              background: "#18273E",
              color: "#fff",
              border: "none",
              fontSize: 18,
            }}
            onClick={() => {
              waveRef.current?.skip(30);
            }}
          >
            ⏩
          </button>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 30,
            alignItems: "center",
          }}
        >
          <select
            value={speed}
            onChange={(e) => {
              const v = Number(e.target.value);

              setSpeed(v);

              waveRef.current?.setPlaybackRate(v);
            }}
            style={{
              background: "#18273E",
              color: "#fff",
              padding: "10px 14px",
              borderRadius: 12,
              border: "none",
            }}
          >
            <option value={1}>1x</option>
            <option value={1.25}>1.25x</option>
            <option value={1.5}>1.5x</option>
            <option value={1.75}>1.75x</option>
            <option value={2}>2x</option>
          </select>

          <a
            href={episodeUrl(
              episode.job_id,
              episode.filename
            )}
            download
            style={{
              background: "#D4AF37",
              color: "#08101B",
              padding: "12px 24px",
              borderRadius: 12,
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Download
          </a>
        </div>
      </div>
    </div>
  );
}