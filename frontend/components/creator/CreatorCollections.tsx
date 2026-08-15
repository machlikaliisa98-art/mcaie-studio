"use client";

type Props = {
  showTitle?: string;
  programmeTitle?: string;
  episodeCount?: number;
};

export default function CreatorCollections({
  showTitle,
  programmeTitle,
  episodeCount,
}: Props) {
  return (
    <section
      style={{
        background: "#FFFFFF",
        borderRadius: 30,
        padding: 38,
        minHeight: 270,
        boxShadow: "0 12px 32px rgba(21,56,72,.05)",
      }}
    >
      <div
        style={{
          color: "#B48A45",
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: 2,
          textTransform: "uppercase",
          marginBottom: 12,
        }}
      >
        FONS library
      </div>

      <h2
        style={{
          margin: 0,
          color: "#153848",
          fontSize: 34,
          letterSpacing: -1,
        }}
      >
        Explore the work
      </h2>

      <div
        style={{
          marginTop: 25,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "42px 1fr 35px",
            gap: 15,
            alignItems: "center",
            padding: "15px 0",
            borderBottom: "1px solid #EAE4DA",
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: "#F1ECE3",
              color: "#B48A45",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 12,
            }}
          >
            01
          </div>

          <div>
            <strong
              style={{
                display: "block",
                color: "#153848",
                fontSize: 15,
              }}
            >
              {showTitle || "Kyamagero Daily"}
            </strong>

            <span
              style={{
                display: "block",
                marginTop: 4,
                color: "#777",
                fontSize: 12,
                lineHeight: 1.5,
              }}
            >
              {programmeTitle || "Published programme"}
            </span>
          </div>

          <span
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "#153848",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 15,
            }}
          >
            →
          </span>
        </div>

        <div
          style={{
            paddingTop: 18,
            color: "#777",
            fontSize: 13,
          }}
        >
          {episodeCount ?? 0} published episodes
        </div>
      </div>
    </section>
  );
}