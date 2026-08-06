"use client";

import { useState } from "react";

export default function ProductionOptions() {
  const [options, setOptions] = useState({
    cleanAudio: true,
    studioMaster: true,
    removeNoise: true,
    removeSilence: true,
    speakerRecognition: true,
    transcript: true,
    chapters: true,
    summary: true,
    quotes: true,
    topics: true,
    highlights: true,
    splitEpisodes: true,
    publishAutomatically: true,
  });

  const [episodeLength, setEpisodeLength] = useState("15");

  function toggle(name: keyof typeof options) {
    setOptions((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  }

  return (
    <>
      <div
        style={{
          marginBottom: 40,
        }}
      >
        <h2
          style={{
            margin: 0,
            color: "#153848",
            fontSize: 36,
          }}
        >
          Production Workflow
        </h2>

        <p
          style={{
            marginTop: 14,
            color: "#666",
            lineHeight: 1.8,
            maxWidth: 760,
          }}
        >
          Select what FONS should produce from this conversation.
        </p>
      </div>

      {/* AUDIO */}

      <Group title="Audio Production">
        <Option
          label="Clean Audio"
          checked={options.cleanAudio}
          onChange={() => toggle("cleanAudio")}
        />

        <Option
          label="Studio Mastering"
          checked={options.studioMaster}
          onChange={() => toggle("studioMaster")}
        />

        <Option
          label="Remove Background Noise"
          checked={options.removeNoise}
          onChange={() => toggle("removeNoise")}
        />

        <Option
          label="Remove Silence"
          checked={options.removeSilence}
          onChange={() => toggle("removeSilence")}
        />
      </Group>

      {/* KNOWLEDGE */}

      <Group title="Knowledge Generation">
        <Option
          label="Speaker Identification"
          checked={options.speakerRecognition}
          onChange={() => toggle("speakerRecognition")}
        />

        <Option
          label="Transcript"
          checked={options.transcript}
          onChange={() => toggle("transcript")}
        />

        <Option
          label="Chapter Detection"
          checked={options.chapters}
          onChange={() => toggle("chapters")}
        />

        <Option
          label="Conversation Summary"
          checked={options.summary}
          onChange={() => toggle("summary")}
        />

        <Option
          label="Key Quotes"
          checked={options.quotes}
          onChange={() => toggle("quotes")}
        />

        <Option
          label="Topics"
          checked={options.topics}
          onChange={() => toggle("topics")}
        />
      </Group>

      {/* DISTRIBUTION */}

      <Group title="Publishing">
        <Option
          label="Generate Highlights"
          checked={options.highlights}
          onChange={() => toggle("highlights")}
        />

        <Option
          label="Split into Episodes"
          checked={options.splitEpisodes}
          onChange={() => toggle("splitEpisodes")}
        />

        {options.splitEpisodes && (
          <div
            style={{
              marginTop: 22,
            }}
          >
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                color: "#153848",
                fontWeight: 700,
              }}
            >
              Episode Duration

              <select
                value={episodeLength}
                onChange={(e) =>
                  setEpisodeLength(e.target.value)
                }
                style={{
                  padding: 16,
                  borderRadius: 16,
                  border: "1px solid #DDD3C6",
                  background: "#FFFFFF",
                  fontSize: 16,
                }}
              >
                <option value="5">5 Minutes</option>
                <option value="10">10 Minutes</option>
                <option value="15">15 Minutes</option>
                <option value="20">20 Minutes</option>
                <option value="30">30 Minutes</option>
                <option value="45">45 Minutes</option>
                <option value="60">60 Minutes</option>
                <option value="custom">
                  Custom Duration
                </option>
              </select>
            </label>
          </div>
        )}

        <Option
          label="Publish Automatically"
          checked={options.publishAutomatically}
          onChange={() => toggle("publishAutomatically")}
        />
      </Group>
    </>
  );
}

type GroupProps = {
  title: string;
  children: React.ReactNode;
};

function Group({
  title,
  children,
}: GroupProps) {
  return (
    <section
      style={{
        background: "#FFFFFF",
        borderRadius: 24,
        padding: 30,
        marginBottom: 28,
        boxShadow: "0 10px 30px rgba(0,0,0,.04)",
      }}
    >
      <h3
        style={{
          marginTop: 0,
          color: "#153848",
        }}
      >
        {title}
      </h3>

      <div
        style={{
          display: "grid",
          gap: 18,
          marginTop: 24,
        }}
      >
        {children}
      </div>
    </section>
  );
}

type OptionProps = {
  label: string;
  checked: boolean;
  onChange: () => void;
};

function Option({
  label,
  checked,
  onChange,
}: OptionProps) {
  return (
    <label
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#FBF8F3",
        borderRadius: 18,
        padding: "18px 22px",
        cursor: "pointer",
      }}
    >
      <span
        style={{
          color: "#153848",
          fontWeight: 600,
        }}
      >
        {label}
      </span>

      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
    </label>
  );
}