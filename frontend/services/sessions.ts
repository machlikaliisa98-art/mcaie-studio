const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:8000";

async function request(
  path: string,
  options?: RequestInit,
) {

  const url = `${API_BASE}${path}`;

  console.log("========================================");
  console.log("[API REQUEST]");
  console.log("URL:", url);
  console.log("METHOD:", options?.method ?? "GET");
  console.log("OPTIONS:", options);
  console.log("========================================");

  try {

    const response = await fetch(
      url,
      options,
    );

    console.log("========================================");
    console.log("[API RESPONSE]");
    console.log("STATUS:", response.status);
    console.log("STATUS TEXT:", response.statusText);
    console.log("OK:", response.ok);
    console.log("URL:", url);
    console.log("========================================");

    if (!response.ok) {

      const text = await response.text();

      console.error("[API ERROR BODY]", text);

      throw new Error(
        `Request failed: ${response.status}`,
      );

    }

    return response.json();

  } catch (error) {

    console.error("========================================");
    console.error("[FETCH FAILED]");
    console.error("URL:", url);
    console.error(error);
    console.error("========================================");

    throw error;

  }

}

export async function createSession(

  title: string,

  category: string,

  host: string,

) {

  return request(

    "/sessions/",

    {

      method: "POST",

      headers: {

        "Content-Type": "application/json",

      },

      body: JSON.stringify({

        title,

        category,

        host,

      }),

    },

  );

}

export async function getSessions() {

  return request(

    "/sessions/",

  );

}

export async function getSession(

  id: string,

) {

  return request(

    `/sessions/${id}`,

  );

}

export async function startSession(

  id: string,

) {

  return request(

    `/sessions/${id}/start`,

    {

      method: "POST",

    },

  );

}

export async function endSession(

  id: string,

) {

  return request(

    `/sessions/${id}/end`,

    {

      method: "POST",

    },

  );

}

export async function joinSession(

  id: string,

  name: string,

) {

  return request(

    `/sessions/${id}/join`,

    {

      method: "POST",

      headers: {

        "Content-Type": "application/json",

      },

      body: JSON.stringify({

        name,

      }),

    },

  );

}

export async function raiseHand(

  id: string,

  name: string,

) {

  return request(

    `/sessions/${id}/raise-hand`,

    {

      method: "POST",

      headers: {

        "Content-Type": "application/json",

      },

      body: JSON.stringify({

        name,

      }),

    },

  );

}

export async function approveSpeaker(

  id: string,

  name: string,

) {

  return request(

    `/sessions/${id}/speaker`,

    {

      method: "POST",

      headers: {

        "Content-Type": "application/json",

      },

      body: JSON.stringify({

        name,

      }),

    },

  );

}