"use client";

import Link from "next/link";
import { formatDistance, type UnitPreference } from "@/lib/units";
import type { SyncedActivitySummary } from "@/lib/strava/import";

export function NewActivitySyncedModal({
  activity,
  distanceAdded,
  journeysCredited,
  crossedCheckpoint,
  userJourneyId,
  unit,
  onClose,
}: {
  activity: SyncedActivitySummary;
  distanceAdded: number;
  journeysCredited: number;
  crossedCheckpoint: { id: string; name: string } | null;
  userJourneyId: string | null;
  unit: UnitPreference;
  onClose: () => void;
}) {
  const formattedDate = new Date(activity.date).toLocaleDateString("en-GB", {
    weekday: "long",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      style={{ background: "rgba(18, 32, 61, 0.35)", backdropFilter: "blur(2px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6 relative"
        style={{ background: "var(--color-bg)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4">
          <CloseIcon />
        </button>

        <div className="flex justify-center mt-2">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: "var(--color-accent-light)" }}
          >
            <RunIcon />
          </div>
        </div>

        <div className="text-center mt-4">
          <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--color-accent)" }}>
            Activity synced
          </div>
          <div className="text-lg font-extrabold mt-1" style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}>
            {activity.name}
          </div>
          <div className="text-xs font-semibold mt-1" style={{ color: "var(--color-text-secondary)" }}>
            {formattedDate}
            {activity.locationLabel ? ` · ${activity.locationLabel}` : ""}
          </div>
        </div>

        <div className="flex flex-row gap-3 mt-4">
          <div className="flex-1 rounded-xl p-3 text-center" style={{ background: "var(--color-card)" }}>
            <div className="text-[10px] font-semibold uppercase" style={{ color: "var(--color-text-secondary)" }}>
              Distance
            </div>
            <div className="text-base font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}>
              {formatDistance(activity.distanceKm, unit)}
            </div>
          </div>
          {activity.elevationGainM !== null && (
            <div className="flex-1 rounded-xl p-3 text-center" style={{ background: "var(--color-card)" }}>
              <div className="text-[10px] font-semibold uppercase" style={{ color: "var(--color-text-secondary)" }}>
                Elevation
              </div>
              <div className="text-base font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}>
                {Math.round(activity.elevationGainM)} m
              </div>
            </div>
          )}
        </div>

        <div className="rounded-xl p-3.5 mt-3 text-xs font-semibold text-center" style={{ background: "var(--color-accent-light)", color: "var(--color-text-primary)" }}>
          Added {formatDistance(distanceAdded, unit)} to {journeysCredited} journey{journeysCredited === 1 ? "" : "s"}
        </div>

        {crossedCheckpoint && (
          <Link
            href={userJourneyId ? `/journey/${userJourneyId}/checkpoint-unlocked?checkpointId=${crossedCheckpoint.id}` : "#"}
            className="block rounded-xl p-3.5 mt-3 text-xs font-bold text-center text-white"
            style={{ background: "var(--color-accent)" }}
          >
            You also reached {crossedCheckpoint.name}! Tap to celebrate 🎉
          </Link>
        )}

        <button
          onClick={onClose}
          className="w-full rounded-xl py-3 text-sm font-bold text-white mt-4"
          style={{ background: "var(--color-accent)", fontFamily: "var(--font-heading)" }}
        >
          Nice!
        </button>
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="2" strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function RunIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13" cy="4" r="1.5" fill="var(--color-accent)" stroke="none" />
      <path d="M10.5 8.5L13 7l2 3 3.5 1.5M13 7l-2 4-4 1.5M9 12.5L7 17M11 12l3 2-1 5" />
    </svg>
  );
}
