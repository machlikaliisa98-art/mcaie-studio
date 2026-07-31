const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:8000";

export async function getEpisodes(jobId: string) {
  const response = await fetch(`${API_BASE}/episodes/${jobId}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return [];
  }

  return response.json();
}

export function episodeUrl(jobId: string, filename: string) {
  return `${API_BASE}/episodes/file/${jobId}/${filename}`;
}
