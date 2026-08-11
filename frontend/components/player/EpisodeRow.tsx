"use client";

type Episode = {
  episode: string;
  title: string;
  published_at: string;
};

type Props = {
  episode: Episode;
  index: number;
  active: boolean;
  onSelect: () => void;
  formatDate: (value: string) => string;
};

export default function EpisodeRow({
  episode,
  index,
  active,
  onSelect,
  formatDate,
}: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      style={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: "56px minmax(0, 1fr) auto",
        gap: 20,
        alignItems: "center",
        padding: "22px 26px",
        border: "none",
        borderBottom: "1px solid #ECE8E1",
        background: active ? "#F1E9DC" : "#FFFFFF",
        color: "#153848",
        textAlign: "left",
        cursor: "pointer",
        transition:
          "background .18s ease, transform .18s ease",
      }}
      onMouseEnter={(event) => {
        if (!active) {
          event.currentTarget.style.background =
            "#FAF8F4";
        }
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.background = active
          ? "#F1E9DC"
          : "#FFFFFF";
      }}
    >
      <div
        style={{
          width: 46,
          height: 46,
          borderRadius: "50%",
          background: active ? "#153848" : "#F1ECE4",
          color: active ? "#FFFFFF" : "#153848",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
          fontWeight: 800,
        }}
      >
        {active ? "▶" : String(index + 1).padStart(2, "0")}
      </div>

      <div
        style={{
          minWidth: 0,
        }}
      >
        <div
          style={{
            color: "#B48A45",
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: 1.8,
            marginBottom: 6,
          }}
        >
          {episode.episode.toUpperCase()}
        </div>

        <div
          style={{
            color: "#153848",
            fontSize: 17,
            fontWeight: 750,
            lineHeight: 1.35,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {episode.title}
        </div>

        <div
          style={{
            color: "#888",
            fontSize: 12,
            marginTop: 5,
          }}
        >
          {formatDate(episode.published_at)}
        </div>
      </div>

      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: active ? "#B48A45" : "#153848",
          fontSize: 16,
          fontWeight: 800,
        }}
      >
        ▶
      </div>
    </button>
  );
}