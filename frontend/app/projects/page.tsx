"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getProjects } from "../../services/projects";

type Project = {
  id: string;
  title: string;
  mode: string;
  status: string;
  progress: number;
  created_at: string;
  updated_at: string;
  published: boolean;
};

export default function ProjectsPage() {

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    loadProjects();

  }, []);

  async function loadProjects() {

    try {

      const data = await getProjects();

      setProjects(data);

    }

    catch (err) {

      console.error(err);

      setError("Failed to load projects.");

    }

    finally {

      setLoading(false);

    }

  }

  if (loading) {

    return (

      <main
        style={{
          minHeight: "100vh",
          background: "#08131F",
          color: "#FFFFFF",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 22,
        }}
      >
        Loading Projects...
      </main>

    );

  }

  if (error) {

    return (

      <main
        style={{
          minHeight: "100vh",
          background: "#08131F",
          color: "#FF6B6B",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 22,
        }}
      >
        {error}
      </main>

    );

  }

  return (

    <main
      style={{
        minHeight: "100vh",
        background: "#08131F",
        padding: 40,
      }}
    >

      <h1
        style={{
          color: "#FFFFFF",
          fontSize: 42,
          marginBottom: 8,
        }}
      >
        Projects
      </h1>

      <p
        style={{
          color: "#9FB4C9",
          marginBottom: 40,
        }}
      >
        Every production processed by MCAIE.
      </p>

      <div
        style={{
          display: "grid",
          gap: 24,
        }}
      >

        {projects.map((project) => (

          <Link

            key={project.id}

            href={`/projects/${project.id}`}

            style={{

              textDecoration: "none",

            }}

          >

            <div
              style={{
                background: "#13263D",
                borderRadius: 24,
                padding: 28,
                border: "1px solid rgba(255,255,255,.06)",
                transition: ".25s",
                cursor: "pointer",
              }}
            >

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 24,
                }}
              >

                <div>

                  <h2
                    style={{
                      margin: 0,
                      color: "#FFFFFF",
                    }}
                  >
                    {project.title}
                  </h2>

                  <div
                    style={{
                      color: "#8EA2BD",
                      marginTop: 8,
                    }}
                  >
                    {project.id}
                  </div>

                </div>

                <div
                  style={{
                    padding: "8px 18px",
                    borderRadius: 999,
                    background:
                      project.status === "Completed"
                        ? "#1E8E5A"
                        : project.status === "Failed"
                        ? "#A93A3A"
                        : "#2D6AA3",
                    color: "#FFFFFF",
                    fontWeight: 700,
                  }}
                >
                  {project.status}
                </div>

              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit,minmax(180px,1fr))",
                  gap: 20,
                }}
              >

                <Info
                  title="Mode"
                  value={project.mode}
                />

                <Info
                  title="Progress"
                  value={`${project.progress}%`}
                />

                <Info
                  title="Published"
                  value={
                    project.published
                      ? "Yes"
                      : "No"
                  }
                />

                <Info
                  title="Created"
                  value={new Date(
                    project.created_at
                  ).toLocaleDateString()}
                />

              </div>

            </div>

          </Link>

        ))}

      </div>

    </main>

  );

}

function Info({

  title,

  value,

}: {

  title: string;

  value: string;

}) {

  return (

    <div>

      <div
        style={{
          color: "#89A2BB",
          fontSize: 12,
          textTransform: "uppercase",
          marginBottom: 8,
        }}
      >
        {title}
      </div>

      <div
        style={{
          color: "#FFFFFF",
          fontSize: 20,
          fontWeight: 700,
        }}
      >
        {value}
      </div>

    </div>

  );

}