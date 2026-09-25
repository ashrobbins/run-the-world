"use client";

import { useState } from "react";
import { CheckpointMarker } from "@/components/checkpoint-marker/CheckpointMarker";
import { CheckpointStampModal, type StampModalCheckpoint } from "@/components/journey/CheckpointStampModal";
import type { CheckpointState } from "@/lib/journeys/progress";
import { formatDistance, type UnitPreference } from "@/lib/units";

export interface PassportStamp extends StampModalCheckpoint {
  country_code: string;
  userJourneyId: string;
  routeLabel: string;
  journeyDistanceCompleted: number;
}

export function PassportContent({
  stamps,
  mostRecentStamp,
  unit,
  lastActivityDate,
}: {
  stamps: PassportStamp[];
  mostRecentStamp: PassportStamp | null;
  unit: UnitPreference;
  lastActivityDate: string | null;
}) {
  const [openStamp, setOpenStamp] = useState<PassportStamp | null>(null);

  return (
    <>
      {mostRecentStamp && (
        <button
          onClick={() => setOpenStamp(mostRecentStamp)}
          className="w-full flex items-center gap-3 rounded-2xl p-3.5 mb-5 border text-left"
          style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}
        >
          <CheckpointMarker countryCode={mostRecentStamp.country_code} state="reached" size={52} />
          <div className="flex-1">
            <div className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-secondary)" }}>
              Most recent stamp
            </div>
            <div className="text-sm font-bold mt-0.5" style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}>
              {mostRecentStamp.name}
            </div>
            <div className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
              {lastActivityDate
                ? `Stamped ${new Date(lastActivityDate).toLocaleDateString("en-GB", { month: "short", day: "numeric", timeZone: "UTC" })}`
                : formatDistance(mostRecentStamp.distance_from_start, unit)}{" "}
              &middot; {mostRecentStamp.routeLabel}
            </div>
          </div>
        </button>
      )}

      {stamps.length === 0 ? (
        <p className="text-center text-sm" style={{ color: "var(--color-text-secondary)" }}>
          Start a journey and your first stamp will show up here.
        </p>
      ) : (
        <div className="grid grid-cols-4 gap-4 justify-items-center">
          {stamps.map((stamp) => (
            <button key={stamp.id} onClick={() => setOpenStamp(stamp)}>
              <CheckpointMarker
                countryCode={stamp.country_code}
                state={stamp.state as CheckpointState}
                label={stamp.name}
                size={58}
              />
            </button>
          ))}
        </div>
      )}

      {openStamp && (
        <CheckpointStampModal
          checkpoint={openStamp}
          userJourneyId={openStamp.userJourneyId}
          routeLabel={openStamp.routeLabel}
          distanceCompleted={openStamp.journeyDistanceCompleted}
          unit={unit}
          lastActivityDate={lastActivityDate}
          onClose={() => setOpenStamp(null)}
        />
      )}
    </>
  );
}
