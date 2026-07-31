import { Peer } from "./Peer";

class PeerManager {

    private peers =
        new Map<string, Peer>();

    create(
        participantId: string,
    ) {

        let peer =
            this.peers.get(
                participantId,
            );

        if (peer) {

            return peer;

        }

        peer =
            new Peer(
                participantId,
            );

        this.peers.set(
            participantId,
            peer,
        );

        return peer;

    }

    get(
        participantId: string,
    ) {

        return this.peers.get(
            participantId,
        );

    }

    remove(
        participantId: string,
    ) {

        const peer =
            this.peers.get(
                participantId,
            );

        if (!peer) {

            return;

        }

        peer.connection.close();

        this.peers.delete(
            participantId,
        );

    }

    clear() {

        this.peers.forEach(peer => {

            peer.connection.close();

        });

        this.peers.clear();

    }

}

export const peerManager =
    new PeerManager();