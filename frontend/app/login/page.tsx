"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [status, setStatus] = useState("");
  const [debug, setDebug] = useState("");

  async function handleLogin() {
    setLoading(true);
    setError("");
    setStatus("");
    setDebug("");

    try {
      const payload = {
        email,
        password,
      };

      setDebug(
        "REQUEST\n\n" +
        JSON.stringify(payload, null, 2)
      );

      const response = await fetch(
        import { API_URL } from "@/config/api";
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      setStatus(response.status.toString());

      setDebug(
        "RESPONSE\n\n" +
        JSON.stringify(data, null, 2)
      );

      if (!response.ok) {
        setError(data.detail || "Login failed.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.access_token);
      localStorage.setItem(
        "creator",
        JSON.stringify(data.creator)
      );

      router.push("/dashboard");
    } catch (err) {
      console.error(err);

      setError("Unable to connect to the server.");

      setDebug(String(err));
    }

    setLoading(false);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#F6F1E8",
        display: "grid",
        gridTemplateColumns: "1fr 520px",
      }}
    >
      <section
        style={{
          padding: "80px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <img
          src="/fons-logo.png"
          alt="FONS"
          style={{
            width: 240,
            marginBottom: 50,
          }}
        />

        <div
          style={{
            color: "#B48A45",
            letterSpacing: 3,
            fontWeight: 700,
            marginBottom: 22,
            fontSize: 13,
          }}
        >
          RETURN FOR WISDOM
        </div>

        <h1
          style={{
            margin: 0,
            color: "#153848",
            fontSize: 74,
            lineHeight: 1,
            maxWidth: 720,
            fontWeight: 700,
          }}
        >
          Welcome
          <br />
          back.
        </h1>

        <p
          style={{
            marginTop: 34,
            color: "#666",
            fontSize: 21,
            lineHeight: 1.9,
            maxWidth: 700,
          }}
        >
          Sign in to continue creating, preserving and sharing
          conversations that matter.
        </p>
      </section>

      <section
        style={{
          background: "#153848",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 40,
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 420,
            background: "#FFFFFF",
            borderRadius: 34,
            padding: 42,
          }}
        >
          <h2
            style={{
              marginTop: 0,
              color: "#153848",
              fontSize: 34,
            }}
          >
            Sign In
          </h2>

          <p
            style={{
              color: "#777",
              marginBottom: 36,
            }}
          >
            Access your creator workspace.
          </p>

          {error && (
            <div
              style={{
                marginBottom: 20,
                padding: 14,
                background: "#FFE8E8",
                color: "#B00020",
                borderRadius: 12,
                fontWeight: 600,
              }}
            >
              {error}
            </div>
          )}

          <div style={{ marginBottom: 24 }}>
            <label
              style={{
                display: "block",
                marginBottom: 10,
                fontWeight: 700,
                color: "#153848",
              }}
            >
              Email or Username
            </label>

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              placeholder="name@example.com"
              style={{
                width: "100%",
                padding: "18px",
                borderRadius: 16,
                border: "1px solid #DDD",
                fontSize: 16,
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                marginBottom: 10,
                fontWeight: 700,
                color: "#153848",
              }}
            >
              Password
            </label>

            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              style={{
                width: "100%",
                padding: "18px",
                borderRadius: 16,
                border: "1px solid #DDD",
                fontSize: 16,
                boxSizing: "border-box",
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleLogin();
                }
              }}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: "100%",
              padding: "18px",
              borderRadius: 999,
              background: "#153848",
              color: "#FFFFFF",
              border: "none",
              fontWeight: 700,
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          {status && (
            <div
              style={{
                marginTop: 20,
                padding: 12,
                background: "#F5F5F5",
                borderRadius: 12,
                fontSize: 13,
                whiteSpace: "pre-wrap",
              }}
            >
              <strong>Status:</strong> {status}
            </div>
          )}

          {debug && (
            <div
              style={{
                marginTop: 12,
                padding: 12,
                background: "#F5F5F5",
                borderRadius: 12,
                fontSize: 12,
                whiteSpace: "pre-wrap",
                overflowX: "auto",
              }}
            >
              {debug}
            </div>
          )}

          <div
            style={{
              textAlign: "center",
              marginTop: 28,
              color: "#666",
            }}
          >
            Don't have an account?
          </div>

          <Link href="/register">
            <button
              style={{
                width: "100%",
                marginTop: 16,
                padding: "18px",
                borderRadius: 999,
                border: "1px solid #153848",
                background: "#FFFFFF",
                color: "#153848",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Create Account
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}