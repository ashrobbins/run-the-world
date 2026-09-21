"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckpointMarker } from "@/components/checkpoint-marker/CheckpointMarker";
import { CheckpointStampBadge } from "@/components/journey/CheckpointStampBadge";
import { LandmarkIcon } from "@/components/journey/landmark-icons";
import { classifyCheckpoints, type CheckpointLike } from "@/lib/journeys/progress";
import { formatDistance, type UnitPreference } from "@/lib/units";

interface Landmark {
  name: string;
  icon_key: string;
}

interface Checkpoint extends CheckpointLike {
  country_code: string;
  landmarks: Landmark[];
}

export function CheckpointStampsRow({
  userJourneyId,
  routeLabel,
  checkpoints,
  distanceCompleted,
  unit,
  lastActivityDate,
}: {
  userJourneyId: string;
  routeLabel: string;
  checkpoints: Checkpoint[];
  distanceCompleted: number;
  unit: UnitPreference;
  lastActivityDate: string | null;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const classified = classifyCheckpoints(checkpoints, distanceCompleted);
  const openCheckpoint = classified.find((c) => c.id === openId) ?? null;

  return (
    <div className="mt-3.5">
      <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-secondary)" }}>
        All checkpoints
      </div>
      <div className="flex flex-row gap-4 mt-2 overflow-x-auto pb-1">
        {classified.map((checkpoint) => (
          <button key={checkpoint.id} onClick={() => setOpenId(checkpoint.id)} className="shrink-0 text-left">
            <CheckpointMarker
              countryCode={checkpoint.country_code}
              state={checkpoint.state}
              label={checkpoint.name}
              size={38}
            />
          </button>
        ))}
      </div>

      {openCheckpoint && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ background: "rgba(18, 32, 61, 0.35)", backdropFilter: "blur(2px)" }}
          onClick={() => setOpenId(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl p-6 relative"
            style={{ background: "var(--color-bg)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setOpenId(null)} aria-label="Close" className="absolute top-4 right-4">
              <CloseIcon />
            </button>

            <div className="flex justify-center mt-2">
              <CheckpointStampBadge name={openCheckpoint.name} />
            </div>

            <div className="text-center mt-4">
              <div className="text-lg font-extrabold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}>
                {openCheckpoint.name}
              </div>
              <div className="text-xs font-semibold mt-1" style={{ color: "var(--color-text-secondary)" }}>
                {openCheckpoint.state === "reached" && lastActivityDate
                  ? `Stamped ${new Date(lastActivityDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`
                  : openCheckpoint.state === "next"
                    ? `${formatDistance(openCheckpoint.distance_from_start - distanceCompleted, unit)} away`
                    : `${formatDistance(openCheckpoint.distance_from_start, unit)} into the journey`}
              </div>
            </div>

            {openCheckpoint.landmarks.length > 0 && (
              <div className="flex justify-center mt-4">
                <div className="flex flex-col items-center gap-1.5">
                  <LandmarkIcon iconKey={openCheckpoint.landmarks[0].icon_key} size={72} />
                  <span className="text-xs font-semibold" style={{ color: "var(--color-text-primary)" }}>
                    {openCheckpoint.landmarks[0].name}
                  </span>
                </div>
              </div>
            )}

            <div className="rounded-xl p-3.5 mt-4" style={{ background: "var(--color-card)" }}>
              <div className="flex items-center justify-between text-xs">
                <span style={{ color: "var(--color-text-secondary)" }}>Journey</span>
                <span className="font-semibold" style={{ color: "var(--color-text-primary)" }}>
                  {routeLabel}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs mt-2">
                <span style={{ color: "var(--color-text-secondary)" }}>Distance from start</span>
                <span className="font-semibold" style={{ color: "var(--color-text-primary)" }}>
                  {formatDistance(openCheckpoint.distance_from_start, unit)}
                </span>
              </div>
            </div>

            <Link
              href={`/journey/${userJourneyId}/map?focus=${openCheckpoint.id}`}
              className="block w-full rounded-xl py-3 text-sm font-bold text-white text-center mt-4"
              style={{ background: "var(--color-accent)", fontFamily: "var(--font-heading)" }}
            >
              View on journey map
            </Link>
          </div>
        </div>
      )}
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
