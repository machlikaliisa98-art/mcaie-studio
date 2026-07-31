"use client";

import Link from "next/link";
import { useState } from "react";
import { createSession } from "../../services/sessions";

export default function LiveStudio() {

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Podcast");
  const [host, setHost] = useState("Host");

  const [creating, setCreating] = useState(false);

  const [session, setSession] = useState<any>(null);

  async function startLive() {

    if (!title.trim()) {

      alert("Enter a session title.");

      return;

    }

    try {

      setCreating(true);

      const data = await createSession(

        title,

        category,

        host,

      );

      setSession(data);

    }

    catch (err) {

      console.error(err);

      alert("Unable to create session.");

    }

    finally {

      setCreating(false);

    }

  }

  if (session) {

    return (

      <main
        style={{
          minHeight: "100vh",
          background: "#08131F",
          color: "#FFFFFF",
          padding: 40,
        }}
      >

        <h1
          style={{
            marginBottom: 30,
          }}
        >
          🎙 Live Session Created
        </h1>

        <div
          style={{
            background: "#13263D",
            borderRadius: 24,
            padding: 32,
            maxWidth: 750,
          }}
        >

          <h2
            style={{
              marginTop: 0,
            }}
          >
            {session.title}
          </h2>

          <Info
            title="Session ID"
            value={session.id}
          />

          <Info
            title="Status"
            value={session.status}
          />

          <Info
            title="Category"
            value={session.category}
          />

          <Info
            title="Host"
            value={session.host}
          />

          <Link
            href={`/live/${session.id}`}
            style={{
              display: "inline-block",
              marginTop: 35,
              background: "#1E6FA8",
              color: "#FFFFFF",
              textDecoration: "none",
              padding: "16px 36px",
              borderRadius: 14,
              fontWeight: 700,
            }}
          >
            Enter Broadcast Room →
          </Link>

        </div>

      </main>

    );

  }

  return (

    <main
      style={{
        minHeight: "100vh",
        background: "#08131F",
        color: "#FFFFFF",
        padding: 40,
      }}
    >

      <h1
        style={{
          fontSize: 42,
          marginBottom: 8,
        }}
      >
        MCAIE Live Studio
      </h1>

      <p
        style={{
          color: "#9FB4C9",
          marginBottom: 40,
          fontSize: 18,
        }}
      >
        Create and broadcast a professional live session.
      </p>

      <div
        style={{
          maxWidth: 760,
          background: "#13263D",
          borderRadius: 24,
          padding: 32,
        }}
      >

        <div style={{ marginBottom: 24 }}>

          <label>Session Title</label>

          <input
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            placeholder="The Future of AI in Africa"
            style={inputStyle}
          />

        </div>

        <div style={{ marginBottom: 24 }}>

          <label>Category</label>

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            style={inputStyle}
          >

            <option>Podcast</option>
            <option>Technology</option>
            <option>Business</option>
            <option>Education</option>
            <option>Politics</option>
            <option>Health</option>

          </select>

        </div>

        <div style={{ marginBottom: 30 }}>

          <label>Host Name</label>

          <input
            value={host}
            onChange={(e) =>
              setHost(e.target.value)
            }
            style={inputStyle}
          />

        </div>

        <button
          onClick={startLive}
          disabled={creating}
          style={{
            background: "#1E6FA8",
            color: "#FFFFFF",
            border: "none",
            padding: "16px 34px",
            borderRadius: 14,
            fontWeight: 700,
            cursor: "pointer",
            fontSize: 15,
          }}
        >

          {creating

            ? "Creating Session..."

            : "Start Live Session"}

        </button>

      </div>

    </main>

  );

}

function Info({

  title,

  value,

}:{

  title:string;

  value:string;

}){

  return(

    <div
      style={{
        marginTop:20,
      }}
    >

      <div
        style={{
          color:"#8EA2BD",
          fontSize:13,
          textTransform:"uppercase",
          marginBottom:6,
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize:24,
          fontWeight:700,
        }}
      >
        {value}
      </div>

    </div>

  );

}

const inputStyle = {

  width: "100%",

  padding: "14px",

  marginTop: 8,

  borderRadius: 12,

  border: "1px solid rgba(255,255,255,.08)",

  background: "#0F1F32",

  color: "#FFFFFF",

  fontSize: 15,

} as const;