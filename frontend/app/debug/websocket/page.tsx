"use client";

import { useEffect, useState } from "react";

import { signaling } from "../../../services/signaling";

import { events } from "../../../services/events";

export default function WebSocketDebugPage() {

    const [connected, setConnected] = useState(false);

    const [message, setMessage] = useState("");

    const [log, setLog] = useState<string[]>([]);

    useEffect(() => {

        events.on(

            "signaling.connected",

            () => {

                setConnected(true);

                add("Connected.");

            },

        );

        events.on(

            "signaling.disconnected",

            () => {

                setConnected(false);

                add("Disconnected.");

            },

        );

        events.on(

            "signaling.error",

            () => {

                add("Connection Error.");

            },

        );

        events.on(

            "signal.chat",

            (payload:any) => {

                add(

                    "Received: " +

                    payload.message,

                );

            },

        );

        return () => {

            signaling.disconnect();

        };

    }, []);

    function add(text:string){

        setLog(

            previous=>

                [...previous,text],

        );

    }

    async function connect(){

        await signaling.connect(

            "demo-session",

        );

    }

    async function send(){

        await signaling.send(

            "chat",

            {

                message,

            },

        );

        add(

            "Sent: " +

            message,

        );

        setMessage("");

    }

    return(

        <main
            style={{
                padding:40,
                background:"#08131F",
                color:"#FFF",
                minHeight:"100vh",
            }}
        >

            <h1>

                MCAIE WebSocket Test

            </h1>

            <p>

                Status:

                {" "}

                {

                    connected

                    ? "Connected"

                    : "Disconnected"

                }

            </p>

            <button

                onClick={connect}

                style={button}

            >

                Connect

            </button>

            <div
                style={{
                    marginTop:20,
                }}
            >

                <input

                    value={message}

                    onChange={e=>

                        setMessage(

                            e.target.value,

                        )

                    }

                    style={input}

                />

                <button

                    onClick={send}

                    style={button}

                >

                    Send

                </button>

            </div>

            <div
                style={{
                    marginTop:30,
                    background:"#13263D",
                    padding:20,
                    borderRadius:16,
                }}
            >

                {

                    log.map(

                        (entry,index)=>

                            <div

                                key={index}

                            >

                                {entry}

                            </div>

                    )

                }

            </div>

        </main>

    );

}

const button={

    padding:"12px 18px",

    border:"none",

    background:"#1E6FA8",

    color:"#FFF",

    borderRadius:10,

    cursor:"pointer",

    marginRight:12,

};

const input={

    padding:12,

    width:300,

    marginRight:12,

    borderRadius:10,

};