const API_URL_VALUE =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://site--mcaie-backend--ws6ylxkqmfw2.code.run";

const WS_URL_VALUE =
  process.env.NEXT_PUBLIC_WS_URL ||
  "wss://site--mcaie-backend--ws6ylxkqmfw2.code.run";

export const API_URL =
  API_URL_VALUE.replace(/\/+$/, "");

export const WS_URL =
  WS_URL_VALUE.replace(/\/+$/, "");