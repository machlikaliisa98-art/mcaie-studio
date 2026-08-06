"use client";

import Image from "next/image";

export type Show = {
  id: string;
  name: string;
  description: string;
  logo?: string;
  cover?: string;
  href: string;
};

type Props = {
  shows: Show[];
};

export default function CreatorShows({ shows }: Props) {
  if (shows.length === 0) {
    return (
      <section
        style={{
          marginTop: 60,
          background: "#FFFFFF",
          borderRadius: 30,
          padding: "60px",
          textAlign: "center",
          boxShadow: "0 12px 35px rgba(0,0,0,.05)",
        }}
      >
        <h2
          style={{
            margin: 0,
            color: "#153848",
          }}
        >
          No Shows Yet
        </h2>

        <p
          style={{
            marginTop: 18,
            color: "#666",
            lineHeight: 1.8,
          }}
        >
          This creator hasn't published any shows yet.
        </p>
      </section>
    );
  }

  return (
    <section
      style={{
        marginTop: 70,
      }}
    >
      <div
        style={{
          marginBottom: 35,
        }}
      >
        <div
          style={{
            color: "#B48A45",
            fontWeight: 700,
            letterSpacing: 2,
            marginBottom: 10,
          }}
        >
          SHOWS
        </div>

        <h2
          style={{
            margin: 0,
            color: "#153848",
            fontSize: 42,
          }}
        >
          Creator Shows
        </h2>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(430px,1fr))",
          gap: 30,
        }}
      >
        {shows.map((show) => (
          <a
            key={show.id}
            href={show.href}
            style={{
              textDecoration: "none",
            }}
          >
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: 32,
                overflow: "hidden",
                boxShadow: "0 15px 40px rgba(0,0,0,.05)",
                transition: ".25s",
              }}
            >
              {/* Cover */}

              <div
                style={{
                  height: 220,
                  background: show.cover
                    ? `url(${show.cover}) center/cover`
                    : "#153848",
                  position: "relative",
                }}
              >
                {show.logo && (
                  <div
                    style={{
                      position: "absolute",
                      left: 30,
                      bottom: 30,
                      width: 90,
                      height: 90,
                      background: "#FFFFFF",
                      borderRadius: 20,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      src={show.logo}
                      alt={show.name}
                      width={65}
                      height={65}
                    />
                  </div>
                )}
              </div>

              {/* Content */}

              <div
                style={{
                  padding: 30,
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    color: "#153848",
                    fontSize: 34,
                  }}
                >
                  {show.name}
                </h3>

                <p
                  style={{
                    marginTop: 18,
                    color: "#666",
                    lineHeight: 1.9,
                    minHeight: 90,
                  }}
                >
                  {show.description}
                </p>

                <div
                  style={{
                    marginTop: 28,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      color: "#153848",
                      fontWeight: 700,
                    }}
                  >
                    Enter Show
                  </span>

                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: "#153848",
                      color: "#FFFFFF",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: 22,
                    }}
                  >
                    →
                  </div>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}