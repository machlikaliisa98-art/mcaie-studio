import { events } from "./events";
import { participantManager } from "./participantManager";

export interface SignalMessage {

    type: string;

    sessionId: string;

    participantId?: string;

    from?: string;

    to?: string;

    payload?: any;

    participants?: any[];

    participant?: any;

    session?: any;

}

class SignalingEngine {

    private socket: WebSocket | null = null;

    private sessionId = "";

    private participantId = "";

    async connect(
        sessionId: string,
    ) {

        if (
            this.socket &&
            (
                this.socket.readyState === WebSocket.OPEN ||
                this.socket.readyState === WebSocket.CONNECTING
            )
        ) {

            return;

        }

        this.sessionId = sessionId;

        const url =
            `${process.env.NEXT_PUBLIC_WS_URL ?? "ws://127.0.0.1:8000"}/ws/${sessionId}`;

        await new Promise<void>((resolve, reject) => {

            this.socket =
                new WebSocket(
                    url,
                );

            this.socket.onopen = () => {

                events.emit(
                    "signaling.connected",
                    {},
                );

                resolve();

            };

            this.socket.onerror = reject;

            this.socket.onclose = () => {

                events.emit(
                    "signaling.disconnected",
                    {},
                );

            };

            this.socket.onmessage = event => {

                const message: SignalMessage =
                    JSON.parse(
                        event.data,
                    );

                switch (
                    message.type
                ) {

                    case "participant_registered":

                        this.participantId =
                            message.participantId ?? "";

                        events.emit(
                            "participant.registered",
                            {
                                participantId:
                                    this.participantId,
                                role:
                                    message.payload?.role,
                            },
                        );

                        return;

                    case "participants":

                        participantManager.setAll(
                            message.participants ?? [],
                        );

                        return;

                    case "participant_joined":

                        if (
                            message.participant
                        ) {

                            participantManager.add(
                                message.participant,
                            );

                        }

                        return;

                    case "participant_left":

                        if (
                            message.participantId
                        ) {

                            participantManager.remove(
                                message.participantId,
                            );

                        }

                        return;

                    case "session_updated":

                        events.emit(
                            "session.updated",
                            message.session,
                        );

                        return;

                }

                //
                // Ignore messages that
                // are not intended for us.
                //

                if (
                    message.to &&
                    message.to !== this.participantId
                ) {

                    return;

                }

                events.emit(
                    message.type,
                    {
                        participantId:
                            message.from,
                        payload:
                            message.payload,
                    },
                );

            };

        });

    }

    async send(
        type: string,
        payload: any = {},
    ) {

        if (
            !this.socket ||
            this.socket.readyState !== WebSocket.OPEN
        ) {

            throw new Error(
                "Socket not connected.",
            );

        }

        const message = {

            type,

            sessionId:
                this.sessionId,

            from:
                this.participantId,

            payload,

        };

        this.socket.send(
            JSON.stringify(
                message,
            ),
        );

    }

    getParticipantId() {

        return this.participantId;

    }

    disconnect() {

        this.socket?.close();

        this.socket = null;

        this.participantId = "";

    }

}

export const signaling =
    new SignalingEngine();