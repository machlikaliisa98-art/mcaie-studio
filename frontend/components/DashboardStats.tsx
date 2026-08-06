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
        background: "#FFFFFF",
        borderRadius: 28,
        padding: 28,
        border: "1px solid #E8DED0",
        boxShadow: "0 10px 30px rgba(0,0,0,.04)",
      }}
    >
      <div
        style={{
          color: "#8A8175",
          fontSize: 13,
          fontWeight: 600,
          marginBottom: 14,
          letterSpacing: 1,
          textTransform: "uppercase",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: 42,
          fontWeight: 700,
          color: "#153848",
          marginBottom: 12,
        }}
      >
        {value}
      </div>

      <div
        style={{
          color: "#6E7275",
          lineHeight: 1.7,
          fontSize: 15,
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
          gridTemplateColumns: "repeat(4,minmax(0,1fr))",
          gap: 22,
          marginBottom: 36,
        }}
      >
        <Card
          title="Creators"
          value="01"
          subtitle="Andrew Kyamagero"
        />

        <Card
          title="Channels"
          value="02"
          subtitle="Kyamagero Daily • Man Cave UG"
        />

        <Card
          title="Episodes"
          value={episodes}
          subtitle="Available inside FONS"
        />

        <Card
          title="Live"
          value={uploading ? "ON" : "READY"}
          subtitle="Studio Production"
        />
      </div>

      {uploading && (
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 28,
            border: "1px solid #E8DED0",
            padding: 30,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 18,
              color: "#153848",
              fontWeight: 700,
            }}
          >
            <span>FONS AI Production</span>
            <span>{progress}%</span>
          </div>

          <div
            style={{
              height: 10,
              background: "#ECE4D6",
              borderRadius: 999,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "#B48A45",
                transition: ".3s",
              }}
            />
          </div>

          <div
            style={{
              marginTop: 18,
              color: "#6E7275",
              lineHeight: 1.8,
            }}
          >
            Capturing • Cleaning • Speaker Identification • AI Chapters •
            Episode Splitting • Knowledge Graph • Publishing
          </div>
        </div>
      )}
    </>
  );
}