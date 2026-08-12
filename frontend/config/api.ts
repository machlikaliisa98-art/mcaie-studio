const PRODUCTION_API_URL =
  "https://site--mcaie-backend--ws6ylxkqmfw2.code.run";

const PRODUCTION_WS_URL =
  "wss://site--mcaie-backend--ws6ylxkqmfw2.code.run";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  PRODUCTION_API_URL;

export const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL ||
  PRODUCTION_WS_URL;