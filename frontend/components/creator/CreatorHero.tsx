"use client";

import Image from "next/image";

export type Creator = {
  id: string;
  name: string;
  bio: string;
  profileImage?: string;
  coverImage?: string;
  verified: boolean;
};

type Props = {
  creator: Creator;
};

export default function CreatorHero({ creator }: Props) {
  return (
    <>
      {/* Cover */}

      <div
        style={{
          height: 340,
          background: creator.coverImage
            ? `url(${creator.coverImage}) center/cover`
            : "linear-gradient(135deg,#153848,#204F61)",
          borderRadius: 36,
          position: "relative",
          overflow: "hidden",
        }}
      />

      {/* Profile */}

      <div
        style={{
          marginTop: -90,
          paddingInline: 50,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 30,
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              width: 180,
              height: 180,
              borderRadius: "50%",
              overflow: "hidden",
              background: "#FFFFFF",
              border: "6px solid #FFFFFF",
              boxShadow: "0 16px 45px rgba(0,0,0,.18)",
            }}
          >
            {creator.profileImage ? (
              <Image
                src={creator.profileImage}
                alt={creator.name}
                width={180}
                height={180}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : null}
          </div>

          <div
            style={{
              paddingBottom: 18,
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: 52,
                color: "#153848",
              }}
            >
              {creator.name}

              {creator.verified && (
                <span
                  style={{
                    marginLeft: 14,
                    color: "#1E88E5",
                    fontSize: 30,
                  }}
                >
                  ✓
                </span>
              )}
            </h1>

            <p
              style={{
                marginTop: 18,
                maxWidth: 760,
                color: "#666",
                lineHeight: 1.9,
                fontSize: 18,
              }}
            >
              {creator.bio}
            </p>
          </div>
        </div>

        <button
          style={{
            background: "#153848",
            color: "#FFFFFF",
            border: "none",
            padding: "18px 34px",
            borderRadius: 999,
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          Follow Creator
        </button>
      </div>
    </>
  );
}