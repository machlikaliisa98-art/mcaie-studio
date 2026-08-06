"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    country: "",
    category: "Podcaster",
  });

  function update(
    key: keyof typeof form,
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      // Backend endpoint (we'll build this next)
      const response = await fetch(
        "http://127.0.0.1:8000/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            full_name: form.fullName,
            username: form.username,
            email: form.email,
            password: form.password,
            country: form.country,
            creator_category: form.category,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Registration failed.");
      }

      const data = await response.json();

      console.log(data);

      setMessage("Account created successfully.");

      setForm({
        fullName: "",
        username: "",
        email: "",
        password: "",
        country: "",
        category: "Podcaster",
      });

    } catch (err) {
      console.error(err);

      setMessage(
        "Backend not connected yet. Registration endpoint will be implemented next."
      );
    }

    setLoading(false);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#F6F1E8",
        display: "grid",
        gridTemplateColumns: "520px 1fr",
      }}
    >
      <section
        style={{
          background: "#153848",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 40,
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            maxWidth: 430,
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
            Create Account
          </h2>

          <p
            style={{
              color: "#777",
              marginBottom: 30,
            }}
          >
            Join FONS and begin preserving conversations that matter.
          </p>

          <Input
            label="Full Name"
            value={form.fullName}
            placeholder="John Doe"
            onChange={(v) => update("fullName", v)}
          />

          <Input
            label="Username"
            value={form.username}
            placeholder="@username"
            onChange={(v) => update("username", v)}
          />

          <Input
            label="Email"
            value={form.email}
            placeholder="you@example.com"
            type="email"
            onChange={(v) => update("email", v)}
          />

          <Input
            label="Password"
            value={form.password}
            type="password"
            placeholder="Password"
            onChange={(v) => update("password", v)}
          />

          <Input
            label="Country"
            value={form.country}
            placeholder="Country"
            onChange={(v) => update("country", v)}
          />

          <div style={{ marginBottom: 22 }}>
            <label
              style={{
                fontWeight: 700,
                color: "#153848",
              }}
            >
              Creator Category
            </label>

            <select
              value={form.category}
              onChange={(e) =>
                update("category", e.target.value)
              }
              style={inputStyle}
            >
              <option>Podcaster</option>
              <option>Speaker</option>
              <option>Educator</option>
              <option>Business</option>
              <option>Faith</option>
              <option>Politics</option>
              <option>Technology</option>
              <option>University</option>
              <option>Church</option>
              <option>Media House</option>
              <option>Government</option>
              <option>Other</option>
            </select>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                fontWeight: 700,
                color: "#153848",
              }}
            >
              Profile Photo
            </label>

            <input
              type="file"
              accept="image/*"
              style={{
                width: "100%",
                marginTop: 10,
              }}
            />
          </div>

          <div style={{ marginBottom: 30 }}>
            <label
              style={{
                fontWeight: 700,
                color: "#153848",
              }}
            >
              Cover Photo
            </label>

            <input
              type="file"
              accept="image/*"
              style={{
                width: "100%",
                marginTop: 10,
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: "#153848",
              color: "#FFFFFF",
              border: "none",
              padding: 18,
              borderRadius: 999,
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

          {message && (
            <p
              style={{
                marginTop: 18,
                color: "#B48A45",
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              {message}
            </p>
          )}

          <div
            style={{
              textAlign: "center",
              marginTop: 28,
              color: "#666",
            }}
          >
            Already have an account?
          </div>

          <Link
            href="/login"
            style={{
              textDecoration: "none",
            }}
          >
            <button
              type="button"
              style={{
                width: "100%",
                marginTop: 14,
                padding: 18,
                borderRadius: 999,
                border: "1px solid #153848",
                background: "#FFFFFF",
                color: "#153848",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Sign In
            </button>
          </Link>
        </form>
      </section>

      <section
        style={{
          padding: 90,
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <img
          src="/fons-logo.png"
          alt="FONS"
          style={{
            width: 250,
            marginBottom: 50,
          }}
        />

        <div
          style={{
            color: "#B48A45",
            letterSpacing: 3,
            fontWeight: 700,
            marginBottom: 24,
          }}
        >
          CREATE • PRESERVE • INSPIRE
        </div>

        <h1
          style={{
            color: "#153848",
            fontSize: 70,
            lineHeight: 1,
            margin: 0,
          }}
        >
          Build a home
          <br />
          for your ideas.
        </h1>

        <p
          style={{
            color: "#666",
            maxWidth: 700,
            marginTop: 30,
            lineHeight: 1.9,
            fontSize: 21,
          }}
        >
          Whether you're a podcaster, educator, researcher,
          business leader or storyteller, FONS preserves,
          organizes and transforms conversations into a
          permanent knowledge library.
        </p>
      </section>
    </main>
  );
}

type InputProps = {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  type?: string;
};

function Input({
  label,
  value,
  placeholder,
  onChange,
  type = "text",
}: InputProps) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label
        style={{
          fontWeight: 700,
          color: "#153848",
        }}
      >
        {label}
      </label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        placeholder={placeholder}
        style={inputStyle}
      />
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: 18,
  marginTop: 10,
  borderRadius: 16,
  border: "1px solid #DDD",
  background: "#FFFFFF",
  fontSize: 16,
  boxSizing: "border-box",
};