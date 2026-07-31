"use client";

import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import DashboardStats from "../components/DashboardStats";
import UploadPanel from "../components/UploadPanel";
import EpisodeGrid from "../components/EpisodeGrid";

import { uploadAudio } from "../services/upload";
import { getEpisodes, episodeUrl } from "../services/episodes";
import { getJob } from "../services/jobs";
import { getDashboard } from "../services/dashboard";

export default function Home() {

  const [file, setFile] = useState<File | null>(null);

  const [uploading, setUploading] = useState(false);

  const [progress, setProgress] = useState(0);

  const [jobId, setJobId] = useState("");

  const [episodes, setEpisodes] = useState<any[]>([]);

  async function handleUpload(
    mode: "studio" | "podcast"
  ) {

    if (!file) {

      alert("Select an audio recording first.");

      return;

    }

    setUploading(true);

    setProgress(0);

    setEpisodes([]);

    setJobId("");

    try {

      const result = await uploadAudio(

        file,

        mode,

        (value) => {

          setProgress(value);

        }

      );

      setJobId(result.job_id);

    }

    catch (error) {

      console.error(error);

      alert("Upload failed.");

      setUploading(false);

    }

  }

  useEffect(() => {

    if (!jobId) return;

    let cancelled = false;

    let timer: NodeJS.Timeout;

    async function poll() {

      if (cancelled) return;

      try {

        const [job, list] = await Promise.all([

          getJob(jobId),

          getEpisodes(jobId),

        ]);

        if (cancelled) return;

        setProgress(job.progress);

        setEpisodes(list);

        if (job.stage === "Completed") {

          setUploading(false);

          setProgress(100);

          return;

        }

        if (

          job.stage === "Failed" ||

          job.status === "failed"

        ) {

          setUploading(false);

          alert(job.error || "Processing failed.");

          return;

        }

        timer = setTimeout(

          poll,

          3000

        );

      }

      catch (error) {

        console.error(error);

        timer = setTimeout(

          poll,

          5000

        );

      }

    }

    poll();

    return () => {

      cancelled = true;

      clearTimeout(timer);

    };

  }, [jobId]);

  return (

    <main
      style={{
        display: "flex",
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#07111F,#0C1830,#11264A)",
      }}
    >

      <Sidebar />

      <section
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >

        <Header />

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 36,
          }}
        >

          <div
            style={{
              marginBottom: 28,
            }}
          >

            <h1
              style={{
                fontSize: 34,
                fontWeight: 800,
                marginBottom: 8,
              }}
            >
              Man Cave UG AI Studio
            </h1>

            <p
              style={{
                color: "#A7B3C7",
                fontSize: 15,
              }}
            >
              Powered by MCAIE • Professional AI Podcast Production Platform
            </p>

          </div>

          <DashboardStats
            uploading={uploading}
            progress={progress}
            episodes={episodes.length}
          />

          <div
            style={{
              height: 24,
            }}
          />

          <UploadPanel
            uploading={uploading}
            progress={progress}
            onUpload={handleUpload}
            onFileChange={setFile}
          />

          <div
            style={{
              height: 30,
            }}
          />

          <EpisodeGrid
            episodes={episodes}
            episodeUrl={episodeUrl}
          />

        </div>

      </section>

    </main>

  );

}