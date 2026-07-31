"use client";

import { RefObject } from "react";

interface Camera {

    id: string;

    name: string;

    stream?: MediaStream;

    muted?: boolean;

    role?: string;

    onStage?: boolean;

    handRaised?: boolean;

}

interface CameraGridProps {

    cameras: Camera[];

    videoRefs: Record<string, RefObject<HTMLVideoElement | null>>;

}

export default function CameraGrid({

    cameras,

    videoRefs,

}: CameraGridProps) {

    const sorted = [...cameras].sort((a, b) => {

        if (!!a.onStage === !!b.onStage) {

            return a.name.localeCompare(b.name);

        }

        return a.onStage ? -1 : 1;

    });

    function columns(count: number) {

        if (count <= 1) return "1fr";

        if (count <= 4) return "1fr 1fr";

        if (count <= 9) return "1fr 1fr 1fr";

        return "1fr 1fr 1fr 1fr";

    }

    return (

        <div
            style={{
                display: "grid",
                gridTemplateColumns: columns(sorted.length),
                gap: 20,
                width: "100%",
            }}
        >

            {sorted.map(camera => (

                <div

                    key={camera.id}

                    style={{

                        background: "#111C2A",

                        borderRadius: 16,

                        overflow: "hidden",

                        border: camera.onStage
                            ? "2px solid #22C55E"
                            : "1px solid rgba(255,255,255,.08)",

                        transition: ".2s",

                    }}

                >

                    <video

                        ref={videoRefs[camera.id]}

                        autoPlay

                        playsInline

                        muted={camera.muted}

                        style={{

                            width: "100%",

                            height: 260,

                            objectFit: "cover",

                            background: "#000",

                        }}

                    />

                    <div
                        style={{

                            padding: 14,

                            display: "flex",

                            justifyContent: "space-between",

                            alignItems: "center",

                        }}
                    >

                        <div>

                            <strong>

                                {camera.name}

                            </strong>

                            <div
                                style={{
                                    fontSize: 12,
                                    opacity: .75,
                                    marginTop: 4,
                                }}
                            >

                                {camera.role ?? "Participant"}

                            </div>

                        </div>

                        <div
                            style={{
                                textAlign: "right",
                            }}
                        >

                            <div>

                                {camera.stream
                                    ? "🟢 Live"
                                    : "⚪ Waiting"}

                            </div>

                            {camera.onStage && (

                                <div
                                    style={{
                                        fontSize: 12,
                                        color: "#22C55E",
                                    }}
                                >

                                    On Stage

                                </div>

                            )}

                            {!camera.onStage && camera.handRaised && (

                                <div
                                    style={{
                                        fontSize: 12,
                                        color: "#F59E0B",
                                    }}
                                >

                                    ✋ Hand Raised

                                </div>

                            )}

                        </div>

                    </div>

                </div>

            ))}

        </div>

    );

}