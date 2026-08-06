const API = "http://127.0.0.1:8000";

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
    throw new Error("Upload failed");
  }

  return response.json();
}

export async function getJob(jobId: string) {
  const response = await fetch(`${API}/jobs/${jobId}`);

  if (!response.ok) {
    throw new Error("Unable to fetch job");
  }

  return response.json();
}

export async function getProject(projectId: string) {
  const response = await fetch(`${API}/projects/${projectId}`);

  if (!response.ok) {
    throw new Error("Unable to fetch project");
  }

  return response.json();
}