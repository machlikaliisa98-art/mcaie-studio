import { API_URL } from "@/config/api";

export type UploadOptions = {
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
};

export async function uploadAudio(
  file: File,
  options: UploadOptions
) {
  const form = new FormData();

  form.append("file", file);

  Object.entries(options).forEach(
    ([key, value]) => {
      form.append(
        key,
        String(value)
      );
    }
  );

  const response = await fetch(
    `${API_URL}/upload`,
    {
      method: "POST",
      body: form,
    }
  );

  if (!response.ok) {
    const message =
      await response.text();

    throw new Error(
      message ||
        "Upload failed"
    );
  }

  return response.json();
}

export async function getJob(
  jobId: string
) {
  const response = await fetch(
    `${API_URL}/jobs/${jobId}`
  );

  if (!response.ok) {
    const message =
      await response.text();

    throw new Error(
      message ||
        "Unable to fetch job"
    );
  }

  return response.json();
}

export async function getProject(
  projectId: string
) {
  const response = await fetch(
    `${API_URL}/projects/${projectId}`
  );

  if (!response.ok) {
    const message =
      await response.text();

    throw new Error(
      message ||
        "Unable to fetch project"
    );
  }

  return response.json();
}

export async function getLibrary() {
  const response = await fetch(
    `${API_URL}/library`
  );

  if (!response.ok) {
    const message =
      await response.text();

    throw new Error(
      message ||
        "Unable to load library"
    );
  }

  return response.json();
}

export async function getShows() {
  const response = await fetch(
    `${API_URL}/shows`
  );

  if (!response.ok) {
    const message =
      await response.text();

    throw new Error(
      message ||
        "Unable to load shows"
    );
  }

  return response.json();
}

export async function getShow(
  showId: string
) {
  const response = await fetch(
    `${API_URL}/shows/${showId}`
  );

  if (!response.ok) {
    const message =
      await response.text();

    throw new Error(
      message ||
        "Unable to load show"
    );
  }

  return response.json();
}