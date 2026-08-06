import { WS_URL } from "@/config/api";

export function connectSignaling(sessionId: string) {
  return new WebSocket(`${WS_URL}/ws/${sessionId}`);
}