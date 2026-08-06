"use client";

type Stage = {
  name: string;
  description: string;
  status: "completed" | "running" | "waiting";
};

export default function ProcessingView() {
  const stages: Stage[] = [
    {
      name: "Audio Inspection",
      description: "Validating audio quality and metadata.",
      status: "completed",
    },
    {
      name: "Audio Cleaning",
      description: "Removing background noise and unwanted silence.",
      status: "completed",
    },
    {
      name: "Studio Mastering",
      description: "Balancing and enhancing audio output.",
      status: "running",
    },
    {
      name: "Speaker Identification",
      description: "Detecting and separating speakers.",
      status: "waiting",
    },
    {
      name: "Transcript",
      description: "Generating a searchable transcript.",
      status: "waiting",
    },
    {
      name: "Summary",
      description: "Producing a concise conversation summary.",
      status: "waiting",
    },
    {
      name: "Topics",
      description: "Extracting discussion topics.",
      status: "waiting",
    },
    {
      name: "Key Quotes",
      description: "Identifying memorable quotations.",
      status: "waiting",
    },
    {
      name: "Episode Generation",
      description: "Splitting the conversation into episodes.",
      status: "waiting",
    },
    {
      name: "Publishing",
      description: "Publishing to the selected show.",
      status: "waiting",
    },
  ];

  return (
    <div>
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
          Processing Conversation
        </h2>

        <p
          style={{
            marginTop: 14,
            color: "#666",
            lineHeight: 1.8,
          }}
        >
          FONS is transforming your conversation into a complete
          knowledge experience.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        {stages.map((stage) => (
          <div
            key={stage.name}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#FBF8F3",
              borderRadius: 22,
              padding: "22px 26px",
            }}
          >
            <div>
              <div
                style={{
                  color: "#153848",
                  fontWeight: 700,
                  fontSize: 18,
                }}
              >
                {stage.name}
              </div>

              <div
                style={{
                  color: "#777",
                  marginTop: 6,
                }}
              >
                {stage.description}
              </div>
            </div>

            <StatusBadge status={stage.status} />
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: "completed" | "running" | "waiting";
}) {
  const map = {
    completed: {
      text: "Completed",
      bg: "#DFF6E8",
      color: "#157347",
    },
    running: {
      text: "Processing",
      bg: "#E7F0FF",
      color: "#1E4E9A",
    },
    waiting: {
      text: "Waiting",
      bg: "#EFE8DC",
      color: "#8A7D6B",
    },
  };

  const item = map[status];

  return (
    <div
      style={{
        background: item.bg,
        color: item.color,
        padding: "10px 18px",
        borderRadius: 999,
        fontWeight: 700,
        minWidth: 120,
        textAlign: "center",
      }}
    >
      {item.text}
    </div>
  );
}