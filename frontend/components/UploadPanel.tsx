"use client";

type Props = {
  uploading: boolean;
  progress: number;
  onUpload: (mode: "studio" | "podcast") => void;
  onFileChange: (file: File | null) => void;
};

export default function UploadPanel({
  uploading,
  progress,
  onUpload,
  onFileChange,
}: Props) {
  return (
    <section
      style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: 28,
        marginBottom: 50,
      }}
    >
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 32,
          padding: 34,
          border: "1px solid #E8DED0",
          boxShadow: "0 12px 30px rgba(0,0,0,.04)",
        }}
      >
        <div
          style={{
            color: "#B48A45",
            fontWeight: 700,
            marginBottom: 10,
            letterSpacing: 1,
          }}
        >
          FEATURED CREATOR
        </div>

        <h2
          style={{
            color: "#153848",
            fontSize: 36,
            marginBottom: 12,
          }}
        >
          Andrew Kyamagero
        </h2>

        <p
          style={{
            color: "#6F7477",
            lineHeight: 1.8,
            marginBottom: 28,
          }}
        >
          Public Figure, Speaker, Storyteller and Creator behind Kyamagero
          Daily and Man Cave UG.
        </p>

        <div
          style={{
            display: "flex",
            gap: 16,
            marginBottom: 30,
          }}
        >
          <button
            style={{
              background: "#123A4A",
              color: "#FFFFFF",
              border: "none",
              padding: "16px 28px",
              borderRadius: 999,
              fontWeight: 700,
            }}
          >
            Kyamagero Daily
          </button>

          <button
            style={{
              background: "#ECE3D6",
              color: "#123A4A",
              border: "none",
              padding: "16px 28px",
              borderRadius: 999,
              fontWeight: 700,
            }}
          >
            Man Cave UG
          </button>
        </div>

        <input
          type="file"
          accept="audio/*"
          onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
        />

        <div
          style={{
            marginTop: 24,
            display: "flex",
            gap: 16,
          }}
        >
          <button
            onClick={() => onUpload("podcast")}
            disabled={uploading}
            style={{
              background: "#B48A45",
              color: "#FFFFFF",
              border: "none",
              padding: "16px 28px",
              borderRadius: 999,
              fontWeight: 700,
            }}
          >
            {uploading ? "Producing..." : "Produce Episodes"}
          </button>

          <button
            onClick={() => onUpload("studio")}
            disabled={uploading}
            style={{
              background: "#123A4A",
              color: "#FFFFFF",
              border: "none",
              padding: "16px 28px",
              borderRadius: 999,
              fontWeight: 700,
            }}
          >
            Studio Master
          </button>
        </div>

        {uploading && (
          <div
            style={{
              marginTop: 28,
            }}
          >
            <div
              style={{
                height: 8,
                background: "#ECE3D6",
                borderRadius: 999,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  background: "#B48A45",
                }}
              />
            </div>

            <div
              style={{
                marginTop: 12,
                color: "#6F7477",
              }}
            >
              {progress}% • Capturing • Cleaning • Speaker ID • Chapters •
              Episodes • Publishing
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          background: "#123A4A",
          borderRadius: 32,
          padding: 30,
          color: "#FFFFFF",
        }}
      >
        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            marginBottom: 22,
          }}
        >
          Creator Brands
        </div>

        <div
          style={{
            background: "rgba(255,255,255,.08)",
            borderRadius: 20,
            padding: 20,
            marginBottom: 18,
          }}
        >
          <div
            style={{
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            Kyamagero Daily
          </div>

          <div
            style={{
              opacity: .8,
              lineHeight: 1.6,
            }}
          >
            Inspirational talks, leadership and personal growth.
          </div>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,.08)",
            borderRadius: 20,
            padding: 20,
          }}
        >
          <div
            style={{
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            Man Cave UG
          </div>

          <div
            style={{
              opacity: .8,
              lineHeight: 1.6,
            }}
          >
            X Spaces, podcasts, debates and long-form conversations.
          </div>
        </div>
      </div>
    </section>
  );
}