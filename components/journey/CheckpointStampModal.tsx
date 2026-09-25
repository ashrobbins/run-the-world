"use client";

import Link from "next/link";
import { CheckpointStampBadge } from "@/components/journey/CheckpointStampBadge";
import { LandmarkIcon } from "@/components/journey/landmark-icons";
import type { CheckpointState } from "@/lib/journeys/progress";
import { formatDistance, type UnitPreference } from "@/lib/units";

interface Landmark {
  name: string;
  icon_key: string;
}

export interface StampModalCheckpoint {
  id: string;
  name: string;
  state: CheckpointState;
  distance_from_start: number;
  landmarks: Landmark[];
}

/** The passport-stamp quick-view modal — shared by the Journey Detail checkpoint
 * row and the Passport grid, since both need to show the same stamp detail. */
export function CheckpointStampModal({
  checkpoint,
  userJourneyId,
  routeLabel,
  distanceCompleted,
  unit,
  lastActivityDate,
  onClose,
}: {
  checkpoint: StampModalCheckpoint;
  userJourneyId: string;
  routeLabel: string;
  distanceCompleted: number;
  unit: UnitPreference;
  lastActivityDate: string | null;
  onClose: () => void;
}) {
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
          <CheckpointStampBadge name={checkpoint.name} />
        </div>

        <div className="text-center mt-4">
          <div className="text-lg font-extrabold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}>
            {checkpoint.name}
          </div>
          <div className="text-xs font-semibold mt-1" style={{ color: "var(--color-text-secondary)" }}>
            {checkpoint.state === "reached" && lastActivityDate
              ? `Stamped ${new Date(lastActivityDate).toLocaleDateString("en-GB", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })}`
              : checkpoint.state === "next"
                ? `${formatDistance(checkpoint.distance_from_start - distanceCompleted, unit)} away`
                : `${formatDistance(checkpoint.distance_from_start, unit)} into the journey`}
          </div>
        </div>

        {checkpoint.landmarks.length > 0 && (
          <div className="flex justify-center mt-4">
            <div className="flex flex-col items-center gap-1.5">
              <LandmarkIcon iconKey={checkpoint.landmarks[0].icon_key} size={72} />
              <span className="text-xs font-semibold" style={{ color: "var(--color-text-primary)" }}>
                {checkpoint.landmarks[0].name}
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
              {formatDistance(checkpoint.distance_from_start, unit)}
            </span>
          </div>
        </div>

        <Link
          href={`/journey/${userJourneyId}/map?focus=${checkpoint.id}`}
          className="block w-full rounded-xl py-3 text-sm font-bold text-white text-center mt-4"
          style={{ background: "var(--color-accent)", fontFamily: "var(--font-heading)" }}
        >
          View on journey map
        </Link>
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
