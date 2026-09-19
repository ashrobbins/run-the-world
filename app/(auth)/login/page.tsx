"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const callbackError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [googleBusy, setGoogleBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/home`,
      },
    });
    setStatus(error ? "error" : "sent");
  }

  async function handleGoogleSignIn() {
    setGoogleBusy(true);
    const supabase = createClient();
    // Redirects the browser away — no local state update needed after this.
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/home`,
      },
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "var(--color-bg)" }}>
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}>
          Run the World
        </h1>
        <p className="text-sm mb-6" style={{ color: "var(--color-text-secondary)" }}>
          Turn your real runs into journeys across the globe.
        </p>

        {callbackError && (
          <div
            className="text-xs rounded-lg px-3 py-2.5 mb-4"
            style={{ background: "var(--color-danger-bg)", color: "var(--color-danger)" }}
          >
            {callbackError}
          </div>
        )}

        <button
          onClick={handleGoogleSignIn}
          disabled={googleBusy}
          className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold border disabled:opacity-60"
          style={{ borderColor: "var(--color-border)", color: "var(--color-text-primary)" }}
        >
          <GoogleIcon />
          {googleBusy ? "Redirecting…" : "Continue with Google"}
        </button>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px" style={{ background: "var(--color-border)" }} />
          <span className="text-xs font-medium" style={{ color: "var(--color-text-faint)" }}>or</span>
          <div className="flex-1 h-px" style={{ background: "var(--color-border)" }} />
        </div>

        {status === "sent" ? (
          <p className="text-sm font-medium" style={{ color: "var(--color-success)" }}>
            Check your email for a sign-in link.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl px-4 py-3 text-sm border outline-none"
              style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="rounded-xl py-3 text-sm font-bold text-white disabled:opacity-60"
              style={{ background: "var(--color-accent)", fontFamily: "var(--font-heading)" }}
            >
              {status === "sending" ? "Sending…" : "Send magic link"}
            </button>
            {status === "error" && (
              <p className="text-sm" style={{ color: "var(--color-danger)" }}>
                Something went wrong — try again.
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0012 23z" />
      <path fill="#FBBC05" d="M5.84 14.09A6.6 6.6 0 015.5 12c0-.73.13-1.43.34-2.09V7.07H2.18A11 11 0 001 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a11 11 0 00-9.82 6.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}
