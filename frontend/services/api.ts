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


async function getErrorMessage(
  response: Response,
  fallback: string
): Promise<string> {

  try {

    const message =
      await response.text();

    if (message) {
      return message;
    }

  } catch {
    // Ignore response parsing errors.
  }

  return fallback;
}


/*
|--------------------------------------------------------------------------
| Upload
|--------------------------------------------------------------------------
*/

export async function uploadAudio(
  file: File,
  options: UploadOptions
) {

  const form =
    new FormData();

  form.append(
    "file",
    file
  );

  Object.entries(options).forEach(
    ([key, value]) => {

      form.append(
        key,
        String(value)
      );

    }
  );


  const response =
    await fetch(
      `${API_URL}/upload`,
      {
        method: "POST",
        body: form,
      }
    );


  if (!response.ok) {

    const message =
      await getErrorMessage(
        response,
        "Upload failed"
      );

    throw new Error(
      message
    );
  }


  return response.json();
}


/*
|--------------------------------------------------------------------------
| Job
|--------------------------------------------------------------------------
*/

export async function getJob(
  jobId: string
) {

  const response =
    await fetch(
      `${API_URL}/jobs/${jobId}`,
      {
        cache: "no-store",
      }
    );


  if (!response.ok) {

    const message =
      await getErrorMessage(
        response,
        "Unable to fetch job"
      );

    throw new Error(
      message
    );
  }


  return response.json();
}


/*
|--------------------------------------------------------------------------
| Project
|--------------------------------------------------------------------------
*/

export async function getProject(
  projectId: string
) {

  const response =
    await fetch(
      `${API_URL}/projects/${projectId}`,
      {
        cache: "no-store",
      }
    );


  if (!response.ok) {

    const message =
      await getErrorMessage(
        response,
        "Unable to fetch project"
      );

    throw new Error(
      message
    );
  }


  return response.json();
}


/*
|--------------------------------------------------------------------------
| Library
|--------------------------------------------------------------------------
*/

export async function getLibrary() {

  const response =
    await fetch(
      `${API_URL}/library`,
      {
        cache: "no-store",
      }
    );


  if (!response.ok) {

    const message =
      await getErrorMessage(
        response,
        "Unable to load library"
      );

    throw new Error(
      message
    );
  }


  return response.json();
}


/*
|--------------------------------------------------------------------------
| Shows
|--------------------------------------------------------------------------
*/

export async function getShows() {

  const response =
    await fetch(
      `${API_URL}/shows`,
      {
        cache: "no-store",
      }
    );


  if (!response.ok) {

    const message =
      await getErrorMessage(
        response,
        "Unable to load shows"
      );

    throw new Error(
      message
    );
  }


  return response.json();
}


/*
|--------------------------------------------------------------------------
| Single Show
|--------------------------------------------------------------------------
*/

export async function getShow(
  showId: string
) {

  const response =
    await fetch(
      `${API_URL}/shows/${showId}`,
      {
        cache: "no-store",
      }
    );


  if (!response.ok) {

    const message =
      await getErrorMessage(
        response,
        "Unable to load show"
      );

    throw new Error(
      message
    );
  }


  return response.json();
}