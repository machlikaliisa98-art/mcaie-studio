"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import CameraGrid, { Camera } from "./CameraGrid";
import ParticipantsPanel from "./ParticipantsPanel";

import { studioSession } from "../../services/studioSession";
import { mediaEngine } from "../../services/media";
import { webrtc } from "../../services/webrtc";
import { events } from "../../services/events";

interface Props {
    sessionId: string;
}

export default function LiveStudio({
    sessionId,
}: Props) {

    const localVideo = useRef<HTMLVideoElement>(null);
    const remoteVideo = useRef<HTMLVideoElement>(null);

    const [role, setRole] = useState<"host" | "guest">("host");

    const [running, setRunning] = useState(false);

    const [connection, setConnection] = useState("Disconnected");

    const [localStream, setLocalStream] =
        useState<MediaStream | null>(null);

    const [remoteStream, setRemoteStream] =
        useState<MediaStream | null>(null);

    const [session, setSession] = useState<any>(null);

    const videoRefs = useMemo(
        () => ({
            local: localVideo,
            remote: remoteVideo,
        }),
        [],
    );

    useEffect(() => {

    const connectionListener = ({ state }: any) => {
        setConnection(state);
    };

    const remoteListener = ({ stream }: any) => {
        setRemoteStream(stream);
    };

    const sessionListener = (data: any) => {
        setSession(data);
    };

    events.on(
        "webrtc.connection",
        connectionListener,
    );

    events.on(
        "webrtc.remoteStream",
        remoteListener,
    );

    events.on(
        "session.updated",
        sessionListener,
    );

    return () => {

        // Remove listeners if the event engine supports it.
        // If events.off() does not exist, simply remove these lines.
        events.off?.(
            "webrtc.connection",
            connectionListener,
        );

        events.off?.(
            "webrtc.remoteStream",
            remoteListener,
        );

        events.off?.(
            "session.updated",
            sessionListener,
        );

        webrtc.close();

    };

}, []);

    useEffect(() => {

        if (
            localVideo.current &&
            localStream
        ) {

            localVideo.current.srcObject =
                localStream;

        }

    }, [localStream]);

    useEffect(() => {

        if (
            remoteVideo.current &&
            remoteStream
        ) {

            remoteVideo.current.srcObject =
                remoteStream;

        }

    }, [remoteStream]);

    async function start() {

        await studioSession.start({

            sessionId,

            role,

            autoRecord: false,

        });

        const stream =
            mediaEngine.getStream();

        if (stream) {

            setLocalStream(stream);

        }

        setRunning(true);

    }

    async function stop() {

        await studioSession.stop();

        setRunning(false);

        setLocalStream(null);

        setRemoteStream(null);

        setSession(null);

    }

    const cameras: Camera[] = [
    {
        id: "local",
        name: role === "host" ? "Host" : "Guest",
        stream: localStream,
        muted: true,
        role,
        onStage: true,
    },
    {
        id: "remote",
        name: role === "host" ? "Guest" : "Host",
        stream: remoteStream,
        muted: false,
        role: role === "host" ? "guest" : "host",
        onStage: true,
    },
];

    return (

        <div
            style={{
                display: "flex",
                gap: 24,
                alignItems: "flex-start",
            }}
        >

            <div
                style={{
                    flex: 1,
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

                        <h2>

                            MCAIE Live Studio

                        </h2>

                        <div>

                            WebRTC{" "}

                            <strong>

                                {connection}

                            </strong>

                        </div>

                        {session && (

                            <div
                                style={{
                                    marginTop: 10,
                                }}
                            >

                                <strong>

                                    Participants:

                                </strong>{" "}

                                {session.participants?.length ?? 0}

                                {" | "}

                                <strong>

                                    Speakers:

                                </strong>{" "}

                                {session.speakers?.length ?? 0}

                                {" | "}

                                <strong>

                                    Raised Hands:

                                </strong>{" "}

                                {session.raisedHands?.length ?? 0}

                            </div>

                        )}

                    </div>

                    <div>

                        <select

                            disabled={running}

                            value={role}

                            onChange={e =>
                                setRole(
                                    e.target.value as
                                        "host"
                                        | "guest",
                                )
                            }

                        >

                            <option value="host">

                                Host

                            </option>

                            <option value="guest">

                                Guest

                            </option>

                        </select>

                    </div>

                </div>

                <CameraGrid

                    cameras={cameras}

                    videoRefs={videoRefs}

                />

                <div
                    style={{
                        display: "flex",
                        gap: 12,
                        marginTop: 24,
                    }}
                >

                    <button

                        disabled={running}

                        onClick={start}

                    >

                        Start Studio

                    </button>

                    <button

                        disabled={!running}

                        onClick={stop}

                    >

                        Stop Studio

                    </button>

                </div>

            </div>

            <ParticipantsPanel

                participants={
                    session?.participants ?? []
                }

                currentRole={role}

            />

        </div>

    );

}