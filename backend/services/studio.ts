const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:8000";

export async function getStudioStatus() {

  const response = await fetch(

    `${API_BASE}/studio/status`,

    {

      cache: "no-store",

    }

  );

  if (!response.ok) {

    throw new Error(

      "Failed to load studio status."

    );

  }

  return response.json();

}

export async function getStudioDevices() {

  const response = await fetch(

    `${API_BASE}/studio/devices`,

    {

      cache: "no-store",

    }

  );

  if (!response.ok) {

    throw new Error(

      "Failed to load studio devices."

    );

  }

  return response.json();

}