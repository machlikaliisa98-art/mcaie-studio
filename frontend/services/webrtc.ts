import { broadcast } from "./broadcast";
import { events } from "./events";
import { signaling } from "./signaling";
import { peerManager } from "./PeerManager";

class WebRTCEngine {

    private initialized = false;

    private localStream: MediaStream | null = null;

    async initialize() {

        if (this.initialized) {
            return;
        }

        broadcast.subscribe(source => {

            this.localStream = source.stream;

            peerManager["peers"]?.forEach?.((peer: any) => {

                source.stream.getTracks().forEach(track => {

                    const exists =
                        peer.connection
                            .getSenders()
                            .some((sender: RTCRtpSender) =>
                                sender.track?.id === track.id,
                            );

                    if (!exists) {

                        peer.connection.addTrack(
                            track,
                            source.stream,
                        );

                    }

                });

            });

        });

        events.on(
            "signal.offer",
            async ({ participantId, payload }) => {

                if (!payload?.offer) {
                    console.warn("[Offer] Invalid payload", payload);
                    return;
                }

                await this.receiveOffer(
                    participantId,
                    payload.offer,
                );

            },
        );

        events.on(
            "signal.answer",
            async ({ participantId, payload }) => {

                if (!payload?.answer) {
                    console.warn("[Answer] Invalid payload", payload);
                    return;
                }

                await this.receiveAnswer(
                    participantId,
                    payload.answer,
                );

            },
        );

        events.on(
            "signal.ice",
            async ({ participantId, payload }) => {

                if (!payload?.candidate) {
                    return;
                }

                await this.addIceCandidate(
                    participantId,
                    payload.candidate,
                );

            },
        );

        this.initialized = true;

    }

    async createOffer(
        participantId: string,
    ) {

        const peer =
            peerManager.create(
                participantId,
            );

        peer.connection.ontrack = event => {

            event.streams[0]
                .getTracks()
                .forEach(track => {

                    const exists =
                        peer.remoteStream
                            .getTracks()
                            .some(
                                t => t.id === track.id,
                            );

                    if (!exists) {

                        peer.remoteStream.addTrack(
                            track,
                        );

                    }

                });

            events.emit(
                "webrtc.remoteStream",
                {
                    participantId,
                    stream: peer.remoteStream,
                },
            );

        };

        peer.connection.onicecandidate =
            async event => {

                if (!event.candidate) {
                    return;
                }

                await signaling.send(
                    "signal.ice",
                    {
                        target: participantId,
                        candidate: event.candidate.toJSON(),
                    },
                );

            };

        if (this.localStream) {

            this.localStream
                .getTracks()
                .forEach(track => {

                    peer.connection.addTrack(
                        track,
                        this.localStream!,
                    );

                });

        }

        const offer =
            await peer.connection.createOffer();

        await peer.connection.setLocalDescription(
            offer,
        );

        await signaling.send(
            "signal.offer",
            {
                target: participantId,
                offer,
            },
        );

    }

    async receiveOffer(
        participantId: string,
        offer: RTCSessionDescriptionInit,
    ) {

        const peer =
            peerManager.create(
                participantId,
            );

        peer.connection.onicecandidate =
            async event => {

                if (!event.candidate) {
                    return;
                }

                await signaling.send(
                    "signal.ice",
                    {
                        target: participantId,
                        candidate: event.candidate.toJSON(),
                    },
                );

            };

        peer.connection.ontrack = event => {

            event.streams[0]
                .getTracks()
                .forEach(track => {

                    const exists =
                        peer.remoteStream
                            .getTracks()
                            .some(
                                t => t.id === track.id,
                            );

                    if (!exists) {

                        peer.remoteStream.addTrack(
                            track,
                        );

                    }

                });

            events.emit(
                "webrtc.remoteStream",
                {
                    participantId,
                    stream: peer.remoteStream,
                },
            );

        };

        if (this.localStream) {

            this.localStream
                .getTracks()
                .forEach(track => {

                    peer.connection.addTrack(
                        track,
                        this.localStream,
                    );

                });

        }

        await peer.connection.setRemoteDescription(
            new RTCSessionDescription(
                offer,
            ),
        );

        const answer =
            await peer.connection.createAnswer();

        await peer.connection.setLocalDescription(
            answer,
        );

        await signaling.send(
            "signal.answer",
            {
                target: participantId,
                answer,
            },
        );

    }

    async receiveAnswer(
        participantId: string,
        answer: RTCSessionDescriptionInit,
    ) {

        const peer =
            peerManager.get(
                participantId,
            );

        if (!peer) {
            return;
        }

        await peer.connection.setRemoteDescription(
            new RTCSessionDescription(
                answer,
            ),
        );

    }

    async addIceCandidate(
        participantId: string,
        candidate: RTCIceCandidateInit,
    ) {

        const peer =
            peerManager.get(
                participantId,
            );

        if (!peer) {
            return;
        }

        if (
            candidate.sdpMid == null &&
            candidate.sdpMLineIndex == null
        ) {

            console.warn(
                "[ICE] Ignoring invalid candidate",
                candidate,
            );

            return;

        }

        try {

            await peer.connection.addIceCandidate(
                new RTCIceCandidate(
                    candidate,
                ),
            );

        }

        catch (error) {

            console.error(
                "[ICE ERROR]",
                error,
            );

        }

    }

    getRemoteStream(
        participantId: string,
    ) {

        return peerManager
            .get(participantId)
            ?.remoteStream;

    }

    close() {

        peerManager.clear();

        this.localStream = null;

        this.initialized = false;

    }

}

export const webrtc =
    new WebRTCEngine();