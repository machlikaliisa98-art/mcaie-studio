"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { API_URL } from "@/config/api";

type LoginResponse = {
  success?: boolean;
  access_token?: string;
  token_type?: string;
  account_type?: "creator" | "listener";

  creator?: {
    id: number;
    full_name: string;
    username: string;
    email: string;
    country: string;
    creator_category?: string;
    verified?: boolean;
    active?: boolean;
  };

  listener?: {
    id: number;
    full_name: string;
    username: string;
    email: string;
    country: string;
    active?: boolean;
  };

  detail?: string;
};

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    if (!email.trim() || !password) {
      setError(
        "Please enter your email or username and password."
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data: LoginResponse = await response
        .json()
        .catch(() => ({
          detail:
            "The server returned an invalid response.",
        }));

      if (!response.ok) {
        setError(
          data.detail ||
            "Unable to sign in. Please check your credentials."
        );
        return;
      }

      if (!data.access_token) {
        setError(
          "Login succeeded but no access token was returned."
        );
        return;
      }

      /*
       * ------------------------------------------------------
       * AUTHENTICATION
       * ------------------------------------------------------
       */

      localStorage.setItem(
        "token",
        data.access_token
      );

      /*
       * Store the account type returned by the backend.
       */

      if (data.account_type) {
        localStorage.setItem(
          "account_type",
          data.account_type
        );
      }

      /*
       * Store creator identity when applicable.
       */

      if (data.creator) {
        localStorage.setItem(
          "creator",
          JSON.stringify(data.creator)
        );
      }

      /*
       * Store listener identity when applicable.
       */

      if (data.listener) {
        localStorage.setItem(
          "listener",
          JSON.stringify(data.listener)
        );
      }

      /*
       * ------------------------------------------------------
       * ROLE-BASED APPLICATION ROUTING
       * ------------------------------------------------------
       *
       * Creator:
       *     /dashboard
       *
       * Listener:
       *     /library
       *
       * The backend determines the account type.
       */

      if (data.account_type === "listener") {
        router.push("/library");
        return;
      }

      if (data.account_type === "creator") {
        router.push("/dashboard");
        return;
      }

      /*
       * Never silently send an unknown account type
       * into the creator application.
       */

      localStorage.removeItem("token");
      localStorage.removeItem("account_type");
      localStorage.removeItem("creator");
      localStorage.removeItem("listener");

      setError(
        "Your account type could not be determined. Please try again."
      );
    } catch (err) {
      console.error("FONS login error:", err);

      setError(
        "Unable to connect to FONS. Please make sure the server is running."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="fons-auth-page">
      <div className="fons-auth-shell">

        {/* ==================================================
            FONS BRAND PANEL
        ================================================== */}

        <section className="fons-auth-brand">
          <div className="fons-auth-brand-inner">

            <Link
              href="/"
              className="fons-auth-logo-link"
              aria-label="FONS"
            >
              <img
                src="/fons-logo.png"
                alt="FONS"
                className="fons-auth-logo"
              />
            </Link>

            <div className="fons-auth-brand-content">

              <div className="fons-auth-kicker">
                FONS
              </div>

              <h1>
                Conversations
                <br />
                worth keeping.
              </h1>

              <p>
                Your space for listening, creating
                and preserving the conversations
                that matter.
              </p>

            </div>

            <div className="fons-auth-brand-footer">
              <span>
                THE CONVERSATION PLATFORM
              </span>
            </div>

          </div>
        </section>

        {/* ==================================================
            LOGIN PANEL
        ================================================== */}

        <section className="fons-auth-form-panel">
          <div className="fons-auth-form-wrap">

            {/* Mobile FONS logo */}

            <div className="fons-auth-mobile-logo">
              <Link
                href="/"
                aria-label="FONS"
              >
                <img
                  src="/fons-logo.png"
                  alt="FONS"
                />
              </Link>
            </div>

            {/* Heading */}

            <div className="fons-auth-heading">

              <div className="fons-auth-form-kicker">
                WELCOME BACK
              </div>

              <h2>
                Sign in.
              </h2>

              <p>
                Enter your details to continue to FONS.
              </p>

            </div>

            {/* Error */}

            {error && (
              <div
                className="fons-auth-error"
                role="alert"
              >
                <span className="fons-auth-error-icon">
                  !
                </span>

                <span>
                  {error}
                </span>
              </div>
            )}

            {/* ==================================================
                FORM
            ================================================== */}

            <form
              onSubmit={(event) => {
                event.preventDefault();
                void handleLogin();
              }}
            >

              {/* Email / Username */}

              <div className="fons-field">

                <label htmlFor="email">
                  Email or username
                </label>

                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="name@example.com"
                  autoComplete="username"
                  autoFocus
                  disabled={loading}
                />

              </div>

              {/* Password */}

              <div className="fons-field">

                <div className="fons-field-label-row">

                  <label htmlFor="password">
                    Password
                  </label>

                  <button
                    type="button"
                    className="fons-forgot-button"
                    onClick={() =>
                      setError(
                        "Password recovery is not available yet."
                      )
                    }
                    disabled={loading}
                  >
                    Forgot password?
                  </button>

                </div>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={loading}
                />

              </div>

              {/* Submit */}

              <button
                type="submit"
                className="fons-auth-submit"
                disabled={loading}
              >

                {loading ? (
                  <>
                    <span className="fons-spinner" />

                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in

                    <span className="fons-submit-arrow">
                      →
                    </span>
                  </>
                )}

              </button>

            </form>

            {/* Divider */}

            <div className="fons-auth-divider">

              <span />

              <small>
                OR
              </small>

              <span />

            </div>

            {/* Register */}

            <div className="fons-auth-register">

              <span>
                New to FONS?
              </span>

              <Link href="/register">
                Create an account

                <span>
                  →
                </span>
              </Link>

            </div>

            {/* Legal / product note */}

            <div className="fons-auth-note">
              By continuing, you agree to use FONS
              responsibly and respectfully.
            </div>

          </div>
        </section>

      </div>
    </main>
  );
}