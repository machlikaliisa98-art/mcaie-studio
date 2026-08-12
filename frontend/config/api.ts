const LOCAL_API_URL =
  "http://127.0.0.1:8000";

const LOCAL_WS_URL =
  "ws://127.0.0.1:8000";

const PRODUCTION_API_URL =
  "https://site--mcaie-backend--ws6ylxkqmfw2.code.run";

const PRODUCTION_WS_URL =
  "wss://site--mcaie-backend--ws6ylxkqmfw2.code.run";


function isLocalBrowser(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const hostname =
    window.location.hostname;

  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1"
  );
}


/*
|--------------------------------------------------------------------------
| API URL
|--------------------------------------------------------------------------
|
| Local browser:
|     http://127.0.0.1:8000
|
| Production browser:
|     https://site--mcaie-backend--ws6ylxkqmfw2.code.run
|
| This intentionally prevents a production deployment from ever
| falling back to localhost.
|
*/

export const API_URL =
  isLocalBrowser()
    ? (
        process.env.NEXT_PUBLIC_API_URL ||
        LOCAL_API_URL
      )
    : PRODUCTION_API_URL;


/*
|--------------------------------------------------------------------------
| WebSocket URL
|--------------------------------------------------------------------------
*/

export const WS_URL =
  isLocalBrowser()
    ? (
        process.env.NEXT_PUBLIC_WS_URL ||
        LOCAL_WS_URL
      )
    : PRODUCTION_WS_URL;