"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { API_URL } from "@/config/api";

const API = API_URL;

type ProcessingOptions = {

  enhance_audio: boolean;
  normalize_audio: boolean;

  transcribe: boolean;
  summarize: boolean;
  keywords: boolean;
  topics: boolean;
  chapters: boolean;
  speaker_identification: boolean;

  split_audio: boolean;
  split_method: "fixed" | "ai";
  split_minutes: number;

  publish_to: string;

  programme: string;
  season: number;
};


export default function StudioPage() {

  const [file, setFile] =
    useState<File | null>(null);

  const [uploading, setUploading] =
    useState(false);

  const [jobId, setJobId] =
    useState("");

  const [status, setStatus] =
    useState("Waiting...");

  const [progress, setProgress] =
    useState(0);


  const [options, setOptions] =
    useState<ProcessingOptions>({

      enhance_audio: false,
      normalize_audio: false,

      transcribe: false,
      summarize: false,
      keywords: false,
      topics: false,
      chapters: false,
      speaker_identification: false,

      split_audio: false,
      split_method: "fixed",
      split_minutes: 20,

      publish_to: "download",

      programme: "You Rise Surrounded",
      season: 1,
    });


  const pollRef =
    useRef<NodeJS.Timeout | null>(null);


  // ==========================================================
  // JOB POLLING
  // ==========================================================

  useEffect(() => {

    if (!jobId) {
      return;
    }


    pollRef.current =
      setInterval(
        async () => {

          try {

            const response =
              await fetch(
                `${API}/jobs/${jobId}`
              );


            if (!response.ok) {
              return;
            }


            const job =
              await response.json();


            setStatus(
              job.status ??
              "Processing..."
            );


            setProgress(
              Number(
                job.progress ?? 0
              )
            );


            if (
              job.status ===
                "Completed" ||
              job.status ===
                "Failed" ||
              Number(
                job.progress ?? 0
              ) >= 100
            ) {

              setUploading(false);


              if (pollRef.current) {

                clearInterval(
                  pollRef.current
                );

                pollRef.current =
                  null;
              }
            }

          } catch (error) {

            console.error(
              "Job polling failed:",
              error
            );
          }

        },
        1000
      );


    return () => {

      if (pollRef.current) {

        clearInterval(
          pollRef.current
        );

        pollRef.current =
          null;
      }
    };

  }, [jobId]);


  // ==========================================================
  // OPTION HELPER
  // ==========================================================

  function setOption(
    key: keyof ProcessingOptions,
    value:
      | boolean
      | string
      | number
  ) {

    setOptions(
      current => ({
        ...current,
        [key]: value,
      })
    );
  }


  // ==========================================================
  // UPLOAD
  // ==========================================================

  async function runProcessing() {

    if (!file) {

      alert(
        "Please choose an audio file."
      );

      return;
    }


    if (
      !options.programme.trim()
    ) {

      alert(
        "Please enter a programme name."
      );

      return;
    }


    if (
      options.season < 1
    ) {

      alert(
        "Season must be 1 or greater."
      );

      return;
    }


    if (
      options.split_audio &&
      options.split_minutes <= 0
    ) {

      alert(
        "Episode length must be greater than zero."
      );

      return;
    }


    try {

      setUploading(true);

      setStatus(
        "Uploading..."
      );

      setProgress(0);


      const form =
        new FormData();


      // ======================================================
      // SOURCE AUDIO
      // ======================================================

      form.append(
        "file",
        file
      );


      // ======================================================
      // MODE
      // ======================================================

      form.append(
        "mode",
        "podcast"
      );


      // ======================================================
      // AUDIO
      // ======================================================

      form.append(
        "enhance_audio",
        String(
          options.enhance_audio
        )
      );


      form.append(
        "normalize_audio",
        String(
          options.normalize_audio
        )
      );


      // ======================================================
      // AI
      // ======================================================

      form.append(
        "transcribe",
        String(
          options.transcribe
        )
      );


      form.append(
        "summarize",
        String(
          options.summarize
        )
      );


      form.append(
        "keywords",
        String(
          options.keywords
        )
      );


      form.append(
        "topics",
        String(
          options.topics
        )
      );


      form.append(
        "chapters",
        String(
          options.chapters
        )
      );


      form.append(
        "speaker_identification",
        String(
          options.speaker_identification
        )
      );


      // ======================================================
      // SPLITTING
      // ======================================================

      form.append(
        "split_audio",
        String(
          options.split_audio
        )
      );


      form.append(
        "split_method",
        options.split_method
      );


      form.append(
        "split_minutes",
        String(
          options.split_minutes
        )
      );


      // ======================================================
      // PUBLISHING
      // ======================================================

      form.append(
        "publish_to",
        options.publish_to
      );


      // ======================================================
      // PROGRAMME
      // ======================================================

      form.append(
        "programme",
        options.programme.trim()
      );


      // ======================================================
      // SEASON
      // ======================================================

      form.append(
        "season",
        String(
          options.season
        )
      );


      // ======================================================
      // AUDIO PRESERVATION
      // ======================================================

      form.append(
        "preserve_audio",
        "true"
      );


      console.log(
        "MCAIE PROCESSING CONFIGURATION",
        {
          ...options,
        }
      );


      const response =
        await fetch(
          `${API}/upload`,
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
          "Upload failed."
        );
      }


      const data =
        await response.json();


      console.log(
        "MCAIE JOB CREATED",
        data
      );


      setJobId(
        data.job_id
      );


      setStatus(
        "Processing..."
      );


    } catch (error) {

      console.error(
        "Upload failed:",
        error
      );


      alert(
        error instanceof Error
          ? error.message
          : "Upload failed."
      );


      setUploading(false);

      setStatus(
        "Upload failed"
      );
    }
  }


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <main
      style={{
        minHeight:
          "100vh",

        background:
          "#F6F1E8",

        padding:
          "40px 20px",
      }}
    >

      <div
        style={{
          maxWidth:
            1200,

          margin:
            "0 auto",
        }}
      >

        <h1
          style={{
            color:
              "#153848",

            fontSize:
              42,

            marginBottom:
              10,
          }}
        >
          Studio
        </h1>


        <p
          style={{
            color:
              "#666",

            marginBottom:
              40,

            fontSize:
              18,
          }}
        >
          Configure exactly what MCAIE should
          do with your recording.
        </p>


        {/* ==================================================
            UPLOAD
        ================================================== */}

        <section
          style={{
            background:
              "#FFFFFF",

            borderRadius:
              24,

            padding:
              40,

            marginBottom:
              30,

            border:
              "2px dashed #B48A45",

            textAlign:
              "center",
          }}
        >

          <h2
            style={{
              color:
                "#153848",

              marginBottom:
                10,
            }}
          >
            Upload Audio
          </h2>


          <p
            style={{
              color:
                "#777",

              marginBottom:
                25,
            }}
          >
            Choose the recording you want MCAIE
            to process.
          </p>


          <input
            type="file"
            accept="audio/*"
            onChange={event => {

              const selected =
                event.target.files?.[0];


              if (selected) {

                setFile(
                  selected
                );
              }
            }}
          />


          {file && (

            <p
              style={{
                marginTop:
                  15,

                color:
                  "#153848",

                fontWeight:
                  700,
              }}
            >
              {file.name}
            </p>
          )}

        </section>


        {/* ==================================================
            PUBLISHING CONTEXT
        ================================================== */}

        <section
          style={{
            background:
              "#FFFFFF",

            borderRadius:
              24,

            padding:
              35,

            marginBottom:
              30,
          }}
        >

          <h2
            style={{
              color:
                "#153848",

              marginBottom:
                10,
            }}
          >
            Programme & Season
          </h2>


          <p
            style={{
              color:
                "#777",

              marginBottom:
                25,
            }}
          >
            Tell FONS exactly where this recording
            belongs. New episodes will continue from
            the last published episode in this season.
          </p>


          <div
            style={{
              display:
                "grid",

              gridTemplateColumns:
                "minmax(0, 1fr) 180px",

              gap:
                20,
            }}
          >

            <div>

              <label
                style={{
                  display:
                    "block",

                  fontWeight:
                    700,

                  color:
                    "#153848",

                  marginBottom:
                    8,
                }}
              >
                Programme
              </label>


              <input
                type="text"
                value={
                  options.programme
                }
                onChange={event =>
                  setOption(
                    "programme",
                    event.target.value
                  )
                }
                placeholder="e.g. You Rise Surrounded"
                style={{
                  width:
                    "100%",

                  padding:
                    14,

                  border:
                    "1px solid #DDD",

                  borderRadius:
                    10,

                  fontSize:
                    16,

                  boxSizing:
                    "border-box",
                }}
              />

            </div>


            <div>

              <label
                style={{
                  display:
                    "block",

                  fontWeight:
                    700,

                  color:
                    "#153848",

                  marginBottom:
                    8,
                }}
              >
                Season
              </label>


              <input
                type="number"
                min="1"
                value={
                  options.season
                }
                onChange={event =>
                  setOption(
                    "season",
                    Math.max(
                      1,
                      Number(
                        event.target.value
                      )
                    )
                  )
                }
                style={{
                  width:
                    "100%",

                  padding:
                    14,

                  border:
                    "1px solid #DDD",

                  borderRadius:
                    10,

                  fontSize:
                    16,

                  boxSizing:
                    "border-box",
                }}
              />

            </div>

          </div>

        </section>


        {/* ==================================================
            AUDIO PROCESSING
        ================================================== */}

        <section
          style={{
            background:
              "#FFFFFF",

            borderRadius:
              24,

            padding:
              35,

            marginBottom:
              30,
          }}
        >

          <h2
            style={{
              color:
                "#153848",

              marginBottom:
                25,
            }}
          >
            Audio Processing
          </h2>


          <Option
            label="Audio Enhancement"
            checked={
              options.enhance_audio
            }
            onChange={
              value =>
                setOption(
                  "enhance_audio",
                  value
                )
            }
          />


          <Option
            label="Normalize Audio"
            checked={
              options.normalize_audio
            }
            onChange={
              value =>
                setOption(
                  "normalize_audio",
                  value
                )
            }
          />

        </section>


        {/* ==================================================
            AI PROCESSING
        ================================================== */}

        <section
          style={{
            background:
              "#FFFFFF",

            borderRadius:
              24,

            padding:
              35,

            marginBottom:
              30,
          }}
        >

          <h2
            style={{
              color:
                "#153848",

              marginBottom:
              25,
            }}
          >
            AI Processing
          </h2>


          <Option
            label="Transcription"
            checked={
              options.transcribe
            }
            onChange={
              value =>
                setOption(
                  "transcribe",
                  value
                )
            }
          />


          <Option
            label="AI Summary"
            checked={
              options.summarize
            }
            onChange={
              value =>
                setOption(
                  "summarize",
                  value
                )
            }
          />


          <Option
            label="Keywords"
            checked={
              options.keywords
            }
            onChange={
              value =>
                setOption(
                  "keywords",
                  value
                )
            }
          />


          <Option
            label="Topics"
            checked={
              options.topics
            }
            onChange={
              value =>
                setOption(
                  "topics",
                  value
                )
            }
          />


          <Option
            label="Chapters"
            checked={
              options.chapters
            }
            onChange={
              value =>
                setOption(
                  "chapters",
                  value
                )
            }
          />


          <Option
            label="Speaker Identification"
            checked={
              options.speaker_identification
            }
            onChange={
              value =>
                setOption(
                  "speaker_identification",
                  value
                )
            }
          />

        </section>


        {/* ==================================================
            SPLITTING
        ================================================== */}

        <section
          style={{
            background:
              "#FFFFFF",

            borderRadius:
              24,

            padding:
              35,

            marginBottom:
              30,
          }}
        >

          <h2
            style={{
              color:
                "#153848",
            }}
          >
            Episode Splitting
          </h2>


          <Option
            label="Split Audio Into Episodes"
            checked={
              options.split_audio
            }
            onChange={
              value =>
                setOption(
                  "split_audio",
                  value
                )
            }
          />


          {options.split_audio && (

            <div
              style={{
                marginTop:
                  25,

                padding:
                  25,

                background:
                  "#F8F8F8",

                borderRadius:
                  16,
              }}
            >

              <h3
                style={{
                  color:
                    "#153848",

                  marginTop:
                    0,
                }}
              >
                Split Method
              </h3>


              <label
                style={{
                  display:
                    "flex",

                  gap:
                    10,

                  alignItems:
                    "center",

                  marginBottom:
                    15,
                }}
              >

                <input
                  type="radio"
                  name="split-method"
                  checked={
                    options.split_method ===
                    "fixed"
                  }
                  onChange={() =>
                    setOption(
                      "split_method",
                      "fixed"
                    )
                  }
                />

                Fixed Length

              </label>


              <label
                style={{
                  display:
                    "flex",

                  gap:
                    10,

                  alignItems:
                    "center",
                }}
              >

                <input
                  type="radio"
                  name="split-method"
                  checked={
                    options.split_method ===
                    "ai"
                  }
                  onChange={() =>
                    setOption(
                      "split_method",
                      "ai"
                    )
                  }
                />

                AI Automatic

              </label>


              <div
                style={{
                  marginTop:
                    25,
                }}
              >

                <label
                  style={{
                    display:
                      "block",

                    fontWeight:
                      600,
                  }}
                >
                  Episode Length
                </label>


                <input
                  type="number"
                  min="1"
                  value={
                    options.split_minutes
                  }
                  onChange={event =>
                    setOption(
                      "split_minutes",
                      Number(
                        event.target.value
                      )
                    )
                  }
                  style={{
                    width:
                      120,

                    padding:
                      12,

                    marginTop:
                      8,

                    border:
                      "1px solid #DDD",

                    borderRadius:
                      10,
                  }}
                />


                <span
                  style={{
                    marginLeft:
                      10,
                  }}
                >
                  minutes
                </span>

              </div>

            </div>
          )}

        </section>


        {/* ==================================================
            PUBLISHING
        ================================================== */}

        <section
          style={{
            background:
              "#FFFFFF",

            borderRadius:
              24,

            padding:
              35,

            marginBottom:
              30,
          }}
        >

          <h2
            style={{
              color:
                "#153848",
            }}
          >
            Publish Destination
          </h2>


          <label
            style={{
              display:
                "flex",

              gap:
                10,

              alignItems:
                "center",

              marginTop:
                20,

              marginBottom:
                15,
            }}
          >

            <input
              type="radio"
              name="destination"
              checked={
                options.publish_to ===
                "download"
              }
              onChange={() =>
                setOption(
                  "publish_to",
                  "download"
                )
              }
            />

            Download Only

          </label>


          <label
            style={{
              display:
                "flex",

              gap:
                10,

              alignItems:
                "center",

              marginBottom:
                15,
            }}
          >

            <input
              type="radio"
              name="destination"
              checked={
                options.publish_to ===
                "kyamagero-daily"
              }
              onChange={() =>
                setOption(
                  "publish_to",
                  "kyamagero-daily"
                )
              }
            />

            Kyamagero Daily

          </label>


          <label
            style={{
              display:
                "flex",

              gap:
                10,

              alignItems:
                "center",
            }}
          >

            <input
              type="radio"
              name="destination"
              checked={
                options.publish_to ===
                "man-cave-ug"
              }
              onChange={() =>
                setOption(
                  "publish_to",
                  "man-cave-ug"
                )
              }
            />

            Man Cave UG

          </label>

        </section>


        {/* ==================================================
            STATUS
        ================================================== */}

        <section
          style={{
            background:
              "#FFFFFF",

            borderRadius:
              24,

            padding:
              35,

            marginBottom:
              30,
          }}
        >

          <h2
            style={{
              color:
                "#153848",

              marginBottom:
                20,
            }}
          >
            Processing Status
          </h2>


          <Status
            name="Current Status"
            value={
              status
            }
          />


          <Status
            name="Progress"
            value={
              `${progress}%`
            }
          />

        </section>


        {/* ==================================================
            RUN
        ================================================== */}

        <button
          onClick={
            runProcessing
          }
          disabled={
            uploading
          }
          style={{
            width:
              "100%",

            padding:
              22,

            border:
              "none",

            borderRadius:
              999,

            background:
              "#153848",

            color:
              "#FFFFFF",

            fontSize:
              18,

            fontWeight:
              700,

            cursor:
              uploading
                ? "default"
                : "pointer",

            opacity:
              uploading
                ? 0.7
                : 1,
          }}
        >

          {uploading
            ? `Processing ${progress}%`
            : "Run Processing"}

        </button>

      </div>

    </main>
  );
}


// ============================================================
// OPTION
// ============================================================

function Option({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (
    value: boolean
  ) => void;
}) {

  return (

    <div
      style={{
        marginBottom:
          16,
      }}
    >

      <label
        style={{
          display:
            "flex",

          gap:
            12,

          alignItems:
            "center",

          fontWeight:
            600,

          cursor:
            "pointer",
        }}
      >

        <input
          type="checkbox"
          checked={
            checked
          }
          onChange={event =>
            onChange(
              event.target.checked
            )
          }
        />

        {label}

      </label>

    </div>
  );
}


// ============================================================
// STATUS
// ============================================================

function Status({
  name,
  value,
}: {
  name: string;
  value: string;
}) {

  return (

    <div
      style={{
        display:
          "flex",

        justifyContent:
          "space-between",

        padding:
          "14px 0",

        borderBottom:
          "1px solid #EEE",
      }}
    >

      <strong>
        {name}
      </strong>


      <span
        style={{
          color:
            value ===
            "Completed"
              ? "#1E8E5A"
              : "#888",

          fontWeight:
            600,
        }}
      >
        {value}
      </span>

    </div>
  );
}