import { WS_URL } from "@/config/api";

export function createSocket(
  path: string
): WebSocket {
  return new WebSocket(
    `${WS_URL}${path}`
  );
}

export class LiveSocket {
  private socket: WebSocket | null = null;

  constructor() {
    this.socket = null;
  }

  connect(
    sessionId: string,
    onConnected?: () => void | Promise<void>
  ): WebSocket {
    this.socket = new WebSocket(
      `${WS_URL}/ws/${sessionId}`
    );

    if (onConnected) {
      this.socket.addEventListener(
        "open",
        () => {
          void onConnected();
        },
        { once: true }
      );
    }

    return this.socket;
  }

  get readyState(): number {
    return (
      this.socket?.readyState ??
      WebSocket.CLOSED
    );
  }

  get raw(): WebSocket | null {
    return this.socket;
  }

  send(
    data: string | object
  ): void {
    if (
      !this.socket ||
      this.socket.readyState !==
        WebSocket.OPEN
    ) {
      throw new Error(
        "Live socket is not connected."
      );
    }

    if (typeof data === "string") {
      this.socket.send(data);
    } else {
      this.socket.send(
        JSON.stringify(data)
      );
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  close(
    code?: number,
    reason?: string
  ): void {
    if (this.socket) {
      this.socket.close(
        code,
        reason
      );
      this.socket = null;
    }
  }

  addEventListener(
    type: string,
    listener:
      | EventListener
      | EventListenerObject
  ): void {
    this.socket?.addEventListener(
      type,
      listener
    );
  }

  removeEventListener(
    type: string,
    listener:
      | EventListener
      | EventListenerObject
  ): void {
    this.socket?.removeEventListener(
      type,
      listener
    );
  }

  set onopen(
    handler:
      | ((event: Event) => void)
      | null
  ) {
    if (this.socket) {
      this.socket.onopen = handler;
    }
  }

  set onmessage(
    handler:
      | ((event: MessageEvent) => void)
      | null
  ) {
    if (this.socket) {
      this.socket.onmessage = handler;
    }
  }

  set onerror(
    handler:
      | ((event: Event) => void)
      | null
  ) {
    if (this.socket) {
      this.socket.onerror = handler;
    }
  }

  set onclose(
    handler:
      | ((event: CloseEvent) => void)
      | null
  ) {
    if (this.socket) {
      this.socket.onclose = handler;
    }
  }
}