const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:8000";

export async function uploadAudio(
  file: File,
  mode: "studio" | "podcast",
  onProgress?: (progress: number) => void,
) {
  const form = new FormData();
  form.append("file", file);
  form.append("mode", mode);

  onProgress?.(5);

  const response = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    body: form,
  });

  if (!response.ok) {
    throw new Error("Upload failed");
  }

  onProgress?.(10);

  return response.json();
}
