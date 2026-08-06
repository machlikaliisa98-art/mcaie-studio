import { WS_URL } from "@/config/api";

export function createSocket(path: string) {
  return new WebSocket(`${WS_URL}${path}`);
}