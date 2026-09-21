"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteJourneyButton({ userJourneyId, journeyName }: { userJourneyId: string; journeyName: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    setBusy(true);
    const response = await fetch("/api/journeys/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userJourneyId }),
    });
    if (response.ok) {
      router.push("/home");
      router.refresh();
    } else {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-center text-xs font-semibold"
        style={{ color: "#C24A16" }}
      >
        Delete this journey
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ background: "rgba(18, 32, 61, 0.35)", backdropFilter: "blur(2px)" }}
          onClick={() => !busy && setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border p-5"
            style={{ background: "var(--color-bg)", borderColor: "var(--color-border)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-sm font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}>
              Delete journey?
            </div>
            <p className="text-xs mt-1.5" style={{ color: "var(--color-text-secondary)" }}>
              Delete &ldquo;{journeyName}&rdquo;? This can&rsquo;t be undone.
            </p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setOpen(false)}
                disabled={busy}
                className="flex-1 rounded-lg py-2.5 text-sm font-semibold disabled:opacity-60"
                style={{ background: "var(--color-card)", color: "var(--color-text-secondary)" }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={busy}
                className="flex-1 rounded-lg py-2.5 text-sm font-bold text-white disabled:opacity-60"
                style={{ background: "#C24A16" }}
              >
                {busy ? "Deleting…" : "Delete journey"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
