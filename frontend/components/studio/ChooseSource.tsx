"use client";

import { useState } from "react";

const sources = [
  {
    id: "upload",
    title: "Upload Audio",
    description: "Upload an MP3, WAV, M4A or other supported audio file.",
    icon: "🎙️",
  },
  {
    id: "live",
    title: "Record Live",
    description: "Start a live FONS studio session.",
    icon: "🔴",
  },
  {
    id: "xspace",
    title: "X Space",
    description: "Import an existing X Space recording.",
    icon: "𝕏",
  },
  {
    id: "zoom",
    title: "Zoom Meeting",
    description: "Import a recorded Zoom meeting.",
    icon: "💻",
  },
  {
    id: "meet",
    title: "Google Meet",
    description: "Import a Google Meet recording.",
    icon: "📹",
  },
  {
    id: "teams",
    title: "Microsoft Teams",
    description: "Import a Teams meeting recording.",
    icon: "👥",
  },
  {
    id: "radio",
    title: "Radio Broadcast",
    description: "Upload a recorded radio programme.",
    icon: "📻",
  },
  {
    id: "existing",
    title: "Existing Recording",
    description: "Continue processing a previously recorded conversation.",
    icon: "📁",
  },
];

export default function ChooseSource() {
  const [selected, setSelected] = useState("");

  return (
    <>
      <div
        style={{
          marginBottom: 35,
        }}
      >
        <h3
          style={{
            margin: 0,
            color: "#153848",
            fontSize: 34,
          }}
        >
          Choose Conversation Source
        </h3>

        <p
          style={{
            marginTop: 14,
            color: "#666",
            lineHeight: 1.8,
          }}
        >
          Select how this conversation will enter the FONS production
          engine.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(330px,1fr))",
          gap: 24,
        }}
      >
        {sources.map((source) => {
          const active = selected === source.id;

          return (
            <button
              key={source.id}
              onClick={() => setSelected(source.id)}
              style={{
                textAlign: "left",
                background: active ? "#153848" : "#FFFFFF",
                color: active ? "#FFFFFF" : "#153848",
                border: active
                  ? "2px solid #153848"
                  : "2px solid #E7DED2",
                borderRadius: 26,
                padding: 28,
                cursor: "pointer",
                transition: ".2s",
              }}
            >
              <div
                style={{
                  fontSize: 42,
                  marginBottom: 20,
                }}
              >
                {source.icon}
              </div>

              <div
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  marginBottom: 12,
                }}
              >
                {source.title}
              </div>

              <div
                style={{
                  lineHeight: 1.8,
                  opacity: active ? 0.9 : 0.7,
                }}
              >
                {source.description}
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}