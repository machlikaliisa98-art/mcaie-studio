import { API_URL } from "@/config/api";

export async function getStudioStatus() {
  const response = await fetch(`${API_URL}/studio/status`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load studio status.");
  }

  return response.json();
}

export async function getStudioDevices() {
  const response = await fetch(`${API_URL}/studio/devices`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load studio devices.");
  }

  return response.json();
}