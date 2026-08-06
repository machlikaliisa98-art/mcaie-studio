import EpisodeCard from "./EpisodeCard";

type Episode = {
  id: number;
  title: string;
  filename: string;
  job_id: string;
};

type Props = {
  episodes: Episode[];
  episodeUrl: (
    jobId: string,
    filename: string
  ) => string;
};

export default function EpisodeGrid({
  episodes,
  episodeUrl,
}: Props) {
  return (
    <section
      style={{
        marginTop: 40,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 28,
        }}
      >
        <div>
          <div
            style={{
              color: "#B48A45",
              fontWeight: 700,
              letterSpacing: 1,
              marginBottom: 10,
            }}
          >
            CONTINUE LISTENING
          </div>

          <h2
            style={{
              color: "#153848",
              fontSize: 38,
              margin: 0,
            }}
          >
            Episodes For You
          </h2>
        </div>

        <button
          style={{
            background: "#123A4A",
            color: "#FFFFFF",
            border: "none",
            borderRadius: 999,
            padding: "14px 26px",
            fontWeight: 700,
          }}
        >
          View Library
        </button>
      </div>

      {episodes.length === 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 24,
          }}
        >
          {[1, 2, 3].map((card) => (
            <div
              key={card}
              style={{
                background: "#FFFFFF",
                borderRadius: 30,
                border: "1px solid #E7DED0",
                overflow: "hidden",
                boxShadow: "0 12px 28px rgba(0,0,0,.04)",
              }}
            >
              <div
                style={{
                  height: 210,
                  background: "#D7CEC0",
                }}
              />

              <div
                style={{
                  padding: 24,
                }}
              >
                <div
                  style={{
                    color: "#B48A45",
                    fontSize: 13,
                    fontWeight: 700,
                    marginBottom: 10,
                  }}
                >
                  ANDREW KYAMAGERO
                </div>

                <h3
                  style={{
                    color: "#153848",
                    marginBottom: 12,
                    lineHeight: 1.4,
                  }}
                >
                  Featured Conversation
                </h3>

                <p
                  style={{
                    color: "#6F7477",
                    lineHeight: 1.8,
                    marginBottom: 20,
                  }}
                >
                  This space will automatically be replaced by real episodes
                  from the backend once production is complete.
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: "#8A8A8A",
                    fontSize: 14,
                  }}
                >
                  <span>45 min</span>

                  <span>▶ Listen</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(360px,1fr))",
            gap: 24,
          }}
        >
          {episodes.map((episode) => (
            <EpisodeCard
              key={`${episode.job_id}-${episode.filename}`}
              episode={episode}
              episodeUrl={episodeUrl}
            />
          ))}
        </div>
      )}
    </section>
  );
}