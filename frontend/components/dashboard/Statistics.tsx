type Props = {
  duration?: string;
  episodes: number;
  quality?: string;
  status: string;
};

export default function Statistics({
  duration = "--",
  episodes,
  quality = "192 kbps",
  status,
}: Props) {
  const cards = [
    {
      title: "Recording Length",
      value: duration,
      icon: "⏱",
    },
    {
      title: "Episodes",
      value: episodes,
      icon: "🎧",
    },
    {
      title: "Audio Quality",
      value: quality,
      icon: "🎵",
    },
    {
      title: "Status",
      value: status,
      icon: "🚀",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
        gap: 20,
        marginTop: 30,
        marginBottom: 40,
      }}
    >
      {cards.map((card) => (
        <div
          key={card.title}
          style={{
            background: "#181818",
            border: "1px solid #2b2b2b",
            borderRadius: 16,
            padding: 24,
            transition: ".2s",
          }}
        >
          <div
            style={{
              fontSize: 36,
              marginBottom: 15,
            }}
          >
            {card.icon}
          </div>

          <div
            style={{
              color: "#888",
              fontSize: 14,
            }}
          >
            {card.title}
          </div>

          <div
            style={{
              color: "#D4AF37",
              fontSize: 30,
              fontWeight: 700,
              marginTop: 8,
            }}
          >
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
}