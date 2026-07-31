let recorder: MediaRecorder | null = null;

let chunks: Blob[] = [];

let stream: MediaStream | null = null;

export async function startRecording(
  deviceId?: string,
) {

  stream = await navigator.mediaDevices.getUserMedia({

    audio: deviceId
      ? {
          deviceId: {
            exact: deviceId,
          },
        }
      : true,

  });

  chunks = [];

  recorder = new MediaRecorder(stream);

  recorder.ondataavailable = (event) => {

    if (event.data.size > 0) {

      chunks.push(event.data);

    }

  };

  recorder.start(1000);

}

export function pauseRecording() {

  recorder?.pause();

}

export function resumeRecording() {

  recorder?.resume();

}

export async function stopRecording(): Promise<File> {

  return new Promise((resolve, reject) => {

    if (!recorder) {

      reject(new Error("Recorder not started."));

      return;

    }

    recorder.onstop = () => {

      const blob = new Blob(chunks, {

        type: "audio/webm",

      });

      stream?.getTracks().forEach(track => track.stop());

      const file = new File(

        [blob],

        `recording-${Date.now()}.webm`,

        {

          type: "audio/webm",

          lastModified: Date.now(),

        }

      );

      resolve(file);

    };

    recorder.stop();

  });

}