import { events } from "./events";

export interface Participant {
    id: string;
    name?: string;
    role?: "host" | "guest";
    audioEnabled?: boolean;
    videoEnabled?: boolean;
    handRaised?: boolean;
    [key: string]: any;
}

class ParticipantManager {

    private participants = new Map<string, Participant>();

    setAll(participants: Participant[]) {

        this.participants.clear();

        for (const participant of participants) {

            this.participants.set(
                participant.id,
                participant,
            );

        }

        events.emit(
            "participants.updated",
            this.getAll(),
        );

    }

    add(participant: Participant) {

        this.participants.set(
            participant.id,
            participant,
        );

        events.emit(
            "participant.joined",
            participant,
        );

        events.emit(
            "participants.updated",
            this.getAll(),
        );

    }

    remove(participantId: string) {

        const participant =
            this.participants.get(
                participantId,
            );

        if (!participant) {
            return;
        }

        this.participants.delete(
            participantId,
        );

        events.emit(
            "participant.left",
            participant,
        );

        events.emit(
            "participants.updated",
            this.getAll(),
        );

    }

    get(participantId: string) {

        return this.participants.get(
            participantId,
        );

    }

    getAll() {

        return Array.from(
            this.participants.values(),
        );

    }

    clear() {

        this.participants.clear();

        events.emit(
            "participants.updated",
            [],
        );

    }

}

export const participantManager =
    new ParticipantManager();