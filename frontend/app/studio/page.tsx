"use client";

import { useEffect, useRef, useState } from "react";

const API = "http://127.0.0.1:8000";

export default function StudioPage() {
  const [splitAudio, setSplitAudio] = useState(false);

const [file, setFile] = useState<File | null>(null);

const [uploading, setUploading] = useState(false);

const [jobId, setJobId] = useState("");

const [status, setStatus] = useState("Waiting...");

const [progress, setProgress] = useState(0);

const pollRef = useRef<NodeJS.Timeout | null>(null);

useEffect(() => {

  if (!jobId) return;

  pollRef.current = setInterval(async () => {

    try {

      const response = await fetch(

        API + "/jobs/" + jobId

      );

      if (!response.ok) return;

      const job = await response.json();

      setStatus(job.status);

      setProgress(job.progress);

      if (

        job.status === "Completed" ||

        job.progress >= 100

      ) {

        setUploading(false);

        if (pollRef.current)

          clearInterval(pollRef.current);

      }

    } catch (err) {

      console.error(err);

    }

  }, 1000);

  return () => {

    if (pollRef.current)

      clearInterval(pollRef.current);

  };

}, [jobId]);

async function runAI() {

  if (!file) {
    alert("Please choose an audio file.");
    return;
  }

  try {

    setUploading(true);

    const form = new FormData();

    form.append("file", file);

    form.append("mode", "podcast");

    form.append("enhance_audio", "true");

    form.append("normalize_audio", "true");

    form.append("transcribe", "true");

    form.append("summarize", "true");

    form.append("keywords", "true");

    form.append("topics", "true");

    form.append("chapters", "true");

    form.append("speaker_identification", "true");

    form.append("split_audio", String(splitAudio));

    form.append("split_method", "ai");

    form.append("split_minutes", "20");

    form.append("publish_to", "download");

    const response = await fetch(API + "/upload", {
      method: "POST",
      body: form,
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const data = await response.json();

    setJobId(data.job_id);

  } catch (e) {

    console.error(e);

    alert("Upload failed.");

    setUploading(false);

  }

}

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#F6F1E8",
        padding: 40,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            color: "#153848",
            fontSize: 42,
            marginBottom: 10,
          }}
        >
          Studio
        </h1>

        <p
          style={{
            color: "#666",
            marginBottom: 40,
            fontSize: 18,
          }}
        >
          Process, enhance and publish conversations using the FONS AI Engine.
        </p>

        {/* Upload */}

        <div
          style={{
            background: "#fff",
            borderRadius: 24,
            padding: 40,
            marginBottom: 30,
            border: "2px dashed #B48A45",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              color: "#153848",
              marginBottom: 10,
            }}
          >
            Upload Audio
          </h2>

          <p
            style={{
              color: "#777",
              marginBottom: 25,
            }}
          >
            Drag & Drop or choose an audio file.
          </p>

          <input
  type="file"
  accept="audio/*"
  onChange={(e) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0]);
    }
  }}
/>

{file && (
  <p
    style={{
      marginTop: 15,
      color: "#153848",
      fontWeight: 700,
    }}
  >
    {file.name}
  </p>
)}
        </div>

        {/* Processing */}

        <div
          style={{
            background: "#fff",
            borderRadius: 24,
            padding: 35,
            marginBottom: 30,
          }}
        >
          <h2
            style={{
              color: "#153848",
              marginBottom: 25,
            }}
          >
            AI Processing
          </h2>

          <Option text="Audio Enhancement" defaultChecked />
          <Option text="Noise Reduction" defaultChecked />
          <Option text="Normalize Audio" defaultChecked />
          <Option text="Speaker Identification" defaultChecked />
          <Option text="Transcript" defaultChecked />
          <Option text="AI Summary" defaultChecked />
          <Option text="Keywords" defaultChecked />
          <Option text="Chapters" defaultChecked />

          <div style={{ marginTop: 18 }}>
            <label
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                fontWeight: 600,
              }}
            >
              <input
                type="checkbox"
                checked={splitAudio}
                onChange={(e) =>
                  setSplitAudio(e.target.checked)
                }
              />

              Episode Split
            </label>
          </div>

          {splitAudio && (
            <div
              style={{
                marginTop: 25,
                padding: 20,
                background: "#F8F8F8",
                borderRadius: 16,
              }}
            >
              <h3
                style={{
                  color: "#153848",
                }}
              >
                Split Options
              </h3>

              <div style={{ marginTop: 15 }}>
                <label>
                  <input
                    type="radio"
                    name="split"
                    defaultChecked
                  />{" "}
                  AI Automatic
                </label>
              </div>

              <div style={{ marginTop: 10 }}>
                <label>
                  <input
                    type="radio"
                    name="split"
                  />{" "}
                  Fixed Length
                </label>
              </div>

              <div
                style={{
                  marginTop: 18,
                }}
              >
                Length

                <br />

                <input
                  defaultValue="20"
                  style={{
                    width: 100,
                    marginTop: 10,
                    padding: 10,
                  }}
                />

                {" "}minutes
              </div>
            </div>
          )}
        </div>

        {/* Destination */}

        <div
          style={{
            background: "#fff",
            borderRadius: 24,
            padding: 35,
            marginBottom: 30,
          }}
        >
          <h2
            style={{
              color: "#153848",
            }}
          >
            Publish Destination
          </h2>

          <div style={{ marginTop: 20 }}>

            <Radio text="Download Only" />

            <Radio
              text="Kyamagero Daily"
              checked
            />

            <Radio text="Man Cave UG" />

          </div>
        </div>

        {/* Progress */}

        <div
          style={{
            background: "#fff",
            borderRadius: 24,
            padding: 35,
            marginBottom: 30,
          }}
        >
          <h2
            style={{
              color: "#153848",
              marginBottom: 20,
            }}
          >
            Processing Status
          </h2>

          <Status
  name="Current Status"
  value={status}
/>

<Status
  name="Progress"
  value={`${progress}%`}
/>
        </div>

        <button
  onClick={runAI}
  disabled={uploading}
  style={{
    width: "100%",
    padding: 22,
    border: "none",
    borderRadius: 999,
    background: "#153848",
    color: "#fff",
    fontSize: 18,
    fontWeight: 700,
    cursor: "pointer",
    opacity: uploading ? 0.7 : 1,
  }}
>
  {uploading
    ? `Processing ${progress}%`
    : "Run AI Processing"}
</button>
      </div>
    </main>
  );
}

function Option({
  text,
  defaultChecked = false,
}: {
  text: string;
  defaultChecked?: boolean;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          fontWeight: 600,
        }}
      >
        <input
          type="checkbox"
          defaultChecked={defaultChecked}
        />

        {text}
      </label>
    </div>
  );
}

function Radio({
  text,
  checked = false,
}: {
  text: string;
  checked?: boolean;
}) {
  return (
    <div style={{ marginBottom: 15 }}>
      <label>
        <input
          type="radio"
          name="destination"
          defaultChecked={checked}
        />{" "}
        {text}
      </label>
    </div>
  );
}

function Status({
  name,
  value = "Waiting...",
}: {
  name: string;
  value?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "14px 0",
        borderBottom: "1px solid #EEE",
      }}
    >
      <strong>{name}</strong>

      <span
  style={{
    color:
      value === "Completed"
        ? "green"
        : "#888",
    fontWeight: 600,
  }}
>
  {value}
</span>
    </div>
  );
}