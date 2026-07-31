type Props = {

  stage: string;

  progress: number;

};

const stages = [

  "Inspecting Audio",

  "Normalizing Audio",

  "Preparing Audio",

  "Voice Detection",

  "Creating Episodes",

  "Studio Mastering",

  "Speech Intelligence",

  "Language Intelligence",

  "Knowledge Engine",

  "Finalizing",

  "Completed",

];

export default function ProductionTimeline({

  stage,

  progress,

}: Props) {

  function state(name: string) {

    if (name === stage)

      return "active";

    const current = stages.indexOf(stage);

    const item = stages.indexOf(name);

    if (

      current > item ||

      stage === "Completed"

    )

      return "done";

    return "waiting";

  }

  return (

    <section

      style={{

        background: "#13263D",

        borderRadius: 24,

        padding: 28,

        marginBottom: 32,

      }}

    >

      <h2

        style={{

          marginTop: 0,

          color: "#FFFFFF",

        }}

      >

        MCAIE Production Pipeline

      </h2>

      <div

        style={{

          marginBottom: 28,

        }}

      >

        <div

          style={{

            height: 8,

            background: "#1C3048",

            borderRadius: 999,

            overflow: "hidden",

          }}

        >

          <div

            style={{

              width: `${progress}%`,

              height: "100%",

              background: "#4FA3D9",

              transition: ".4s",

            }}

          />

        </div>

      </div>

      {stages.map((item) => {

        const s = state(item);

        return (

          <div

            key={item}

            style={{

              display: "flex",

              alignItems: "center",

              gap: 18,

              padding: "14px 0",

              borderBottom:

                "1px solid rgba(255,255,255,.05)",

            }}

          >

            <div

              style={{

                width: 18,

                height: 18,

                borderRadius: "50%",

                background:

                  s === "done"

                    ? "#2CC36B"

                    : s === "active"

                    ? "#4FA3D9"

                    : "#455C73",

                boxShadow:

                  s === "active"

                    ? "0 0 18px #4FA3D9"

                    : "none",

              }}

            />

            <div

              style={{

                flex: 1,

                color:

                  s === "waiting"

                    ? "#8EA2BD"

                    : "#FFFFFF",

                fontWeight:

                  s === "active"

                    ? 700

                    : 500,

              }}

            >

              {item}

            </div>

            {s === "done" && (

              <span

                style={{

                  color: "#2CC36B",

                }}

              >

                ✓

              </span>

            )}

            {s === "active" && (

              <span

                style={{

                  color: "#4FA3D9",

                }}

              >

                Running...

              </span>

            )}

          </div>

        );

      })}

    </section>

  );

}