"use client";

type Job = {
  id: string;
  title: string;
  status: string;
  progress: number;
};

type Props = {
  jobs?: Job[];
};

export default function ProductionQueue({
  jobs = [],
}: Props) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 30,
        padding: 34,
        boxShadow: "0 14px 40px rgba(0,0,0,.05)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 30,
        }}
      >
        <div>
          <div
            style={{
              color: "#B48A45",
              letterSpacing: 2,
              fontWeight: 700,
              fontSize: 13,
              marginBottom: 8,
              textTransform: "uppercase",
            }}
          >
            FONS Studio
          </div>

          <h2
            style={{
              margin: 0,
              color: "#153848",
              fontSize: 32,
              fontWeight: 700,
            }}
          >
            Current Activity
          </h2>
        </div>

        <div
          style={{
            background: "#F6F1E8",
            color: "#153848",
            padding: "10px 18px",
            borderRadius: 999,
            fontWeight: 700,
          }}
        >
          {jobs.length} Active
        </div>
      </div>

      {jobs.length === 0 ? (
        <div
          style={{
            border: "2px dashed #DDD3C6",
            borderRadius: 22,
            padding: "60px 30px",
            textAlign: "center",
            background: "#FBF8F3",
          }}
        >
          <div
            style={{
              fontSize: 54,
              marginBottom: 18,
            }}
          >
            🎙️
          </div>

          <h3
            style={{
              margin: 0,
              color: "#153848",
              fontSize: 28,
            }}
          >
            Nothing is processing yet.
          </h3>

          <p
            style={{
              marginTop: 18,
              color: "#777",
              lineHeight: 1.8,
              fontSize: 16,
              maxWidth: 520,
              marginInline: "auto",
            }}
          >
            Upload a conversation, podcast, interview or meeting and
            FONS will automatically prepare it for publishing while
            keeping you updated in real time.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {jobs.map((job) => (
            <div
              key={job.id}
              style={{
                background: "#FBF8F3",
                borderRadius: 20,
                padding: 22,
                border: "1px solid #EFE7DB",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 14,
                }}
              >
                <div>
                  <div
                    style={{
                      color: "#153848",
                      fontWeight: 700,
                      fontSize: 20,
                    }}
                  >
                    {job.title}
                  </div>

                  <div
                    style={{
                      color: "#777",
                      marginTop: 6,
                      fontSize: 15,
                    }}
                  >
                    {job.status}
                  </div>
                </div>

                <div
                  style={{
                    color: "#153848",
                    fontWeight: 700,
                    fontSize: 18,
                  }}
                >
                  {job.progress}%
                </div>
              </div>

              <div
                style={{
                  height: 10,
                  background: "#E8DFD3",
                  borderRadius: 999,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${job.progress}%`,
                    height: "100%",
                    background: "#B48A45",
                    transition: "width .35s ease",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}