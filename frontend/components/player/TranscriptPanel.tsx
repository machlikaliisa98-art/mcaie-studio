"use client";

type TranscriptSegment = {
  id: string;
  start: string;
  speaker: string;
  text: string;
  active?: boolean;
};

type Props = {
  transcript?: TranscriptSegment[];
};

export default function TranscriptPanel({
  transcript = [],
}: Props) {
  if (transcript.length === 0) {
    return (
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 30,
          padding: 40,
          boxShadow: "0 14px 40px rgba(0,0,0,.05)",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            color: "#153848",
          }}
        >
          Transcript
        </h2>

        <p
          style={{
            color: "#777",
            lineHeight: 1.8,
          }}
        >
          The transcript will appear here after this conversation
          has been processed.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 30,
        padding: 35,
        boxShadow: "0 14px 40px rgba(0,0,0,.05)",
      }}
    >
      <h2
        style={{
          marginTop: 0,
          marginBottom: 30,
          color: "#153848",
        }}
      >
        Transcript
      </h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 22,
          maxHeight: 700,
          overflowY: "auto",
        }}
      >
        {transcript.map((segment) => (
          <button
            key={segment.id}
            style={{
              textAlign: "left",
              background: segment.active
                ? "#F3ECE0"
                : "#FFFFFF",
              border: "none",
              borderRadius: 20,
              padding: 20,
              cursor: "pointer",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <strong
                style={{
                  color: "#153848",
                }}
              >
                {segment.speaker}
              </strong>

              <span
                style={{
                  color: "#B48A45",
                  fontWeight: 700,
                }}
              >
                {segment.start}
              </span>
            </div>

            <div
              style={{
                color: "#555",
                lineHeight: 1.9,
                fontSize: 17,
              }}
            >
              {segment.text}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}