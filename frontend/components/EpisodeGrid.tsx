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

    <section>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 28,
        }}
      >

        <div>

          <h2
            style={{
              color: "#FFFFFF",
              fontSize: 32,
              fontWeight: 800,
              margin: 0,
            }}
          >
            Produced Episodes
          </h2>

          <p
            style={{
              color: "#94A3B8",
              marginTop: 10,
              lineHeight: 1.7,
            }}
          >
            Every completed production automatically becomes part of your
            searchable knowledge library.
          </p>

        </div>

        <div
          style={{
            background: "#F59E0B",
            color: "#08101B",
            padding: "12px 20px",
            borderRadius: 14,
            fontWeight: 800,
          }}
        >
          {episodes.length} Episode{episodes.length !== 1 ? "s" : ""}
        </div>

      </div>

      {episodes.length === 0 ? (

        <div
          style={{
            background: "rgba(17,28,45,.95)",
            border: "1px solid rgba(255,255,255,.08)",
            borderRadius: 18,
            padding: 70,
            textAlign: "center",
          }}
        >

          <h2
            style={{
              color: "#FFFFFF",
              marginBottom: 12,
            }}
          >
            No Productions Yet
          </h2>

          <p
            style={{
              color: "#94A3B8",
              maxWidth: 700,
              margin: "0 auto",
              lineHeight: 1.8,
            }}
          >
            Upload a recording and MCAIE will inspect the audio, restore it,
            master it, generate transcripts, summaries, keywords, topics and
            professionally produced podcast episodes.
          </p>

        </div>

      ) : (

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill,minmax(430px,1fr))",
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