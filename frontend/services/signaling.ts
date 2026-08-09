import { WS_URL } from "@/config/api";

let activeSocket: WebSocket | null = null;

export function connectSignaling(
  sessionId: string
): WebSocket {
  activeSocket = new WebSocket(
    `${WS_URL}/ws/${sessionId}`
  );

  return activeSocket;
}

export const signaling = {
  connect(
    sessionId: string
  ): WebSocket {
    return connectSignaling(
      sessionId
    );
  },

  create(
    sessionId: string
  ): WebSocket {
    return connectSignaling(
      sessionId
    );
  },

  send(
    type: string,
    payload: unknown = {}
  ): void {
    if (
      !activeSocket ||
      activeSocket.readyState !==
        WebSocket.OPEN
    ) {
      throw new Error(
        "Signaling socket is not connected."
      );
    }

    activeSocket.send(
      JSON.stringify({
        type,
        payload,
      })
    );
  },

  disconnect(): void {
    if (activeSocket) {
      activeSocket.close();
      activeSocket = null;
    }
  },
};