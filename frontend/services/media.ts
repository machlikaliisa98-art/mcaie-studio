import { broadcast } from "./broadcast";
import { events } from "./events";

export type CameraDevice = {

    id: string;

    label: string;

};

export type MicrophoneDevice = {

    id: string;

    label: string;

};

export type SpeakerDevice = {

    id: string;

    label: string;

};

export class MediaEngine {

    private stream: MediaStream | null = null;

    async requestPermissions() {

        const stream = await navigator.mediaDevices.getUserMedia({

            audio: true,

            video: true,

        });

        stream.getTracks().forEach(

            track => track.stop(),

        );

        events.emit(

            "media.permissions.granted",

            {},

        );

    }

    async getDevices() {

        const devices =

            await navigator.mediaDevices.enumerateDevices();

        const cameras: CameraDevice[] = [];

        const microphones: MicrophoneDevice[] = [];

        const speakers: SpeakerDevice[] = [];

        for (const device of devices) {

            switch (device.kind) {

                case "videoinput":

                    cameras.push({

                        id: device.deviceId,

                        label: device.label || "Camera",

                    });

                    break;

                case "audioinput":

                    microphones.push({

                        id: device.deviceId,

                        label: device.label || "Microphone",

                    });

                    break;

                case "audiooutput":

                    speakers.push({

                        id: device.deviceId,

                        label: device.label || "Speaker",

                    });

                    break;

            }

        }

        events.emit(

            "media.devices.updated",

            {

                cameras,

                microphones,

                speakers,

            },

        );

        return {

            cameras,

            microphones,

            speakers,

        };

    }

    async startStudioMedia(

        cameraId?: string,

        microphoneId?: string,

    ) {

        this.stop();

        this.stream =

            await navigator.mediaDevices.getUserMedia({

                video: cameraId

                    ? {

                          deviceId: {

                              exact: cameraId,

                          },

                      }

                    : true,

                audio: microphoneId

                    ? {

                          deviceId: {

                              exact: microphoneId,

                          },

                      }

                    : true,

            });

        broadcast.register({

            id: "studio-media",

            type: "camera",

            stream: this.stream,

        });

        events.emit(

            "media.started",

            {

                stream: this.stream,

            },

        );

        return this.stream;

    }

    async startScreenShare() {

        const mediaDevices =

            navigator.mediaDevices as MediaDevices & {

                getDisplayMedia?: (

                    constraints?: DisplayMediaStreamOptions,

                ) => Promise<MediaStream>;

            };

        if (!mediaDevices.getDisplayMedia) {

            throw new Error(

                "Screen sharing not supported.",

            );

        }

        this.stop();

        this.stream =

            await mediaDevices.getDisplayMedia({

                video: true,

                audio: true,

            });

        broadcast.register({

            id: "screen",

            type: "screen",

            stream: this.stream,

        });

        events.emit(

            "media.screen.started",

            {

                stream: this.stream,

            },

        );

        return this.stream;

    }

    stop() {

        if (!this.stream) {

            return;

        }

        this.stream

            .getTracks()

            .forEach(

                track => track.stop(),

            );

        broadcast.unregister(

            "studio-media",

        );

        broadcast.unregister(

            "screen",

        );

        events.emit(

            "media.stopped",

            {},

        );

        this.stream = null;

    }

    getStream() {

        return this.stream;

    }

}

export const mediaEngine =

    new MediaEngine();