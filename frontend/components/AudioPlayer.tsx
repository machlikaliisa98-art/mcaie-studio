"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
};

function formatTime(seconds: number) {
  if (!isFinite(seconds)) return "00:00";

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}

export default function AudioPlayer({ src }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const update = () => {
      setCurrent(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    const ended = () => setPlaying(false);

    audio.addEventListener("timeupdate", update);
    audio.addEventListener("loadedmetadata", update);
    audio.addEventListener("ended", ended);

    return () => {
      audio.removeEventListener("timeupdate", update);
      audio.removeEventListener("loadedmetadata", update);
      audio.removeEventListener("ended", ended);
    };
  }, []);

  function togglePlay() {
    const audio = audioRef.current;

    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play();
      setPlaying(true);
    }
  }

  function seek(seconds: number) {
    const audio = audioRef.current;

    if (!audio) return;

    audio.currentTime = Math.max(
      0,
      Math.min(audio.duration, audio.currentTime + seconds)
    );
  }

  return (
    <div
      style={{
        background: "#0B1E3D",
        borderRadius: 16,
        padding: 20,
      }}
    >
      <audio ref={audioRef} src={src} />

      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 18,
        }}
      >
        <button onClick={() => seek(-10)}>⏪ 10</button>

        <button onClick={togglePlay}>
          {playing ? "⏸ Pause" : "▶ Play"}
        </button>

        <button onClick={() => seek(10)}>10 ⏩</button>
      </div>

      <input
        type="range"
        min={0}
        max={duration || 0}
        value={current}
        onChange={(e) => {
          const audio = audioRef.current;
          if (!audio) return;
          audio.currentTime = Number(e.target.value);
        }}
        style={{ width: "100%" }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 8,
          color: "#FFFFFF",
        }}
      >
        <span>{formatTime(current)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      <div style={{ marginTop: 16 }}>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => {
            const value = Number(e.target.value);
            setVolume(value);

            if (audioRef.current) {
              audioRef.current.volume = value;
            }
          }}
          style={{ width: "100%" }}
        />
      </div>
    </div>
  );
}