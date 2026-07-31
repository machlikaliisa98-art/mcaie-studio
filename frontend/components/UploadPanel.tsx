"use client";

import { useState } from "react";

type Props = {
  uploading: boolean;
  progress: number;
  onUpload: (mode: "studio" | "podcast") => void;
  onFileChange: (file: File | null) => void;
};

export default function UploadPanel({

  uploading,

  progress,

  onUpload,

  onFileChange,

}: Props) {

  const [mode, setMode] = useState<"studio" | "podcast">("podcast");

  return (

    <section
      style={{
        background: "rgba(17,28,45,.95)",
        border: "1px solid rgba(255,255,255,.08)",
        borderRadius: 20,
        padding: 30,
        marginBottom: 35,
      }}
    >

      <h2
        style={{
          marginTop: 0,
          color: "#FFFFFF",
          fontSize: 28,
          marginBottom: 8,
        }}
      >
        AI Production Studio
      </h2>

      <p
        style={{
          color: "#94A3B8",
          marginBottom: 28,
          lineHeight: 1.7,
        }}
      >
        Upload a recording and let MCAIE inspect, restore, master,
        transcribe, analyse and transform it into professional podcast
        episodes.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          marginBottom: 30,
        }}
      >

        <div
          onClick={() => setMode("studio")}
          style={{
            cursor: "pointer",
            padding: 24,
            borderRadius: 18,
            background:
              mode === "studio"
                ? "#F59E0B"
                : "#0D1726",
            color:
              mode === "studio"
                ? "#08101B"
                : "#FFFFFF",
            transition: ".25s",
          }}
        >

          <h3
            style={{
              marginTop: 0,
              marginBottom: 12,
            }}
          >
            🎙 Studio Production
          </h3>

          <p
            style={{
              lineHeight: 1.7,
            }}
          >
            Restore, clean and professionally master one complete recording while preserving its structure.
          </p>

        </div>

        <div
          onClick={() => setMode("podcast")}
          style={{
            cursor: "pointer",
            padding: 24,
            borderRadius: 18,
            background:
              mode === "podcast"
                ? "#F59E0B"
                : "#0D1726",
            color:
              mode === "podcast"
                ? "#08101B"
                : "#FFFFFF",
            transition: ".25s",
          }}
        >

          <h3
            style={{
              marginTop: 0,
              marginBottom: 12,
            }}
          >
            🎧 Podcast Production
          </h3>

          <p
            style={{
              lineHeight: 1.7,
            }}
          >
            Detect introductions, split long recordings into episodes,
            master every episode and generate AI knowledge automatically.
          </p>

        </div>

      </div>

      <div
        style={{
          border: "2px dashed rgba(255,255,255,.15)",
          borderRadius: 18,
          padding: 40,
          textAlign: "center",
          marginBottom: 28,
        }}
      >

        <h3
          style={{
            color: "#FFFFFF",
            marginBottom: 12,
          }}
        >
          Drag & Drop Audio
        </h3>

        <p
          style={{
            color: "#94A3B8",
            marginBottom: 20,
          }}
        >
          Supports MP3, WAV, M4A and other professional audio formats.
        </p>

        <input
          type="file"
          accept="audio/*"
          onChange={(e) =>
            onFileChange(
              e.target.files?.[0] ?? null
            )
          }
        />

      </div>

      <button
        disabled={uploading}
        onClick={() => onUpload(mode)}
        style={{
          background: "#F59E0B",
          color: "#08101B",
          fontWeight: 800,
          fontSize: 16,
          padding: "16px 34px",
          borderRadius: 14,
          border: "none",
        }}
      >
        {uploading
          ? "MCAIE Processing..."
          : "Start AI Production"}
      </button>

      {uploading && (

        <div
          style={{
            marginTop: 30,
          }}
        >

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 12,
              color: "#FFFFFF",
            }}
          >

            <span>

              Production Progress

            </span>

            <span>

              {progress}%

            </span>

          </div>

          <div
            style={{
              height: 12,
              borderRadius: 999,
              overflow: "hidden",
              background: "#1A2940",
            }}
          >

            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background:
                  "linear-gradient(90deg,#F59E0B,#FDBA2C)",
                transition: "width .3s",
              }}
            />

          </div>

        </div>

      )}

    </section>

  );

}