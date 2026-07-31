const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:8000";

export async function getLibrary() {

  const response = await fetch(

    `${API_BASE}/library/`,

    {

      cache: "no-store",

    }

  );

  if (!response.ok) {

    throw new Error(

      "Failed to load library."

    );

  }

  return response.json();

}

export async function getLatestEpisodes() {

  const response = await fetch(

    `${API_BASE}/library/latest`,

    {

      cache: "no-store",

    }

  );

  if (!response.ok) {

    throw new Error(

      "Failed to load latest episodes."

    );

  }

  return response.json();

}