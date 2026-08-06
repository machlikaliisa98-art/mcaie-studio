const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://site--mcaie-backend--ws6ylxkqmfw2.code.run";

export async function uploadAudio(
  file: File,
  options: {
    mode: string;
    enhance_audio: boolean;
    normalize_audio: boolean;
    transcribe: boolean;
    summarize: boolean;
    keywords: boolean;
    topics: boolean;
    chapters: boolean;
    speaker_identification: boolean;
    split_audio: boolean;
    split_method: string;
    split_minutes: number;
    publish_to: string;
  }
) {
  const form = new FormData();

  form.append("file", file);

  Object.entries(options).forEach(([key, value]) => {
    form.append(key, String(value));
  });

  const response = await fetch(`${API}/upload`, {
    method: "POST",
    body: form,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Upload failed");
  }

  return response.json();
}

export async function getJob(jobId: string) {
  const response = await fetch(`${API}/jobs/${jobId}`);

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Unable to fetch job");
  }

  return response.json();
}

export async function getProject(projectId: string) {
  const response = await fetch(`${API}/projects/${projectId}`);

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Unable to fetch project");
  }

  return response.json();
}

export async function getLibrary() {
  const response = await fetch(`${API}/library`);

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Unable to load library");
  }

  return response.json();
}

export async function getShows() {
  const response = await fetch(`${API}/shows`);

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Unable to load shows");
  }

  return response.json();
}

export async function getShow(showId: string) {
  const response = await fetch(`${API}/shows/${showId}`);

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Unable to load show");
  }

  return response.json();
}