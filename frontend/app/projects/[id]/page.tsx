"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { getProject } from "../../../services/projects";

export default function ProjectWorkspace() {

    const params = useParams();

    const id = params.id as string;

    const [project, setProject] = useState<any>(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {

        if (!id) return;

        loadProject();

    }, [id]);

    async function loadProject() {

        try {

            const data = await getProject(id);

            setProject(data);

        }

        catch (err) {

            console.error(err);

            setError("Project not found.");

        }

        finally {

            setLoading(false);

        }

    }

    if (loading) {

        return (

            <main style={{

                minHeight:"100vh",

                background:"#08131F",

                color:"#FFFFFF",

                display:"flex",

                justifyContent:"center",

                alignItems:"center",

                fontSize:24

            }}>

                Loading project...

            </main>

        );

    }

    if (error) {

        return (

            <main style={{

                minHeight:"100vh",

                background:"#08131F",

                color:"#FF6B6B",

                display:"flex",

                justifyContent:"center",

                alignItems:"center",

                fontSize:24

            }}>

                {error}

            </main>

        );

    }

    return (

        <main style={{

            minHeight:"100vh",

            background:"#08131F",

            padding:40,

            color:"#FFFFFF"

        }}>

            <div style={{

                display:"flex",

                justifyContent:"space-between",

                alignItems:"center",

                marginBottom:40

            }}>

                <div>

                    <h1 style={{

                        margin:0,

                        fontSize:42

                    }}>

                        {project.title}

                    </h1>

                    <p style={{

                        color:"#9FB4C9",

                        marginTop:10

                    }}>

                        Project ID • {project.id}

                    </p>

                </div>

                <div style={{

                    padding:"10px 20px",

                    borderRadius:999,

                    background:

                        project.status==="Completed"

                        ? "#1F7A45"

                        : project.status==="Failed"

                        ? "#8B1E2D"

                        : "#1D5F91"

                }}>

                    {project.status}

                </div>

            </div>

            <div style={{

                display:"grid",

                gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",

                gap:24

            }}>

                <Card

                    title="Mode"

                    value={project.mode}

                />

                <Card

                    title="Progress"

                    value={`${project.progress}%`}

                />

                <Card

                    title="Published"

                    value={project.published ? "Yes" : "No"}

                />

                <Card

                    title="Episodes"

                    value={String(project.episode_count)}

                />

            </div>

            <div style={{

                marginTop:40,

                background:"#13263D",

                borderRadius:24,

                padding:30

            }}>

                <h2>

                    MCAIE Workspace

                </h2>

                <p style={{

                    color:"#AFC2D8",

                    lineHeight:1.8

                }}>

                    This workspace will progressively display every artifact produced by MCAIE for this project.

                </p>

                <ul style={{

                    lineHeight:2,

                    color:"#D8E6F2"

                }}>

                    <li>Overview</li>

                    <li>Episodes</li>

                    <li>Transcript</li>

                    <li>Summary</li>

                    <li>Topics</li>

                    <li>Keywords</li>

                    <li>Knowledge</li>

                    <li>Analytics</li>

                    <li>Publishing</li>

                </ul>

            </div>

        </main>

    );

}

function Card({

    title,

    value,

}:{

    title:string;

    value:string;

}){

    return(

        <div style={{

            background:"#13263D",

            borderRadius:20,

            padding:24

        }}>

            <div style={{

                color:"#8FA5BF",

                marginBottom:12,

                fontSize:13,

                textTransform:"uppercase"

            }}>

                {title}

            </div>

            <div style={{

                fontSize:28,

                fontWeight:700

            }}>

                {value}

            </div>

        </div>

    );

}