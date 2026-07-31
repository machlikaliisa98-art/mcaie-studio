"use client";

import { studioSession } from "../../services/studioSession";

interface Participant {

    id: string;

    role?: string;

    onStage?: boolean;

    handRaised?: boolean;

}

interface Props {

    participants: Participant[];

    currentRole: "host" | "guest";

}

export default function ParticipantsPanel({

    participants,

    currentRole,

}: Props) {

    const speakers = participants.filter(

        p => p.onStage,

    );

    const audience = participants.filter(

        p => !p.onStage,

    );

    return (

        <div
            style={{
                width: 320,
                padding: 20,
                borderLeft: "1px solid rgba(255,255,255,.08)",
            }}
        >

            <h3>Participants</h3>

            {currentRole === "guest" && (

                <button
                    onClick={() =>
                        studioSession.raiseHand()
                    }
                >

                    ✋ Raise Hand

                </button>

            )}

            <h4 style={{ marginTop: 25 }}>

                🎤 Speakers

            </h4>

            {speakers.map(p => (

                <div
                    key={p.id}
                    style={{
                        marginBottom: 10,
                    }}
                >

                    {p.id.slice(0,8)}

                    {currentRole === "host" && (

                        <button
                            style={{
                                marginLeft:10,
                            }}
                            onClick={() =>
                                studioSession.removeSpeaker(
                                    p.id,
                                )
                            }
                        >

                            Remove

                        </button>

                    )}

                </div>

            ))}

            <h4 style={{ marginTop:30 }}>

                👥 Audience

            </h4>

            {audience.map(p => (

                <div
                    key={p.id}
                    style={{
                        marginBottom:10,
                    }}
                >

                    {p.id.slice(0,8)}

                    {p.handRaised && (
                        <> ✋</>
                    )}

                    {currentRole === "host" &&
                        p.handRaised && (

                        <button
                            style={{
                                marginLeft:10,
                            }}
                            onClick={() =>
                                studioSession.approveSpeaker(
                                    p.id,
                                )
                            }
                        >

                            Approve

                        </button>

                    )}

                </div>

            ))}

        </div>

    );

}