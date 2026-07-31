"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import LiveStudio from "../../../components/live/LiveStudio";

import {
    getSession,
    startSession,
    joinSession,
    raiseHand,
} from "../../../services/sessions";

import { LiveSocket } from "../../../services/websocket";

export default function BroadcastRoom() {

    const params = useParams();

    const sessionId = params.sessionId as string;

    const [session, setSession] = useState<any>(null);

    useEffect(() => {

        if (!sessionId) {

            return;

        }

        const socket = new LiveSocket();

        socket.connect(

            sessionId,

            async () => {

                await load();

            },

        );

        load();

        return () => {

            socket.disconnect();

        };

    }, [sessionId]);

    async function load() {

        const data = await getSession(

            sessionId,

        );

        setSession(

            data,

        );

    }

    if (!session) {

        return (

            <main
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "#08131F",
                    color: "#FFF",
                }}
            >

                Connecting...

            </main>

        );

    }

    return (

        <main
            style={{
                minHeight: "100vh",
                background: "#08131F",
                color: "#FFF",
                padding: 30,
            }}
        >

            <div
                style={{
                    marginBottom: 30,
                }}
            >

                <h1>

                    {session.title}

                </h1>

                <div>

                    Session

                    {" "}

                    {session.id}

                </div>

                <div>

                    Status

                    {" "}

                    {session.status}

                </div>

            </div>

            <LiveStudio

                sessionId={session.id}

            />

        </main>

    );

}