"use client";

import { RefObject } from "react";

export interface Camera {
    id: string;
    name: string;
    stream?: MediaStream | null;
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

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns:
                    cameras.length > 1
                        ? "repeat(2, minmax(0,1fr))"
                        : "1fr",
                gap: 20,
                width: "100%",
            }}
        >
            {cameras.map((camera) => {

                const ref =
                    videoRefs[camera.id];

                return (
                    <div
                        key={camera.id}
                        style={{
                            position: "relative",
                            background: "#111827",
                            borderRadius: 16,
                            overflow: "hidden",
                            border: camera.onStage
                                ? "2px solid #22c55e"
                                : "1px solid #374151",
                            minHeight: 320,
                        }}
                    >
                        <video
                            ref={ref}
                            autoPlay
                            playsInline
                            muted={camera.muted}
                            style={{
                                width: "100%",
                                height: 320,
                                objectFit: "cover",
                                background: "#000",
                            }}
                        />

                        <div
                            style={{
                                position: "absolute",
                                left: 12,
                                bottom: 12,
                                background: "rgba(0,0,0,.65)",
                                padding: "8px 12px",
                                borderRadius: 8,
                                color: "#fff",
                                display: "flex",
                                gap: 8,
                                alignItems: "center",
                                fontSize: 14,
                            }}
                        >
                            <strong>
                                {camera.name}
                            </strong>

                            {camera.role && (
                                <span>
                                    ({camera.role})
                                </span>
                            )}

                            {camera.muted && (
                                <span>
                                    🔇
                                </span>
                            )}

                            {camera.handRaised && (
                                <span>
                                    ✋
                                </span>
                            )}
                        </div>

                        {camera.onStage && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: 12,
                                    right: 12,
                                    background: "#22c55e",
                                    color: "#fff",
                                    padding: "6px 10px",
                                    borderRadius: 999,
                                    fontSize: 12,
                                    fontWeight: 700,
                                }}
                            >
                                LIVE
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}