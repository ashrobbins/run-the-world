import { CheckpointMarker } from "@/components/checkpoint-marker/CheckpointMarker";
import { classifyCheckpoints, type CheckpointLike } from "@/lib/journeys/progress";

interface Checkpoint extends CheckpointLike {
  country_code: string;
}

export function CheckpointStampsRow({
  checkpoints,
  distanceCompleted,
}: {
  checkpoints: Checkpoint[];
  distanceCompleted: number;
}) {
  const classified = classifyCheckpoints(checkpoints, distanceCompleted);

  return (
    <div className="mt-3.5">
      <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-secondary)" }}>
        All checkpoints
      </div>
      <div className="flex flex-row gap-4 mt-2 overflow-x-auto pb-1">
        {classified.map((checkpoint) => (
          <div key={checkpoint.id} className="shrink-0">
            <CheckpointMarker
              countryCode={checkpoint.country_code}
              state={checkpoint.state}
              label={checkpoint.name}
              size={38}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
