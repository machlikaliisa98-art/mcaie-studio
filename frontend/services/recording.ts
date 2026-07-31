import { broadcast } from "./broadcast";
import { events } from "./events";

export interface RecordingResult {

    blob: Blob;

    url: string;

}

class RecordingEngine {

    private recorder: MediaRecorder | null = null;

    private chunks: Blob[] = [];

    private currentStream: MediaStream | null = null;

    private recording = false;

    constructor() {

        broadcast.subscribe(

            source => {

                if (

                    source.type === "camera" ||

                    source.type === "screen"

                ) {

                    this.currentStream = source.stream;

                }

            },

        );

        events.on(

            "media.stopped",

            () => {

                if (

                    this.recording

                ) {

                    this.stop().catch(

                        console.error,

                    );

                }

            },

        );

    }

    initialize() {

        events.emit(

            "recording.ready",

            {},

        );

    }

    isRecording() {

        return this.recording;

    }

    start() {

        if (

            !this.currentStream

        ) {

            throw new Error(

                "No active media stream available.",

            );

        }

        if (

            this.recording

        ) {

            return;

        }

        this.chunks = [];

        this.recorder = new MediaRecorder(

            this.currentStream,

        );

        this.recorder.ondataavailable = (

            event,

        ) => {

            if (

                event.data.size > 0

            ) {

                this.chunks.push(

                    event.data,

                );

            }

        };

        this.recorder.start(

            1000,

        );

        this.recording = true;

        events.emit(

            "recording.started",

            {},

        );

    }

    stop(): Promise<RecordingResult> {

        return new Promise(

            (

                resolve,

                reject,

            ) => {

                if (

                    !this.recorder

                ) {

                    reject(

                        new Error(

                            "Recording has not started.",

                        ),

                    );

                    return;

                }

                this.recorder.onstop = () => {

                    const blob = new Blob(

                        this.chunks,

                        {

                            type:

                                this.recorder?.mimeType ||

                                "video/webm",

                        },

                    );

                    const url = URL.createObjectURL(

                        blob,

                    );

                    this.recording = false;

                    events.emit(

                        "recording.saved",

                        {

                            blob,

                            url,

                        },

                    );

                    resolve({

                        blob,

                        url,

                    });

                };

                this.recorder.stop();

            },

        );

    }

}

export const recording =

    new RecordingEngine();