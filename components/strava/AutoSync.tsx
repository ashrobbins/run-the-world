"use client";

import { useEffect, useRef, useState } from "react";
import { NewActivitySyncedModal } from "@/components/journey/NewActivitySyncedModal";
import type { SyncResult } from "@/lib/strava/import";
import type { UnitPreference } from "@/lib/units";

const SYNC_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes

/** Mounted once in the (app) layout for Strava-connected users: syncs immediately
 * on app open, then every 30 minutes while the tab stays open. Purely additive —
 * never navigates the user away, just surfaces a modal when it finds something new. */
export function AutoSync({ unit }: { unit: UnitPreference }) {
  const [result, setResult] = useState<SyncResult | null>(null);
  const syncingRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function runSync() {
      if (syncingRef.current) return;
      syncingRef.current = true;
      try {
        const response = await fetch("/api/sync", { method: "POST" });
        if (response.ok) {
          const data: SyncResult = await response.json();
          if (!cancelled && data.syncedActivity) setResult(data);
        }
      } catch {
        // Silent — this is a background convenience sync, not a user-initiated action.
      } finally {
        syncingRef.current = false;
      }
    }

    runSync();
    const interval = setInterval(runSync, SYNC_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  if (!result?.syncedActivity) return null;

  return (
    <NewActivitySyncedModal
      activity={result.syncedActivity}
      distanceAdded={result.distanceAdded}
      journeysCredited={result.journeysCredited}
      crossedCheckpoint={result.crossedCheckpoint}
      userJourneyId={result.focusUserJourneyId}
      unit={unit}
      onClose={() => setResult(null)}
    />
  );
}
