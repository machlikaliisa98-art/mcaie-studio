import { API_URL } from "@/config/api";

export async function getJob(jobId: string) {
  const response = await fetch(`${API_URL}/jobs/${jobId}`);

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}