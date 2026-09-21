import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { findNewlyCrossedCheckpoint } from "@/lib/journeys/progress";

export interface ApplyDistanceResult {
  totalDistance: number; // km, the focus journey's total after this
  crossedCheckpoint: { id: string; name: string } | null;
}

/**
 * Credits `distanceAdded` km to every one of a user's active journeys — a single
 * real run counts toward all of them, not just one — then reports the focus
 * journey's new total and whether it just crossed a checkpoint. Shared by both
 * Strava sync and manual logging so they can't drift apart on this behavior.
 */
export async function applyDistanceToActiveJourneys(
  userId: string,
  distanceAdded: number,
  focusJourneyId?: string,
): Promise<ApplyDistanceResult> {
  const admin = createAdminClient();

  const { data: activeJourneys, error: activeJourneysError } = await admin
    .from("user_journeys")
    .select("id, journey_id, distance_completed")
    .eq("user_id", userId)
    .eq("status", "active");
  if (activeJourneysError || !activeJourneys || activeJourneys.length === 0) {
    throw new Error("No active journey for this user.");
  }
  const userJourney = activeJourneys.find((uj) => uj.id === focusJourneyId) ?? activeJourneys[0];
  const distanceBefore = userJourney.distance_completed;
  const totalDistance = distanceBefore + distanceAdded;

  if (distanceAdded > 0) {
    const updates = await Promise.all(
      activeJourneys.map((uj) =>
        admin
          .from("user_journeys")
          .update({ distance_completed: uj.distance_completed + distanceAdded })
          .eq("id", uj.id),
      ),
    );
    const updateError = updates.find((r) => r.error)?.error;
    if (updateError) throw updateError;
  }

  const { data: checkpoints } = await admin
    .from("checkpoints")
    .select("id, name, distance_from_start")
    .eq("journey_id", userJourney.journey_id);

  const crossed = checkpoints ? findNewlyCrossedCheckpoint(checkpoints, distanceBefore, totalDistance) : null;

  return {
    totalDistance,
    crossedCheckpoint: crossed ? { id: crossed.id, name: crossed.name } : null,
  };
}
