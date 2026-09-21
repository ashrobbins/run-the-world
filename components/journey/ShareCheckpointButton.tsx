"use client";

import { useState } from "react";

export function ShareCheckpointButton({ title, text }: { title: string; text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, text });
      } catch {
        // User cancelled the share sheet — not an error.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access denied — nothing more we can do without a backend.
    }
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center justify-center gap-1.5 text-xs font-semibold mt-3 mx-auto"
      style={{ color: "var(--color-text-secondary)" }}
    >
      <ShareIcon />
      {copied ? "Copied to clipboard" : "Share this checkpoint"}
    </button>
  );
}

function ShareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.6 13.5l6.8 3.9M15.4 6.6L8.6 10.5" />
    </svg>
  );
}
