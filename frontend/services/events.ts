export type EventCallback<T = any> = (payload: T) => void;

class EventBus {

    private listeners = new Map<

        string,

        Set<EventCallback>

    >();

    on<T = any>(

        event: string,

        callback: EventCallback<T>,

    ) {

        if (

            !this.listeners.has(event)

        ) {

            this.listeners.set(

                event,

                new Set(),

            );

        }

        this.listeners

            .get(event)!

            .add(callback);

    }

    off<T = any>(

        event: string,

        callback: EventCallback<T>,

    ) {

        this.listeners

            .get(event)

            ?.delete(callback);

    }

    emit<T = any>(

        event: string,

        payload: T,

    ) {

        this.listeners

            .get(event)

            ?.forEach(

                listener =>

                    listener(payload),

            );

    }

    once<T = any>(

        event: string,

        callback: EventCallback<T>,

    ) {

        const wrapper = (

            payload: T,

        ) => {

            callback(payload);

            this.off(

                event,

                wrapper,

            );

        };

        this.on(

            event,

            wrapper,

        );

    }

    clear(

        event?: string,

    ) {

        if (event) {

            this.listeners.delete(

                event,

            );

            return;

        }

        this.listeners.clear();

    }

}

export const events = new EventBus();