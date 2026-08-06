"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const API = "http://127.0.0.1:8000";
const SHOW = "kyamagero-daily";

export default function KyamageroDailyPage() {

    const [episodes, setEpisodes] = useState<any[]>([]);
    const [selectedEpisode, setSelectedEpisode] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        load();

    }, []);

    async function load() {

        try {

            const response = await fetch(

                `${API}/shows/${SHOW}`

            );

            if (!response.ok) {

                setLoading(false);

                return;

            }

            const data = await response.json();

            setEpisodes(data);

            if (data.length > 0) {

                setSelectedEpisode(data[0]);

            }

        }

        catch (err) {

            console.error(err);

        }

        finally {

            setLoading(false);

        }

    }

    return (

        <main
            style={{
                background: "#F6F1E8",
                minHeight: "100vh",
            }}
        >

                        <section
                style={{
                    background: "#121417",
                    color: "#FFFFFF",
                    padding: "70px 70px 90px",
                }}
            >
                <div
                    style={{
                        maxWidth: 1450,
                        margin: "0 auto",
                    }}
                >
                    <Image
                        src="/kd-logo.png"
                        alt="Kyamagero Daily"
                        width={260}
                        height={260}
                        priority
                    />

                    <div
                        style={{
                            marginTop: 35,
                            color: "#B48A45",
                            fontSize: 13,
                            fontWeight: 700,
                            letterSpacing: 3,
                            textTransform: "uppercase",
                        }}
                    >
                        FONS ORIGINAL
                    </div>

                    <h1
                        style={{
                            marginTop: 16,
                            marginBottom: 20,
                            fontSize: 68,
                            lineHeight: 1.05,
                            fontWeight: 700,
                        }}
                    >
                        {loading
                            ? "Loading..."
                            : selectedEpisode?.title || "Kyamagero Daily"}
                    </h1>

                    <p
                        style={{
                            maxWidth: 850,
                            fontSize: 22,
                            lineHeight: 1.8,
                            color: "#DDD5CA",
                        }}
                    >
                        The official home of Kyamagero Daily on FONS. Every
                        published conversation, transcript and AI-generated
                        summary is available here immediately after processing
                        through MCAIE.
                    </p>

                    <div
                        style={{
                            display: "flex",
                            gap: 18,
                            marginTop: 40,
                            flexWrap: "wrap",
                        }}
                    >
                        <Link
                            href="/studio"
                            style={{
                                background: "#B48A45",
                                color: "#153848",
                                padding: "16px 30px",
                                borderRadius: 999,
                                textDecoration: "none",
                                fontWeight: 700,
                            }}
                        >
                            Open Studio
                        </Link>

                        <Link
                            href="/dashboard"
                            style={{
                                border: "1px solid rgba(255,255,255,.18)",
                                color: "#FFFFFF",
                                padding: "16px 30px",
                                borderRadius: 999,
                                textDecoration: "none",
                                fontWeight: 700,
                            }}
                        >
                            Dashboard
                        </Link>
                    </div>
                </div>
            </section>

            <section
                style={{
                    maxWidth: 1450,
                    margin: "50px auto",
                    padding: "0 20px",
                }}
            >

                                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "2fr 1fr",
                        gap: 30,
                        marginBottom: 45,
                    }}
                >

                    {/* Latest Episode */}

                    <div
                        style={{
                            background: "#FFFFFF",
                            borderRadius: 28,
                            padding: 36,
                            boxShadow: "0 12px 35px rgba(0,0,0,.05)",
                        }}
                    >

                        <div
                            style={{
                                color: "#B48A45",
                                fontWeight: 700,
                                fontSize: 13,
                                letterSpacing: 2,
                                marginBottom: 14,
                            }}
                        >
                            LATEST EPISODE
                        </div>

                        <h2
                            style={{
                                margin: 0,
                                fontSize: 40,
                                color: "#153848",
                            }}
                        >
                            {selectedEpisode?.title ?? "No Episode"}
                        </h2>

                        <div
                            style={{
                                marginTop: 18,
                                color: "#666",
                                lineHeight: 1.8,
                                fontSize: 18,
                            }}
                        >
                            {selectedEpisode?.summary ??
                                "No AI summary available."}
                        </div>

                    </div>

                    {/* Statistics */}

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 20,
                        }}
                    >

                        <div
                            style={{
                                background: "#153848",
                                color: "#FFFFFF",
                                borderRadius: 24,
                                padding: 28,
                            }}
                        >

                            <div
                                style={{
                                    fontSize: 13,
                                    opacity: .8,
                                    letterSpacing: 2,
                                }}
                            >
                                PUBLISHED
                            </div>

                            <div
                                style={{
                                    fontSize: 54,
                                    fontWeight: 700,
                                    marginTop: 10,
                                }}
                            >
                                {episodes.length}
                            </div>

                            <div
                                style={{
                                    opacity: .8,
                                }}
                            >
                                Episodes
                            </div>

                        </div>

                        <div
                            style={{
                                background: "#FFFFFF",
                                borderRadius: 24,
                                padding: 28,
                                boxShadow: "0 10px 30px rgba(0,0,0,.05)",
                            }}
                        >

                            <div
                                style={{
                                    fontWeight: 700,
                                    color: "#153848",
                                    marginBottom: 10,
                                }}
                            >
                                Latest Publication
                            </div>

                            <div
                                style={{
                                    color: "#666",
                                    lineHeight: 1.8,
                                }}
                            >
                                {selectedEpisode?.published_at ??
                                    "No publication yet"}
                            </div>

                        </div>

                    </div>

                </div>

                                {/* Published Episodes */}

                <div
                    style={{
                        marginTop: 60,
                        marginBottom: 60,
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

                        <h2
                            style={{
                                margin: 0,
                                fontSize: 38,
                                color: "#153848",
                            }}
                        >
                            Published Episodes
                        </h2>

                        <div
                            style={{
                                color: "#666",
                                fontWeight: 600,
                            }}
                        >
                            {episodes.length} Episode{episodes.length !== 1 ? "s" : ""}
                        </div>

                    </div>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
                            gap: 24,
                        }}
                    >

                        {episodes.map((episode: any) => (

                            <div
                                key={episode.episode}
                                onClick={() => setSelectedEpisode(episode)}
                                style={{
                                    cursor: "pointer",
                                    background:
                                        selectedEpisode?.episode === episode.episode
                                            ? "#153848"
                                            : "#FFFFFF",
                                    color:
                                        selectedEpisode?.episode === episode.episode
                                            ? "#FFFFFF"
                                            : "#153848",
                                    borderRadius: 24,
                                    padding: 28,
                                    transition: ".2s",
                                    boxShadow: "0 10px 30px rgba(0,0,0,.05)",
                                }}
                            >

                                <div
                                    style={{
                                        fontSize: 13,
                                        letterSpacing: 2,
                                        fontWeight: 700,
                                        color:
                                            selectedEpisode?.episode === episode.episode
                                                ? "#E6C27A"
                                                : "#B48A45",
                                    }}
                                >
                                    {episode.episode.toUpperCase()}
                                </div>

                                <h3
                                    style={{
                                        marginTop: 14,
                                        marginBottom: 16,
                                        fontSize: 28,
                                    }}
                                >
                                    {episode.title}
                                </h3>

                                <div
                                    style={{
                                        lineHeight: 1.8,
                                        opacity: .82,
                                        overflow: "hidden",
                                        display: "-webkit-box",
                                        WebkitLineClamp: 5,
                                        WebkitBoxOrient: "vertical",
                                    }}
                                >
                                    {episode.summary}
                                </div>

                                <div
                                    style={{
                                        marginTop: 24,
                                        fontSize: 14,
                                        opacity: .7,
                                    }}
                                >
                                    {episode.published_at}
                                </div>

                            </div>

                        ))}

                    </div>

                </div>

                                {/* Episode Details */}

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 30,
                        marginBottom: 50,
                    }}
                >

                    {/* AI Summary */}

                    <section
                        style={{
                            background: "#FFFFFF",
                            borderRadius: 28,
                            padding: 36,
                            boxShadow: "0 12px 35px rgba(0,0,0,.05)",
                        }}
                    >

                        <div
                            style={{
                                color: "#B48A45",
                                fontWeight: 700,
                                letterSpacing: 2,
                                fontSize: 13,
                                marginBottom: 18,
                            }}
                        >
                            AI SUMMARY
                        </div>

                        <div
                            style={{
                                color: "#444",
                                lineHeight: 1.9,
                                whiteSpace: "pre-wrap",
                                fontSize: 17,
                            }}
                        >
                            {selectedEpisode?.summary ??
                                "No summary available."}
                        </div>

                    </section>

                    {/* Episode Information */}

                    <section
                        style={{
                            background: "#FFFFFF",
                            borderRadius: 28,
                            padding: 36,
                            boxShadow: "0 12px 35px rgba(0,0,0,.05)",
                        }}
                    >

                        <div
                            style={{
                                color: "#B48A45",
                                fontWeight: 700,
                                letterSpacing: 2,
                                fontSize: 13,
                                marginBottom: 18,
                            }}
                        >
                            EPISODE INFORMATION
                        </div>

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 20,
                                color: "#444",
                            }}
                        >

                            <div>

                                <strong>Episode</strong>

                                <br />

                                {selectedEpisode?.episode}

                            </div>

                            <div>

                                <strong>Title</strong>

                                <br />

                                {selectedEpisode?.title}

                            </div>

                            <div>

                                <strong>Published</strong>

                                <br />

                                {selectedEpisode?.published_at}

                            </div>

                    <div>

    <strong>Listen</strong>

    <br />
    <br />

    {selectedEpisode && (

        <audio
            controls
            style={{
                width: "100%",
            }}
        >
            <source
                src={`${API}/audio/kyamagero-daily/${selectedEpisode.episode}`}
                type="audio/wav"
            />

            Your browser does not support audio playback.

        </audio>

    )}

</div>        

                        </div>

                    </section>

                </div>

                {/* Transcript */}

                <section
                    style={{
                        background: "#FFFFFF",
                        borderRadius: 28,
                        padding: 40,
                        marginBottom: 80,
                        boxShadow: "0 12px 35px rgba(0,0,0,.05)",
                    }}
                >

                    <div
                        style={{
                            color: "#B48A45",
                            fontWeight: 700,
                            letterSpacing: 2,
                            fontSize: 13,
                            marginBottom: 24,
                        }}
                    >
                        FULL TRANSCRIPT
                    </div>

                    <div
                        style={{
                            whiteSpace: "pre-wrap",
                            lineHeight: 2,
                            color: "#444",
                            fontSize: 17,
                        }}
                    >
                        {selectedEpisode?.transcript ??
                            "Transcript not available."}
                    </div>

                </section>

                            </section>

        </main>

    );

}