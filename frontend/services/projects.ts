import { API_URL } from "@/config/api";

export async function getProjects() {
  const response = await fetch(`${API_URL}/projects`);

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

export async function getProject(id: string) {
  const response = await fetch(`${API_URL}/projects/${id}`);

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}