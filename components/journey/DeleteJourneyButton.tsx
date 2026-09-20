"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteJourneyButton({ userJourneyId, journeyName }: { userJourneyId: string; journeyName: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${journeyName}"? This can't be undone.`)) return;
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
    <button
      onClick={handleDelete}
      disabled={busy}
      className="text-center text-xs font-semibold mt-3 disabled:opacity-60"
      style={{ color: "#C24A16" }}
    >
      {busy ? "Deleting…" : "Delete this journey"}
    </button>
  );
}
