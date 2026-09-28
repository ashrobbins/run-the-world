"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NewActivitySyncedModal } from "@/components/journey/NewActivitySyncedModal";
import type { SyncResult } from "@/lib/strava/import";
import type { UnitPreference } from "@/lib/units";

export function SyncNowButton({ userJourneyId, unit }: { userJourneyId: string; unit: UnitPreference }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "syncing" | "error" | "no-activity">("idle");
  const [syncedResult, setSyncedResult] = useState<SyncResult | null>(null);

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

      if (result.syncedActivity) {
        setSyncedResult(result);
        setStatus("idle");
        return;
      }

      setStatus("no-activity");
      setTimeout(() => setStatus((s) => (s === "no-activity" ? "idle" : s)), 4000);
    } catch {
      setStatus("error");
    }
  }

  function handleModalClose() {
    setSyncedResult(null);
    router.refresh();
  }

  return (
    <>
      <button
        onClick={handleSync}
        disabled={status === "syncing"}
        className="w-full mt-3 rounded-xl py-3 text-sm font-bold disabled:opacity-60"
        style={{ background: "var(--color-accent)", color: "#FFFFFF", fontFamily: "var(--font-heading)" }}
      >
        {status === "syncing" ? "Syncing…" : "Sync Now"}
      </button>
      {status === "error" && (
        <p className="text-center text-xs font-semibold mt-1.5" style={{ color: "var(--color-danger)" }}>
          Sync failed — try again.
        </p>
      )}
      {status === "no-activity" && (
        <p className="text-center text-xs font-semibold mt-1.5" style={{ color: "var(--color-danger)" }}>
          No new activity found.
        </p>
      )}

      {syncedResult?.syncedActivity && (
        <NewActivitySyncedModal
          activity={syncedResult.syncedActivity}
          distanceAdded={syncedResult.distanceAdded}
          journeysCredited={syncedResult.journeysCredited}
          crossedCheckpoint={null}
          userJourneyId={userJourneyId}
          unit={unit}
          onClose={handleModalClose}
        />
      )}
    </>
  );
}
