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

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-center text-xs font-semibold"
        style={{ color: "#C24A16" }}
      >
        Delete this journey
      </button>
    );
  }

  return (
    <div className="w-full rounded-2xl border p-4" style={{ borderColor: "#FCE4D8", background: "#FFF6F2" }}>
      <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
        Delete &ldquo;{journeyName}&rdquo;? This can&rsquo;t be undone.
      </p>
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => setOpen(false)}
          disabled={busy}
          className="flex-1 rounded-lg py-2 text-sm font-semibold disabled:opacity-60"
          style={{ background: "var(--color-card)", color: "var(--color-text-secondary)" }}
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          disabled={busy}
          className="flex-1 rounded-lg py-2 text-sm font-bold text-white disabled:opacity-60"
          style={{ background: "#C24A16" }}
        >
          {busy ? "Deleting…" : "Delete journey"}
        </button>
      </div>
    </div>
  );
}
