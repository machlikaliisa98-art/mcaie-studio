type StatusPanelProps = {
  progress: number;
  episodes: number;
  uploading: boolean;
  jobId: string;
};

export default function StatusPanel({
  progress,
  episodes,
  uploading,
  jobId,
}: StatusPanelProps) {
  const cards = [
    {
      title: "Production",
      value: uploading ? "Running" : "Ready",
      color: "#00C853",
    },
    {
      title: "Episodes",
      value: episodes.toString(),
      color: "#D4AF37",
    },
    {
      title: "Progress",
      value: `${progress}%`,
      color: "#2196F3",
    },
    {
      title: "Job ID",
      value: jobId || "---",
      color: "#9C27B0",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
        gap: 20,
        marginBottom: 40,
      }}
    >
      {cards.map((card) => (
        <div
          key={card.title}
          style={{
            background: "#161616",
            border: "1px solid #2d2d2d",
            borderRadius: 20,
            padding: 25,
            boxShadow: "0 12px 30px rgba(0,0,0,.30)",
          }}
        >
          <div
            style={{
              color: "#888",
              fontSize: 14,
              marginBottom: 10,
            }}
          >
            {card.title}
          </div>

          <div
            style={{
              color: card.color,
              fontSize: 32,
              fontWeight: 700,
            }}
          >
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
}