"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SyncResult } from "@/lib/strava/import";

export function SyncNowButton({ userJourneyId }: { userJourneyId: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "syncing" | "error">("idle");

  async function handleSync() {
    setStatus("syncing");
    try {
      const response = await fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userJourneyId }),
      });
      if (!response.ok) throw new Error("Sync failed");
      const result: SyncResult = await response.json();

      if (result.crossedCheckpoint) {
        router.push(
          `/journey/${userJourneyId}/checkpoint-unlocked?checkpointId=${result.crossedCheckpoint.id}`,
        );
        return;
      }

      router.refresh();
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  return (
    <button
      onClick={handleSync}
      disabled={status === "syncing"}
      className="w-full mt-3 rounded-xl py-3 text-sm font-bold disabled:opacity-60"
      style={{ background: "var(--color-accent)", color: "#FFFFFF", fontFamily: "var(--font-heading)" }}
    >
      {status === "syncing" ? "Syncing…" : "Sync Now"}
      {status === "error" && (
        <span className="block text-xs font-normal mt-1" style={{ color: "#FFD9D9" }}>
          Sync failed — try again.
        </span>
      )}
    </button>
  );
}
