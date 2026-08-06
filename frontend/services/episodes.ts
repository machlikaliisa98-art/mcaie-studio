import { API_URL } from "@/config/api";

export async function getEpisodes(jobId: string) {
  const response = await fetch(`${API_URL}/episodes/${jobId}`);

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}