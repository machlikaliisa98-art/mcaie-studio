import { API_URL } from "@/config/api";

export async function uploadAudio(
  formData: FormData
) {
  const response = await fetch(`${API_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}