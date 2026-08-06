import { API_URL } from "@/config/api";

export async function getDashboard() {
  const response = await fetch(`${API_URL}/dashboard`);

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}