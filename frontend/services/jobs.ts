const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:8000";

export async function getJob(jobId: string) {
  const response = await fetch(`${API_BASE}/jobs/${jobId}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Job not found");
  }

  return response.json();
}
