"use client";

import { useEffect, useRef, useState } from "react";
import { mediaEngine } from "../../services/media";

export default function MediaDevices() {

    const videoRef = useRef<HTMLVideoElement>(null);

    const [loading, setLoading] = useState(true);

    const [cameras, setCameras] = useState<any[]>([]);

    const [microphones, setMicrophones] = useState<any[]>([]);

    const [speakers, setSpeakers] = useState<any[]>([]);

    const [cameraId, setCameraId] = useState("");

    const [microphoneId, setMicrophoneId] = useState("");

    useEffect(() => {

        initialize();

        return () => {

            mediaEngine.stop();

        };

    }, []);

    async function initialize() {

        try {

            await mediaEngine.requestPermissions();

            const devices = await mediaEngine.getDevices();

            setCameras(devices.cameras);

            setMicrophones(devices.microphones);

            setSpeakers(devices.speakers);

            if (devices.cameras.length) {

                setCameraId(

                    devices.cameras[0].id,

                );

            }

            if (devices.microphones.length) {

                setMicrophoneId(

                    devices.microphones[0].id,

                );

            }

        }

        finally {

            setLoading(false);

        }

    }

    async function startPreview() {

        const stream = await mediaEngine.startStudioMedia(

            cameraId || undefined,

            microphoneId || undefined,

        );

        if (videoRef.current) {

            videoRef.current.srcObject = stream;

        }

    }

    function stopPreview() {

        mediaEngine.stop();

        if (videoRef.current) {

            videoRef.current.srcObject = null;

        }

    }

    return (

        <section
            style={{
                background:"#13263D",
                borderRadius:24,
                padding:24,
            }}
        >

            <h2>

                🎥 Media Devices

            </h2>

            <p
                style={{
                    color:"#9FB4C9",
                }}
            >

                Live hardware detected by your browser.

            </p>

            {

                loading

                ?

                <p>Loading devices...</p>

                :

                <>

                    <div
                        style={{
                            display:"grid",
                            gap:18,
                            marginBottom:20,
                        }}
                    >

                        <div>

                            <label>

                                Camera

                            </label>

                            <select

                                value={cameraId}

                                onChange={(e)=>

                                    setCameraId(

                                        e.target.value,

                                    )

                                }

                                style={selectStyle}

                            >

                                {

                                    cameras.map(

                                        camera=>

                                            <option

                                                key={camera.id}

                                                value={camera.id}

                                            >

                                                {camera.label}

                                            </option>

                                    )

                                }

                            </select>

                        </div>

                        <div>

                            <label>

                                Microphone

                            </label>

                            <select

                                value={microphoneId}

                                onChange={(e)=>

                                    setMicrophoneId(

                                        e.target.value,

                                    )

                                }

                                style={selectStyle}

                            >

                                {

                                    microphones.map(

                                        microphone=>

                                            <option

                                                key={microphone.id}

                                                value={microphone.id}

                                            >

                                                {microphone.label}

                                            </option>

                                    )

                                }

                            </select>

                        </div>

                        <div>

                            <label>

                                Speakers

                            </label>

                            <select

                                style={selectStyle}

                            >

                                {

                                    speakers.map(

                                        speaker=>

                                            <option

                                                key={speaker.id}

                                            >

                                                {speaker.label}

                                            </option>

                                    )

                                }

                            </select>

                        </div>

                    </div>

                    <div
                        style={{
                            display:"flex",
                            gap:12,
                            marginBottom:20,
                        }}
                    >

                        <button

                            onClick={startPreview}

                            style={buttonStyle}

                        >

                            Start Preview

                        </button>

                        <button

                            onClick={stopPreview}

                            style={buttonStyle}

                        >

                            Stop

                        </button>

                    </div>

                    <video

                        ref={videoRef}

                        autoPlay

                        muted

                        playsInline

                        style={{

                            width:"100%",

                            borderRadius:18,

                            background:"#000",

                        }}

                    />

                </>

            }

        </section>

    );

}

const selectStyle={

    width:"100%",

    padding:12,

    marginTop:8,

    borderRadius:12,

    border:"1px solid rgba(255,255,255,.08)",

    background:"#0E1C2D",

    color:"#fff",

};

const buttonStyle={

    border:"none",

    background:"#1E6FA8",

    color:"#fff",

    padding:"12px 20px",

    borderRadius:12,

    cursor:"pointer",

    fontWeight:700,

};