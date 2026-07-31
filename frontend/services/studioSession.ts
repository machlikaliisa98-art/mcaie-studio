import { mediaEngine } from "./media";
import { recording } from "./recording";
import { webrtc } from "./webrtc";
import { signaling } from "./signaling";
import { events } from "./events";

export interface StudioSessionOptions {

    sessionId: string;

    role: "host" | "guest";

    cameraId?: string;

    microphoneId?: string;

    autoRecord?: boolean;

}

class StudioSession {

    private running = false;

    private sessionId = "";

    private role: "host" | "guest" = "guest";

    private readonly participantJoinedHandler = async () => {

        if (
            !this.running ||
            this.role !== "host"
        ) {
            return;
        }

        console.log(
            "[SESSION] Participant joined. Creating offer.",
        );

        try {

            await webrtc.createOffer();

        }

        catch (error) {

            console.error(
                error,
            );

        }

    };

    async start(
        options: StudioSessionOptions,
    ) {

        if (
            this.running
        ) {
            return;
        }

        this.sessionId =
            options.sessionId;

        this.role =
            options.role;

        console.log(
            "[SESSION] Starting",
        );

        await signaling.connect(
            this.sessionId,
        );

        await mediaEngine.requestPermissions();

        await mediaEngine.startStudioMedia(
            options.cameraId,
            options.microphoneId,
        );

        await webrtc.initialize();

        events.on(
            "participant.joined",
            this.participantJoinedHandler,
        );

        this.running = true;

        //
        // Host creates an offer immediately.
        //

        if (
            this.role === "host"
        ) {

            try {

                await webrtc.createOffer();

            }

            catch (error) {

                console.error(
                    error,
                );

            }

        }

        events.emit(
            "session.started",
            {},
        );

    }

    async stop() {

        if (
            !this.running
        ) {
            return;
        }

        events.off(
            "participant.joined",
            this.participantJoinedHandler,
        );

        if (
            recording.isRecording()
        ) {

            await recording.stop();

        }

        webrtc.close();

        signaling.disconnect();

        mediaEngine.stop();

        this.running = false;

        events.emit(
            "session.stopped",
            {},
        );

    }

    async raiseHand() {

        await signaling.send(
            "raise_hand",
        );

    }

    async approveSpeaker(
        participantId: string,
    ) {

        await signaling.send(
            "approve_speaker",
            {
                participantId,
            },
        );

    }

    async removeSpeaker(
        participantId: string,
    ) {

        await signaling.send(
            "remove_speaker",
            {
                participantId,
            },
        );

    }

    getSessionId() {

        return this.sessionId;

    }

    getRole() {

        return this.role;

    }

    isRunning() {

        return this.running;

    }

}

export const studioSession =
    new StudioSession();