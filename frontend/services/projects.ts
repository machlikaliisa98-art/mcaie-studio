const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:8000";

export async function getProjects() {

  const response = await fetch(

    `${API_BASE}/projects/`,

    {

      cache: "no-store",

    }

  );

  if (!response.ok) {

    throw new Error(

      "Failed to load projects."

    );

  }

  return response.json();

}

export async function getProject(

  projectId: string

) {

  const response = await fetch(

    `${API_BASE}/projects/${projectId}`,

    {

      cache: "no-store",

    }

  );

  if (!response.ok) {

    throw new Error(

      "Project not found."

    );

  }

  return response.json();

}