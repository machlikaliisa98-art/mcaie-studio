import { API_URL } from "@/config/api";

export async function getLibrary() {
  const response = await fetch(`${API_URL}/library`);

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

export async function getConversation(id: string) {
  const response = await fetch(`${API_URL}/library/${id}`);

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}