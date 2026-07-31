import { events } from "./events";

export interface ParticipantMedia {

    participantId: string;

    camera?: MediaStream;

    microphone?: MediaStream;

    screen?: MediaStream;

}

class MediaRegistry {

    private media = new Map<string, ParticipantMedia>();

    private publish() {

        events.emit(

            "media.updated",

            this.getAll(),

        );

    }

    getAll(): ParticipantMedia[] {

        return Array.from(

            this.media.values(),

        );

    }

    get(

        participantId: string,

    ) {

        return this.media.get(

            participantId,

        );

    }

    ensure(

        participantId: string,

    ) {

        let participant = this.media.get(

            participantId,

        );

        if (

            !participant

        ) {

            participant = {

                participantId,

            };

            this.media.set(

                participantId,

                participant,

            );

        }

        return participant;

    }

    setCamera(

        participantId: string,

        stream: MediaStream,

    ) {

        this.ensure(

            participantId,

        ).camera = stream;

        this.publish();

    }

    setMicrophone(

        participantId: string,

        stream: MediaStream,

    ) {

        this.ensure(

            participantId,

        ).microphone = stream;

        this.publish();

    }

    setScreen(

        participantId: string,

        stream: MediaStream,

    ) {

        this.ensure(

            participantId,

        ).screen = stream;

        this.publish();

    }

    remove(

        participantId: string,

    ) {

        this.media.delete(

            participantId,

        );

        this.publish();

    }

    clear() {

        this.media.clear();

        this.publish();

    }

}

export const mediaRegistry =

    new MediaRegistry();