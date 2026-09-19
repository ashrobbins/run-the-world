export interface CheckpointLike {
  id: string;
  name: string;
  distance_from_start: number;
}

export type CheckpointState = "reached" | "next" | "locked";

/** Classifies each checkpoint relative to distance completed so far. */
export function classifyCheckpoints<T extends CheckpointLike>(
  checkpoints: T[],
  distanceCompleted: number,
): Array<T & { state: CheckpointState }> {
  const sorted = [...checkpoints].sort(
    (a, b) => a.distance_from_start - b.distance_from_start,
  );
  const nextIndex = sorted.findIndex(
    (c) => c.distance_from_start > distanceCompleted,
  );

  return sorted.map((checkpoint, index) => {
    let state: CheckpointState;
    if (nextIndex === -1) {
      state = "reached"; // completed distance covers every checkpoint
    } else if (index < nextIndex) {
      state = "reached";
    } else if (index === nextIndex) {
      state = "next";
    } else {
      state = "locked";
    }
    return { ...checkpoint, state };
  });
}

/**
 * Given the distance completed before and after a sync, returns the single furthest
 * checkpoint newly crossed this sync (or null if none was crossed) — this is what
 * decides whether the "checkpoint unlocked" celebration should show, vs. just
 * animating the running total.
 */
export function findNewlyCrossedCheckpoint<T extends CheckpointLike>(
  checkpoints: T[],
  distanceBefore: number,
  distanceAfter: number,
): T | null {
  const crossed = checkpoints
    .filter(
      (c) =>
        c.distance_from_start > distanceBefore &&
        c.distance_from_start <= distanceAfter,
    )
    .sort((a, b) => b.distance_from_start - a.distance_from_start);

  return crossed[0] ?? null;
}
