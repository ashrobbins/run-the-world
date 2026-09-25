"use client";

import { useState } from "react";
import { CheckpointMarker } from "@/components/checkpoint-marker/CheckpointMarker";
import { CheckpointStampModal } from "@/components/journey/CheckpointStampModal";
import { classifyCheckpoints, type CheckpointLike } from "@/lib/journeys/progress";
import type { UnitPreference } from "@/lib/units";

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
        <CheckpointStampModal
          checkpoint={openCheckpoint}
          userJourneyId={userJourneyId}
          routeLabel={routeLabel}
          distanceCompleted={distanceCompleted}
          unit={unit}
          lastActivityDate={lastActivityDate}
          onClose={() => setOpenId(null)}
        />
      )}
    </div>
  );
}
