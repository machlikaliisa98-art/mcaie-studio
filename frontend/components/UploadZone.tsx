"use client";

type Props = {
  onSelect?: (file: File | null) => void;
};

export default function UploadZone({
  onSelect,
}: Props) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 30,
        padding: 34,
        boxShadow: "0 14px 40px rgba(0,0,0,.05)",
      }}
    >
      <div
        style={{
          color: "#B48A45",
          letterSpacing: 2,
          fontWeight: 700,
          fontSize: 13,
          marginBottom: 10,
        }}
      >
        NEW PRODUCTION
      </div>

      <h2
        style={{
          marginTop: 0,
          color: "#153848",
          fontSize: 34,
        }}
      >
        Upload Conversation
      </h2>

      <p
        style={{
          color: "#666",
          lineHeight: 1.8,
          marginBottom: 30,
        }}
      >
        Upload a podcast, interview, meeting,
        livestream or any audio recording.
      </p>

      <label
        style={{
          display: "block",
          border: "2px dashed #D8D0C4",
          borderRadius: 24,
          background: "#FBF8F2",
          padding: "70px 30px",
          textAlign: "center",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            fontSize: 58,
            marginBottom: 18,
          }}
        >
          🎙️
        </div>

        <h3
          style={{
            margin: 0,
            color: "#153848",
          }}
        >
          Drag & Drop Audio
        </h3>

        <p
          style={{
            color: "#777",
            marginTop: 16,
            lineHeight: 1.8,
          }}
        >
          MP3 • WAV • FLAC • AAC • M4A
        </p>

        <div
          style={{
            marginTop: 30,
            display: "inline-block",
            background: "#153848",
            color: "#FFFFFF",
            padding: "16px 30px",
            borderRadius: 999,
            fontWeight: 700,
          }}
        >
          Browse Files
        </div>

        <input
          type="file"
          accept="audio/*"
          hidden
          onChange={(e) =>
            onSelect?.(
              e.target.files?.[0] ?? null
            )
          }
        />
      </label>

      <div
        style={{
          marginTop: 26,
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: 14,
        }}
      >
        {[
          "Speech Recognition",
          "Noise Removal",
          "Audio Mastering",
          "Speaker Detection",
          "Knowledge Generation",
          "Semantic Search",
        ].map((item) => (
          <div
            key={item}
            style={{
              background: "#F8F5EF",
              borderRadius: 16,
              padding: "16px 18px",
              color: "#153848",
              fontWeight: 600,
            }}
          >
            ✓ {item}
          </div>
        ))}
      </div>
    </div>
  );
}