import { API_URL } from "@/config/api";

async function request(
  path: string,
  options?: RequestInit
) {
  const response = await fetch(
    `${API_URL}${path}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    }
  );

  const text = await response.text();

  let data: any;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const message =
      data?.detail ||
      data?.message ||
      (typeof data === "string"
        ? data
        : "Request failed.");

    throw new Error(message);
  }

  return data;
}


/*
|--------------------------------------------------------------------------
| CREATE SESSION
|--------------------------------------------------------------------------
|
| The Live Studio page calls:
|
| createSession(title, category, host)
|
| Keep that interface here so the frontend remains compatible.
|
*/

export async function createSession(
  title: string,
  category: string,
  host: string
) {
  return request(
    "/sessions",
    {
      method: "POST",
      body: JSON.stringify({
        title,
        category,
        host,
      }),
    }
  );
}


/*
|--------------------------------------------------------------------------
| GET SESSION
|--------------------------------------------------------------------------
*/

export async function getSession(
  sessionId: string
) {
  return request(
    `/sessions/${sessionId}`
  );
}


/*
|--------------------------------------------------------------------------
| START SESSION
|--------------------------------------------------------------------------
*/

export async function startSession(
  sessionId: string
) {
  return request(
    `/sessions/${sessionId}/start`,
    {
      method: "POST",
    }
  );
}


/*
|--------------------------------------------------------------------------
| JOIN SESSION
|--------------------------------------------------------------------------
*/

export async function joinSession(
  sessionId: string,
  data: any = {}
) {
  return request(
    `/sessions/${sessionId}/join`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}


/*
|--------------------------------------------------------------------------
| RAISE HAND
|--------------------------------------------------------------------------
*/

export async function raiseHand(
  sessionId: string,
  data: any = {}
) {
  return request(
    `/sessions/${sessionId}/raise-hand`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}