export type SourceType =
    | "camera"
    | "microphone"
    | "screen"
    | "whiteboard"
    | "document"
    | "video";

export interface BroadcastSource {
    id: string;
    type: SourceType;
    stream: MediaStream;
}

type Consumer = (
    source: BroadcastSource,
) => void;

class BroadcastEngine {

    private sources = new Map<
        string,
        BroadcastSource
    >();

    private consumers = new Set<
        Consumer
    >();

    register(
        source: BroadcastSource,
    ) {
        this.sources.set(
            source.id,
            source,
        );

        this.notify(
            source,
        );
    }

    unregister(
        id: string,
    ) {
        this.sources.delete(
            id,
        );
    }

    get(
        id: string,
    ) {
        return this.sources.get(
            id,
        );
    }

    getAll() {
        return Array.from(
            this.sources.values(),
        );
    }

    subscribe(
        consumer: Consumer,
    ) {
        this.consumers.add(
            consumer,
        );

        // Immediately provide all currently active sources
        // so late subscribers stay synchronized.
        for (const source of this.sources.values()) {
            consumer(source);
        }
    }

    unsubscribe(
        consumer: Consumer,
    ) {
        this.consumers.delete(
            consumer,
        );
    }

    private notify(
        source: BroadcastSource,
    ) {
        this.consumers.forEach(
            consumer =>
                consumer(
                    source,
                ),
        );
    }

}

export const broadcast =
    new BroadcastEngine();