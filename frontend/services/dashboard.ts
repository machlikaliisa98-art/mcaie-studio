const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:8000";

export async function getDashboard() {

  const response = await fetch(

    `${API_BASE}/dashboard/`,

    {

      cache: "no-store",

    }

  );

  if (!response.ok) {

    throw new Error(

      "Failed to load dashboard."

    );

  }

  return response.json();

}