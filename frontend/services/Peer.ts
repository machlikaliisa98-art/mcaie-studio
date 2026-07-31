import { events } from "./events";

export class Peer {

    readonly participantId: string;

    readonly connection: RTCPeerConnection;

    readonly remoteStream = new MediaStream();

    constructor(
        participantId: string,
    ) {

        this.participantId = participantId;

        this.connection =
            new RTCPeerConnection({

                iceServers: [

                    {
                        urls: [
                            "stun:stun.l.google.com:19302",
                        ],
                    },

                ],

            });

        //
        // Remote media
        //
        this.connection.ontrack = event => {

            event.streams[0]
                .getTracks()
                .forEach(track => {

                    const exists =
                        this.remoteStream
                            .getTracks()
                            .some(
                                t => t.id === track.id,
                            );

                    if (!exists) {

                        this.remoteStream.addTrack(
                            track,
                        );

                    }

                });

            events.emit(
                "webrtc.remoteStream",
                {
                    participantId: this.participantId,
                    stream: this.remoteStream,
                },
            );

        };

        //
        // Overall connection state
        //
        this.connection.onconnectionstatechange = () => {

            console.log(
                "[Peer]",
                this.participantId,
                this.connection.connectionState,
            );

            events.emit(
                "webrtc.connection",
                {
                    participantId: this.participantId,
                    state:
                        this.connection.connectionState,
                },
            );

        };

        //
        // ICE state
        //
        this.connection.oniceconnectionstatechange = () => {

            console.log(
                "[ICE]",
                this.participantId,
                this.connection.iceConnectionState,
            );

        };

        //
        // ICE gathering
        //
        this.connection.onicegatheringstatechange = () => {

            console.log(
                "[ICE Gathering]",
                this.participantId,
                this.connection.iceGatheringState,
            );

        };

        //
        // Signaling
        //
        this.connection.onsignalingstatechange = () => {

            console.log(
                "[Signaling]",
                this.participantId,
                this.connection.signalingState,
            );

        };

    }

}