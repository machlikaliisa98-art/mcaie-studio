export type SocketMessage = Record<string, any>;

export class LiveSocket {

  private socket: WebSocket | null = null;

  private connected = false;

  private onMessage?: (message: SocketMessage) => void;

  private onOpen?: () => void;

  private onClose?: () => void;

  async connect(
    sessionId: string,
    onMessage: (message: SocketMessage) => void,
    onOpen?: () => void,
    onClose?: () => void,
  ): Promise<void> {

    if (
      this.socket &&
      this.connected
    ) {
      return;
    }

    this.onMessage = onMessage;
    this.onOpen = onOpen;
    this.onClose = onClose;

    const protocol =
      window.location.protocol === "https:"
        ? "wss"
        : "ws";

    const host =
      process.env.NEXT_PUBLIC_WS_URL ??
      `${protocol}://127.0.0.1:8000`;

    this.socket = new WebSocket(
      `${host}/ws/${sessionId}`,
    );

    return new Promise((resolve, reject) => {

      if (!this.socket) {

        reject();

        return;

      }

      this.socket.onopen = () => {

        this.connected = true;

        console.log(
          "[LiveSocket] Connected",
        );

        this.onOpen?.();

        resolve();

      };

      this.socket.onmessage = (
        event,
      ) => {

        try {

          const message = JSON.parse(
            event.data,
          );

          console.log(
            "[WS RECEIVE]",
            message.type,
            message,
          );

          this.onMessage?.(
            message,
          );

        } catch (error) {

          console.error(
            "[WS PARSE ERROR]",
            error,
          );

        }

      };

      this.socket.onerror = (
        error,
      ) => {

        console.error(
          "[WS ERROR]",
          error,
        );

      };

      this.socket.onclose = (
        event,
      ) => {

        console.log(
          "[LiveSocket] Closed",
          event.code,
          event.reason,
        );

        this.connected = false;

        this.socket = null;

        this.onClose?.();

      };

    });

  }

  send(
    message: SocketMessage,
  ) {

    if (
      !this.socket ||
      !this.connected
    ) {

      console.warn(
        "[WS SEND FAILED] Socket not connected.",
      );

      return;

    }

    console.log(
      "[WS SEND]",
      message.type,
      message,
    );

    this.socket.send(
      JSON.stringify(
        message,
      ),
    );

  }

  isConnected(): boolean {

    return this.connected;

  }

  disconnect() {

    this.connected = false;

    if (this.socket) {

      this.socket.close();

      this.socket = null;

    }

  }

}