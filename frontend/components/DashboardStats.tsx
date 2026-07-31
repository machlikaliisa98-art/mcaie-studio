type Props = {
  uploading: boolean;
  progress: number;
  episodes: number;
};

function Card({

  title,

  value,

  subtitle,

}: {

  title: string;

  value: string | number;

  subtitle: string;

}) {

  return (

    <div
      style={{
        background: "rgba(17,28,45,.92)",
        border: "1px solid rgba(255,255,255,.08)",
        borderRadius: 18,
        padding: 24,
      }}
    >

      <div
        style={{
          color: "#94A3B8",
          fontSize: 13,
          fontWeight: 700,
          marginBottom: 12,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        {title}
      </div>

      <div
        style={{
          color: "#FFFFFF",
          fontSize: 38,
          fontWeight: 800,
          marginBottom: 10,
        }}
      >
        {value}
      </div>

      <div
        style={{
          color: "#CBD5E1",
          fontSize: 14,
          lineHeight: 1.6,
        }}
      >
        {subtitle}
      </div>

    </div>

  );

}

export default function DashboardStats({

  uploading,

  progress,

  episodes,

}: Props) {

  return (

    <>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(240px,1fr))",
          gap: 22,
          marginBottom: 30,
        }}
      >

        <Card
          title="Studio Status"
          value={uploading ? "Running" : "Ready"}
          subtitle={
            uploading
              ? "MCAIE is processing your production."
              : "Studio is waiting for the next recording."
          }
        />

        <Card
          title="Pipeline Progress"
          value={`${progress}%`}
          subtitle="Real time production progress from the backend."
        />

        <Card
          title="Episodes"
          value={episodes}
          subtitle="Podcast episodes successfully produced."
        />

        <Card
          title="AI Engine"
          value="MCAIE"
          subtitle="Speech • Language • Knowledge • Search"
        />

      </div>

      {uploading && (

        <div
          style={{
            background: "rgba(17,28,45,.92)",
            border: "1px solid rgba(255,255,255,.08)",
            borderRadius: 18,
            padding: 24,
            marginBottom: 30,
          }}
        >

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 14,
              color: "#FFFFFF",
              fontWeight: 700,
            }}
          >

            <span>

              MCAIE Production Pipeline

            </span>

            <span>

              {progress}%

            </span>

          </div>

          <div
            style={{
              width: "100%",
              height: 12,
              background: "#223248",
              borderRadius: 999,
              overflow: "hidden",
            }}
          >

            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background:
                  "linear-gradient(90deg,#F59E0B,#FDBA2C)",
                transition: "width .3s ease",
              }}
            />

          </div>

          <div
            style={{
              marginTop: 18,
              color: "#94A3B8",
              lineHeight: 1.7,
            }}
          >
            Audio Inspection • Normalization • Studio Mastering • Speech Recognition • Language Intelligence • Knowledge Generation • Semantic Search
          </div>

        </div>

      )}

    </>

  );

}